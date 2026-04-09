/**
 * 카드뉴스 JSON → PNG 6장 렌더링
 * Node.js + Playwright 사용
 *
 * 사용법: node render.mjs <json_path> <output_dir>
 */

import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const [,, jsonPath, outputDir] = process.argv;

if (!jsonPath || !outputDir) {
  console.error('사용법: node render.mjs <json_path> <output_dir>');
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
mkdirSync(outputDir, { recursive: true });

// ── 디자인 토큰 ──────────────────────────────────────────────────────────────
const T = {
  bg:      '#EBF6FD',
  primary: '#1BA3E8',
  dark:    '#0D7AC0',
  text:    '#1A2B3C',
  white:   '#FFFFFF',
  size:    1080,
};

// ── 공통 래퍼 HTML ───────────────────────────────────────────────────────────
function wrap(body) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: ${T.size}px; height: ${T.size}px;
  background: ${T.bg};
  font-family: 'Noto Sans KR', sans-serif;
  color: ${T.text};
  overflow: hidden;
  position: relative;
}
.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: ${T.primary};
  opacity: 0.08;
}
</style>
</head>
<body>${body}</body>
</html>`;
}

// ── 카드 1: 표지 ─────────────────────────────────────────────────────────────
function renderCover(cover) {
  const lines = cover.title_lines || ['제목', '없음', ''];
  const hl = cover.highlight_line ?? 1;

  const titleHtml = lines.map((line, i) => {
    const color = i === hl ? T.primary : T.text;
    return `<div style="color:${color};line-height:1.15;">${line}</div>`;
  }).join('');

  return wrap(`
  <div class="deco-circle" style="width:400px;height:400px;top:-120px;right:-120px;"></div>
  <div class="deco-circle" style="width:250px;height:250px;bottom:200px;left:-80px;"></div>

  <!-- 상단 바 -->
  <div style="position:absolute;top:0;left:0;right:0;height:8px;background:${T.primary};"></div>

  <!-- 로고 + 번호 -->
  <div style="position:absolute;top:28px;left:48px;right:48px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:28px;font-weight:900;color:${T.primary};letter-spacing:-1px;">약문약답</div>
    <div style="font-size:22px;font-weight:700;color:${T.primary};background:white;padding:6px 18px;border-radius:20px;">01 / 06</div>
  </div>

  <!-- 태그 -->
  <div style="position:absolute;top:160px;left:48px;">
    <span style="background:${T.primary};color:white;font-size:26px;font-weight:700;padding:8px 24px;border-radius:24px;">${cover.tag || '💊 약학 정보'}</span>
  </div>

  <!-- 메인 제목 -->
  <div style="position:absolute;top:240px;left:48px;right:80px;font-size:72px;font-weight:900;line-height:1.1;">
    ${titleHtml}
  </div>

  <!-- 부제목 -->
  <div style="position:absolute;bottom:180px;left:48px;right:48px;">
    <div style="background:white;border-radius:16px;padding:24px 32px;font-size:30px;font-weight:700;color:${T.text};line-height:1.5;box-shadow:0 4px 20px rgba(27,163,232,0.12);">
      ${cover.subtitle || ''}
    </div>
  </div>

  <!-- 하단 바 -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:${T.primary};display:flex;align-items:center;justify-content:center;">
    <span style="color:white;font-size:26px;font-weight:700;letter-spacing:2px;">약문약답 YMYD</span>
  </div>
  `);
}

// ── 카드 2~5: 본문 ───────────────────────────────────────────────────────────
function renderContent(item, cardNum) {
  const titleHtml = item.title_hl
    ? item.title.replace(item.title_hl, `<span style="color:${T.primary};">${item.title_hl}</span>`)
    : item.title;

  return wrap(`
  <div class="deco-circle" style="width:300px;height:300px;top:-80px;right:-60px;"></div>
  <div class="deco-circle" style="width:200px;height:200px;bottom:250px;left:-60px;"></div>

  <!-- 상단 바 -->
  <div style="position:absolute;top:0;left:0;right:0;height:8px;background:${T.primary};"></div>

  <!-- 로고 + 번호 -->
  <div style="position:absolute;top:28px;left:48px;right:48px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:28px;font-weight:900;color:${T.primary};">약문약답</div>
    <div style="font-size:22px;font-weight:700;color:${T.primary};background:white;padding:6px 18px;border-radius:20px;">0${cardNum} / 06</div>
  </div>

  <!-- 배지 -->
  <div style="position:absolute;top:140px;left:48px;display:flex;align-items:center;gap:16px;">
    <div style="width:64px;height:64px;background:${T.primary};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:white;">${item.badge_num}</div>
    <div style="font-size:28px;font-weight:700;color:${T.primary};">${item.badge_label}</div>
  </div>

  <!-- 제목 -->
  <div style="position:absolute;top:240px;left:48px;right:48px;font-size:60px;font-weight:900;line-height:1.2;">
    ${titleHtml}
  </div>

  <!-- 본문 박스 -->
  <div style="position:absolute;top:400px;left:48px;right:48px;background:white;border-radius:20px;padding:36px;box-shadow:0 4px 24px rgba(27,163,232,0.10);">
    <div style="font-size:30px;font-weight:700;line-height:1.7;color:${T.text};">
      ${item.body}
    </div>
  </div>

  <!-- TIP 박스 -->
  <div style="position:absolute;bottom:100px;left:48px;right:48px;background:${T.primary};border-radius:16px;padding:24px 32px;display:flex;align-items:flex-start;gap:16px;">
    <span style="font-size:28px;">💡</span>
    <div style="font-size:26px;font-weight:700;color:white;line-height:1.5;">${item.tip}</div>
  </div>

  <!-- 하단 바 -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:72px;background:${T.primary};display:flex;align-items:center;justify-content:center;">
    <span style="color:white;font-size:24px;font-weight:700;letter-spacing:2px;">약문약답 YMYD</span>
  </div>
  `);
}

// ── 카드 6: 요약 ─────────────────────────────────────────────────────────────
function renderSummary(summary) {
  const items = (summary.items || []).map(it => `
    <div style="display:flex;align-items:center;gap:20px;padding:16px 0;border-bottom:1px solid rgba(27,163,232,0.2);">
      <div style="width:12px;height:12px;background:${T.primary};border-radius:50%;flex-shrink:0;"></div>
      <div>
        <div style="font-size:30px;font-weight:900;color:${T.text};">${it.text}</div>
        <div style="font-size:24px;font-weight:400;color:#5a7a95;margin-top:4px;">${it.sub}</div>
      </div>
    </div>
  `).join('');

  return wrap(`
  <!-- 파란 배경 상단 영역 -->
  <div style="position:absolute;top:0;left:0;right:0;height:340px;background:${T.primary};">
    <div style="position:absolute;top:28px;left:48px;right:48px;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-size:28px;font-weight:900;color:white;">약문약답</div>
      <div style="font-size:22px;font-weight:700;color:${T.primary};background:white;padding:6px 18px;border-radius:20px;">06 / 06</div>
    </div>
    <div style="position:absolute;top:120px;left:48px;right:48px;text-align:center;">
      <div style="font-size:36px;font-weight:900;color:white;line-height:1.3;">${summary.title}</div>
    </div>
  </div>

  <!-- 체크리스트 -->
  <div style="position:absolute;top:360px;left:48px;right:48px;">
    ${items}
  </div>

  <!-- CTA 박스 -->
  <div style="position:absolute;bottom:100px;left:48px;right:48px;background:${T.primary};border-radius:20px;padding:28px 36px;text-align:center;box-shadow:0 8px 32px rgba(27,163,232,0.3);">
    <div style="font-size:30px;font-weight:900;color:white;line-height:1.5;">${summary.cta}</div>
  </div>

  <!-- 하단 바 -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:72px;background:${T.dark};display:flex;align-items:center;justify-content:center;">
    <span style="color:white;font-size:24px;font-weight:700;letter-spacing:2px;">약문약답 YMYD</span>
  </div>
  `);
}

// ── 메인 ─────────────────────────────────────────────────────────────────────
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: T.size, height: T.size });

  const files = [];
  const cards = [
    { name: 'card_01_cover',   html: renderCover(data.cover) },
    { name: 'card_02_content', html: renderContent(data.contents[0], 2) },
    { name: 'card_03_content', html: renderContent(data.contents[1], 3) },
    { name: 'card_04_content', html: renderContent(data.contents[2], 4) },
    { name: 'card_05_content', html: renderContent(data.contents[3], 5) },
    { name: 'card_06_summary', html: renderSummary(data.summary) },
  ];

  for (const card of cards) {
    await page.setContent(card.html, { waitUntil: 'networkidle' });
    const outPath = join(resolve(outputDir), `${card.name}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    files.push(outPath);
    console.log(`  저장: ${card.name}.png`);
  }

  await browser.close();
  console.log(JSON.stringify({ files }));
})().catch(err => {
  console.error('렌더링 오류:', err.message);
  process.exit(1);
});
