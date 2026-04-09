import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "How to Claude - Claude Code 활용 매뉴얼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 클로드 HAPPY 픽셀맵 (14x10)
const HAPPY = [
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
];

// 하트 픽셀맵 (8x6)
const HEART = [
  [0,1,1,0,0,1,1,0],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,1,1,0,0,0],
];

const PX = 8;

export default function Image() {
  // 클로드 몸통 픽셀
  const bodyPixels: { x: number; y: number }[] = [];
  HAPPY.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) bodyPixels.push({ x, y });
    });
  });

  // 하트 픽셀
  const heartPixels: { x: number; y: number }[] = [];
  HEART.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) heartPixels.push({ x, y });
    });
  });

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
        {/* 클로드 캐릭터 + 하트 */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: `${14 * PX + 50}px`,
            height: `${10 * PX + 10}px`,
            marginBottom: "32px",
          }}
        >
          {bodyPixels.map((p, i) => (
            <div
              key={`b${i}`}
              style={{
                position: "absolute",
                left: `${p.x * PX}px`,
                top: `${p.y * PX}px`,
                width: `${PX}px`,
                height: `${PX}px`,
                background: "#DA7756",
              }}
            />
          ))}
          {heartPixels.map((p, i) => (
            <div
              key={`h${i}`}
              style={{
                position: "absolute",
                left: `${14 * PX + p.x * 4}px`,
                top: `${p.y * 4}px`,
                width: "4px",
                height: "4px",
                background: "#E85050",
              }}
            />
          ))}
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
        <div style={{ display: "flex", gap: "12px" }}>
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
