"use client";

import { useState, useEffect } from "react";
import { ClaudeCharacter } from "./ClaudeCharacter";

type Pose = "wave" | "search" | "write" | "think" | "happy" | "run" | "love" | "sleep" | "code" | "point" | "sit" | "surprise" | "read";

const ALL_POSES: Pose[] = ["wave", "search", "write", "think", "happy", "run", "love", "sleep", "code", "point", "sit", "surprise", "read"];
const DRIFT_CLASSES = ["bg-drift-1", "bg-drift-2", "bg-drift-3", "bg-drift-4"];
const MIN_DISTANCE = 35; // 최소 안전거리 (% 단위)

interface FloatingChar {
  pose: Pose;
  size: number;
  top: number;
  left: number;
  rotate: number;
  drift: string;
}

function isFarEnough(x: number, y: number, placed: { left: number; top: number }[]): boolean {
  return placed.every(
    (p) => Math.hypot(x - p.left, y - p.top) >= MIN_DISTANCE
  );
}

function generateChars(): FloatingChar[] {
  const chars: FloatingChar[] = [];
  const usedPoses = new Set<Pose>();
  const placed: { left: number; top: number }[] = [];

  for (let i = 0; i < 4; i++) {
    let pose: Pose;
    do {
      pose = ALL_POSES[Math.floor(Math.random() * ALL_POSES.length)];
    } while (usedPoses.has(pose));
    usedPoses.add(pose);

    // 안전거리를 확보하는 위치 찾기
    let top = 0, left = 0;
    let attempts = 0;
    do {
      top = 5 + Math.random() * 80;
      left = 3 + Math.random() * 90;
      attempts++;
    } while (!isFarEnough(left, top, placed) && attempts < 50);

    placed.push({ left, top });

    chars.push({
      pose,
      size: 80 + Math.floor(Math.random() * 60),
      top,
      left,
      rotate: -30 + Math.random() * 60,
      drift: DRIFT_CLASSES[i],
    });
  }
  return chars;
}

export function BackgroundCharacters() {
  const [chars, setChars] = useState<FloatingChar[]>([]);

  useEffect(() => {
    setChars(generateChars());
  }, []);

  if (chars.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      {chars.map((c, i) => (
        <div
          key={i}
          className={`bg-character ${c.drift}`}
          style={{
            top: `${c.top}%`,
            left: `${c.left}%`,
            ["--rotate" as string]: `${c.rotate}deg`,
          }}
        >
          <ClaudeCharacter pose={c.pose} size={c.size} />
        </div>
      ))}
    </div>
  );
}
