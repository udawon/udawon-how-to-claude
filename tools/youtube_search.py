"""
YouTube 검색 도구
- YouTube Data API v3로 "Claude" / "클로드" 키워드 영상 검색
- 최근 12시간 내 업로드된 영상만 필터링
- 결과를 JSON으로 출력
"""

import os
import sys
import json
import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from googleapiclient.discovery import build
except ImportError:
    print("ERROR: google-api-python-client 패키지가 필요합니다.")
    print("설치: pip install google-api-python-client")
    sys.exit(1)


def load_api_key():
    """환경변수 또는 .env.local에서 API 키 로드"""
    key = os.environ.get("YOUTUBE_API_KEY")
    if key:
        return key

    env_path = Path(__file__).parent / ".env.local"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("YOUTUBE_API_KEY="):
                return line.split("=", 1)[1].strip()

    print("ERROR: YOUTUBE_API_KEY를 찾을 수 없습니다.")
    print("  .env.local 파일에 YOUTUBE_API_KEY=... 를 추가하세요.")
    sys.exit(1)


def search_youtube(api_key, hours=12, max_results=30):
    """YouTube에서 Claude 관련 영상 검색"""
    youtube = build("youtube", "v3", developerKey=api_key)

    published_after = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()

    # 핵심 키워드 2개: 영어 + 한국어
    searches = [
        {"keyword": "Claude", "lang": "en"},   # 영어 키워드
        {"keyword": "클로드", "lang": "ko"},   # 한국어 키워드
    ]
    all_videos = {}

    for search in searches:
        keyword = search["keyword"]
        lang = search["lang"]
        try:
            request = youtube.search().list(
                part="snippet",
                q=keyword,
                type="video",
                order="date",
                publishedAfter=published_after,
                maxResults=max_results,
                relevanceLanguage=lang,
                videoDuration="medium",  # 4~20분 영상 (너무 짧은 쇼츠 제외)
            )
            response = request.execute()

            for item in response.get("items", []):
                video_id = item["id"]["videoId"]
                if video_id not in all_videos:
                    snippet = item["snippet"]
                    all_videos[video_id] = {
                        "video_id": video_id,
                        "title": snippet["title"],
                        "description": snippet["description"],
                        "channel": snippet["channelTitle"],
                        "published_at": snippet["publishedAt"],
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                        "matched_keyword": keyword,
                        "search_lang": lang,
                    }
        except Exception as e:
            print(f"WARNING: '{keyword}' ({lang}) 검색 실패: {e}", file=sys.stderr)

    # 상세 정보 추가 (조회수, 좋아요 등)
    if all_videos:
        video_ids = list(all_videos.keys())
        # API는 50개씩 조회 가능
        for i in range(0, len(video_ids), 50):
            batch = video_ids[i:i+50]
            try:
                details = youtube.videos().list(
                    part="statistics,contentDetails",
                    id=",".join(batch),
                ).execute()

                for item in details.get("items", []):
                    vid = item["id"]
                    stats = item.get("statistics", {})
                    all_videos[vid]["view_count"] = int(stats.get("viewCount", 0))
                    all_videos[vid]["like_count"] = int(stats.get("likeCount", 0))
                    all_videos[vid]["comment_count"] = int(stats.get("commentCount", 0))
                    all_videos[vid]["duration"] = item["contentDetails"]["duration"]
            except Exception as e:
                print(f"WARNING: 상세 정보 조회 실패: {e}", file=sys.stderr)

    videos = sorted(all_videos.values(), key=lambda v: v.get("view_count", 0), reverse=True)
    return videos


def main():
    parser = argparse.ArgumentParser(description="YouTube Claude 영상 검색")
    parser.add_argument("--hours", type=int, default=12, help="검색 범위 (시간, 기본 12)")
    parser.add_argument("--max-results", type=int, default=30, help="키워드당 최대 결과 수")
    parser.add_argument("--output", type=str, help="결과 저장 파일 경로 (JSON)")
    args = parser.parse_args()

    api_key = load_api_key()
    videos = search_youtube(api_key, hours=args.hours, max_results=args.max_results)

    result = {
        "search_time": datetime.now(timezone.utc).isoformat(),
        "hours_range": args.hours,
        "total_found": len(videos),
        "videos": videos,
    }

    output_json = json.dumps(result, ensure_ascii=False, indent=2)

    if args.output:
        Path(args.output).write_text(output_json, encoding="utf-8")
        print(f"결과 저장: {args.output} ({len(videos)}개 영상)")
    else:
        print(output_json)


if __name__ == "__main__":
    main()
