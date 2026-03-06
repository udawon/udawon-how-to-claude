import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "How to Claude - Claude Code 활용 매뉴얼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1C1C1A 0%, #2A2A27 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 클로드 캐릭터 표현 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "#DA7756",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                color: "white",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              C
            </div>
          </div>
        </div>

        {/* 제목 */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#EEEEE8",
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          How to Claude
        </div>

        {/* 부제목 */}
        <div
          style={{
            fontSize: "24px",
            color: "#A0A098",
            marginBottom: "40px",
          }}
        >
          Claude Code 활용 매뉴얼
        </div>

        {/* 태그들 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {["기본 기능", "워크플로우", "팁 & 트릭", "설정", "트러블슈팅"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  background: "rgba(218, 119, 86, 0.15)",
                  color: "#DA7756",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
