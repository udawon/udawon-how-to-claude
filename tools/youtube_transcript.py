"""
YouTube 자막/음성 추출 도구
- 1순위: 자막 추출 (수동 + 자동생성)
- 2순위: 음성 다운로드 → Whisper 음성인식
- 3순위: 메타데이터(제목, 설명, 댓글)로 폴백
"""

import os
import sys
import json
import argparse
import tempfile
from pathlib import Path

# 자막 추출
try:
    from youtube_transcript_api import YouTubeTranscriptApi
    HAS_TRANSCRIPT_API = True
except ImportError:
    HAS_TRANSCRIPT_API = False

# 음성 다운로드
try:
    import yt_dlp
    HAS_YTDLP = True
except ImportError:
    HAS_YTDLP = False

# 음성 인식
try:
    from faster_whisper import WhisperModel
    HAS_WHISPER = True
except ImportError:
    HAS_WHISPER = False

# YouTube API (메타데이터/댓글 폴백용)
try:
    from googleapiclient.discovery import build
    HAS_YOUTUBE_API = True
except ImportError:
    HAS_YOUTUBE_API = False


def load_api_key():
    """환경변수 또는 .env.local에서 API 키 로드"""
    key = os.environ.get("YOUTUBE_API_KEY")
    if key:
        return key
    env_path = Path(__file__).parent.parent / ".env.local"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("YOUTUBE_API_KEY="):
                return line.split("=", 1)[1].strip()
    return None


def get_transcript_via_api(video_id):
    """1순위: youtube-transcript-api로 자막 추출"""
    if not HAS_TRANSCRIPT_API:
        return None, "youtube-transcript-api 미설치"

    try:
        ytt_api = YouTubeTranscriptApi()
        # 한국어 > 영어 > 자동생성 순으로 시도
        transcript = ytt_api.fetch(
            video_id,
            languages=["ko", "en", "ja"],
        )
        text = " ".join(snippet.text for snippet in transcript.snippets)
        return text, "subtitle"
    except Exception:
        pass

    # 자동생성 자막 시도
    try:
        transcript_list = ytt_api.list(video_id)
        for t in transcript_list:
            if t.is_generated:
                transcript = ytt_api.fetch(video_id, languages=[t.language_code])
                text = " ".join(snippet.text for snippet in transcript.snippets)
                return text, "auto_subtitle"
    except Exception:
        pass

    return None, "자막 없음"


def get_transcript_via_whisper(video_id, model_size="base"):
    """2순위: 음성 다운로드 → Whisper로 변환"""
    if not HAS_YTDLP:
        return None, "yt-dlp 미설치"
    if not HAS_WHISPER:
        return None, "faster-whisper 미설치"

    with tempfile.TemporaryDirectory() as tmpdir:
        audio_path = os.path.join(tmpdir, "audio")

        # 음성만 다운로드
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": audio_path,
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
                "preferredquality": "16",
            }],
            "quiet": True,
            "no_warnings": True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([f"https://www.youtube.com/watch?v={video_id}"])
        except Exception as e:
            return None, f"음성 다운로드 실패: {e}"

        # wav 파일 찾기
        wav_files = list(Path(tmpdir).glob("audio*"))
        if not wav_files:
            return None, "음성 파일 생성 실패"

        wav_path = str(wav_files[0])

        # Whisper 음성인식
        try:
            model = WhisperModel(model_size, device="cpu", compute_type="int8")
            segments, info = model.transcribe(wav_path, beam_size=5)
            text = " ".join(segment.text for segment in segments)
            detected_lang = info.language
            return text, f"whisper_{detected_lang}"
        except Exception as e:
            return None, f"Whisper 변환 실패: {e}"


