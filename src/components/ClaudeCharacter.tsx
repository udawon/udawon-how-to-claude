import React from "react";

type Pose = "wave" | "search" | "write" | "think" | "happy" | "peek"
  | "run" | "love" | "sleep" | "code" | "point" | "sit" | "surprise" | "read";

interface ClaudeCharacterProps {
  pose: Pose;
  size?: number;
  className?: string;
}

// Claude Code 아이콘 — lobe-icons 레퍼런스 기반 1:1 픽셀 트레이싱
const B = "#DA7756"; // 몸통색

// 기본 픽셀맵 (14x10)
const BASE: number[][] = [
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
];

// 찡긋 (happy) — 눈 아래 한줄만
const HAPPY: number[][] = [
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

// 윙크 (write) — 왼쪽 눈만, 오른쪽 찡긋
const WINK: number[][] = [
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
];

// 달리기 — 다리 비대칭
const RUN: number[][] = [
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,1,0,0,0,1,0,0,0,0,0],
];

// 놀람 — 눈 크게 (1x3)
const SURPRISE: number[][] = [
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
];

// 잠자기 — 눈 없음 (감은 눈)
const SLEEP: number[][] = [
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
  [0,0,0,1,0,0,0,0,0,0,1,0,0,0],
];

// 앉기 — 다리 접힘
const SIT: number[][] = [
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [0,0,1,1,0,1,1,1,1,0,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,0,0,0,0,0,1,1,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,1,0,0],
];

function PixelBody({ pixels, ox = 0, oy = 0 }: { pixels: number[][]; ox?: number; oy?: number }) {
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < pixels.length; y++) {
    for (let x = 0; x < pixels[y].length; x++) {
      if (pixels[y][x] === 1) {
        rects.push(<rect key={`${x}-${y}`} x={ox + x} y={oy + y} width={1} height={1} fill={B} />);
      }
    }
  }
  return <>{rects}</>;
}

// 하트 픽셀
function Heart({ x, y, s = 0.4 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="1" y="0" width="2" height="1" fill="#E85050" />
      <rect x="5" y="0" width="2" height="1" fill="#E85050" />
      <rect x="0" y="1" width="4" height="1" fill="#E85050" />
      <rect x="4" y="1" width="4" height="1" fill="#E85050" />
      <rect x="0" y="2" width="8" height="1" fill="#E85050" />
      <rect x="1" y="3" width="6" height="1" fill="#E85050" />
      <rect x="2" y="4" width="4" height="1" fill="#E85050" />
      <rect x="3" y="5" width="2" height="1" fill="#E85050" />
    </g>
  );
}

export function ClaudeCharacter({ pose, size = 80, className = "" }: ClaudeCharacterProps) {
  const s = { imageRendering: "pixelated" as const };

  const poses: Record<Pose, React.ReactNode> = {

    // 기본 정면
    wave: (
      <svg width={size} height={size} viewBox="0 0 14 10" fill="none" className={className} style={s}>
        <PixelBody pixels={BASE} />
      </svg>
    ),

    // 돋보기 탐색
    search: (
      <svg width={size} height={size} viewBox="0 0 19 10" fill="none" className={className} style={s}>
        <PixelBody pixels={BASE} />
        <circle cx="16.5" cy="3" r="1.8" stroke={B} strokeWidth="0.7" fill="none" />
        <line x1="15.2" y1="4.5" x2="14.5" y2="5.5" stroke={B} strokeWidth="0.7" />
      </svg>
    ),

    // 연필 들고 윙크
    write: (
      <svg width={size} height={size} viewBox="0 0 18 10" fill="none" className={className} style={s}>
        <PixelBody pixels={WINK} />
        <rect x="15" y="1" width="1" height="7" fill="#F0C040" />
        <rect x="15" y="8" width="1" height="1.5" fill="#5C4030" />
      </svg>
    ),

    // 물음표 생각
    think: (
      <svg width={size} height={size} viewBox="0 0 18 10" fill="none" className={className} style={s}>
        <PixelBody pixels={BASE} />
        <text x="16" y="4" fontSize="4" fontWeight="bold" fill={B} fontFamily="monospace">?</text>
      </svg>
    ),

    // 찡긋 기쁨
    happy: (
      <svg width={size} height={size} viewBox="0 0 14 10" fill="none" className={className} style={s}>
        <PixelBody pixels={HAPPY} />
      </svg>
    ),

    // 벽 뒤 엿보기
    peek: (
      <svg width={size} height={size} viewBox="0 0 14 10" fill="none" className={className} style={s}>
        <rect x="0" y="0" width="3.5" height="10" fill="var(--bg-subtle)" />
        <PixelBody pixels={BASE} />
        <rect x="0" y="0" width="3.5" height="10" fill="var(--bg-subtle)" />
      </svg>
    ),

    // 달리기
    run: (
      <svg width={size} height={size} viewBox="0 0 14 10" fill="none" className={className} style={s}>
        <PixelBody pixels={RUN} />
      </svg>
    ),

    // 하트 (사랑)
    love: (
      <svg width={size} height={size} viewBox="0 0 18 10" fill="none" className={className} style={s}>
        <PixelBody pixels={HAPPY} />
        <Heart x="14.5" y="0.5" s={0.35} />
      </svg>
    ),

    // 잠자기
    sleep: (
      <svg width={size} height={size} viewBox="0 0 19 10" fill="none" className={className} style={s}>
        <PixelBody pixels={SLEEP} />
        <text x="15" y="3" fontSize="2.5" fontWeight="bold" fill={B} fontFamily="monospace" opacity="0.7">z</text>
        <text x="16.5" y="1.5" fontSize="2" fontWeight="bold" fill={B} fontFamily="monospace" opacity="0.5">z</text>
      </svg>
    ),

    // 코딩
    code: (
      <svg width={size} height={size} viewBox="0 0 19 10" fill="none" className={className} style={s}>
        <PixelBody pixels={BASE} />
        <text x="15" y="5" fontSize="3.5" fontWeight="bold" fill={B} fontFamily="monospace">&lt;/&gt;</text>
      </svg>
    ),

    // 오른쪽 가리키기
    point: (
      <svg width={size} height={size} viewBox="0 0 18 10" fill="none" className={className} style={s}>
        <PixelBody pixels={WINK} />
        <rect x="14" y="4.5" width="3" height="1" fill={B} />
        <rect x="16" y="3.5" width="1" height="1" fill={B} />
        <rect x="16" y="5.5" width="1" height="1" fill={B} />
      </svg>
    ),

    // 앉기
    sit: (
      <svg width={size} height={size} viewBox="0 0 14 10" fill="none" className={className} style={s}>
        <PixelBody pixels={SIT} />
      </svg>
    ),

    // 놀람
    surprise: (
      <svg width={size} height={size} viewBox="0 0 17 10" fill="none" className={className} style={s}>
        <PixelBody pixels={SURPRISE} />
        <text x="15" y="4" fontSize="3" fontWeight="bold" fill={B} fontFamily="monospace">!</text>
      </svg>
    ),

    // 책 읽기
    read: (
      <svg width={size} height={size} viewBox="0 0 18 11" fill="none" className={className} style={s}>
        <PixelBody pixels={BASE} />
        {/* 책 */}
        <rect x="14.5" y="3" width="3" height="4" fill={B} opacity="0.3" />
        <line x1="16" y1="3" x2="16" y2="7" stroke={B} strokeWidth="0.3" />
      </svg>
    ),
  };

  return <>{poses[pose] || null}</>;
}