def get_metadata_fallback(video_id):
    """3순위: 메타데이터(제목, 설명, 댓글)로 폴백"""
    api_key = load_api_key()
    if not api_key or not HAS_YOUTUBE_API:
        return None, "YouTube API 미사용"

    youtube = build("youtube", "v3", developerKey=api_key)

    parts = []

    # 영상 상세 정보
    try:
        response = youtube.videos().list(
            part="snippet",
            id=video_id,
        ).execute()

        if response["items"]:
            snippet = response["items"][0]["snippet"]
            parts.append(f"제목: {snippet['title']}")
            parts.append(f"설명: {snippet['description']}")
            if snippet.get("tags"):
                parts.append(f"태그: {', '.join(snippet['tags'])}")
    except Exception:
        pass

    # 상위 댓글 20개
    try:
        response = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=20,
            order="relevance",
        ).execute()

        comments = []
        for item in response.get("items", []):
            comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            comments.append(comment)

        if comments:
            parts.append(f"주요 댓글:\n" + "\n".join(f"- {c}" for c in comments))
    except Exception:
        pass

    if parts:
        return "\n\n".join(parts), "metadata"

    return None, "메타데이터 수집 실패"


def extract_content(video_id, whisper_model="base"):
    """영상 콘텐츠 추출 (3단계 폴백)"""

    # 1순위: 자막
    text, method = get_transcript_via_api(video_id)
    if text:
        return {"text": text, "method": method, "video_id": video_id}

    # 2순위: Whisper 음성인식
    print(f"  자막 없음 → Whisper 음성인식 시도 중... (video: {video_id})", file=sys.stderr)
    text, method = get_transcript_via_whisper(video_id, whisper_model)
    if text:
        return {"text": text, "method": method, "video_id": video_id}

    # 3순위: 메타데이터
    print(f"  Whisper 실패 → 메타데이터 폴백 (video: {video_id})", file=sys.stderr)
    text, method = get_metadata_fallback(video_id)
    if text:
        return {"text": text, "method": method, "video_id": video_id}

    return {"text": None, "method": "failed", "video_id": video_id}


def main():
    parser = argparse.ArgumentParser(description="YouTube 영상 콘텐츠 추출")
    parser.add_argument("input", help="영상 ID, URL, 또는 검색 결과 JSON 파일 경로")
    parser.add_argument("--whisper-model", default="base",
                        choices=["tiny", "base", "small", "medium", "large-v3"],
                        help="Whisper 모델 크기 (기본: base)")
    parser.add_argument("--output", type=str, help="결과 저장 파일 경로")
    args = parser.parse_args()

    # 입력 파싱
    video_ids = []

    if args.input.endswith(".json"):
        # JSON 파일에서 영상 목록 로드
        data = json.loads(Path(args.input).read_text(encoding="utf-8"))
        videos_data = data.get("videos", [])
        for v in videos_data:
            video_ids.append({
                "video_id": v["video_id"],
                "title": v.get("title", ""),
                "url": v.get("url", ""),
                "channel": v.get("channel", ""),
            })
    elif "youtube.com" in args.input or "youtu.be" in args.input:
        # URL에서 ID 추출
        if "v=" in args.input:
            vid = args.input.split("v=")[1].split("&")[0]
        elif "youtu.be/" in args.input:
            vid = args.input.split("youtu.be/")[1].split("?")[0]
        else:
            vid = args.input
        video_ids.append({"video_id": vid, "title": "", "url": args.input, "channel": ""})
    else:
        # 단일 ID
        video_ids.append({"video_id": args.input, "title": "", "url": "", "channel": ""})

    # 콘텐츠 추출
    results = []
    for i, v in enumerate(video_ids):
        print(f"[{i+1}/{len(video_ids)}] {v.get('title', v['video_id'])}...", file=sys.stderr)
        content = extract_content(v["video_id"], args.whisper_model)
        content["title"] = v.get("title", "")
        content["url"] = v.get("url", "")
        content["channel"] = v.get("channel", "")
        results.append(content)

    output = {
        "total": len(results),
        "success": sum(1 for r in results if r["method"] != "failed"),
        "methods": {
            "subtitle": sum(1 for r in results if r["method"] == "subtitle"),
            "auto_subtitle": sum(1 for r in results if r["method"] == "auto_subtitle"),
            "whisper": sum(1 for r in results if r["method"].startswith("whisper")),
            "metadata": sum(1 for r in results if r["method"] == "metadata"),
            "failed": sum(1 for r in results if r["method"] == "failed"),
        },
        "results": results,
    }

    output_json = json.dumps(output, ensure_ascii=False, indent=2)

    if args.output:
        Path(args.output).write_text(output_json, encoding="utf-8")
        print(f"\n결과 저장: {args.output}", file=sys.stderr)
    else:
        print(output_json)


if __name__ == "__main__":
    main()
