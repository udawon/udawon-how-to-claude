/**
 * 카드뉴스 JSON → PNG 이미지 생성
 * 사용법: node render.mjs <json파일경로> <출력폴더>
 */

import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BRAND = {
  blue: '#1BA3E8',
  blueDark: '#0D7AC0',
  bg: '#EBF6FD',
  text: '#1A2B3C',
  textSub: '#2C4A5A',
  textMuted: '#4A7A9B',
  white: '#FFFFFF',
  red: '#E53935',
};

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px; height: 1080px;
    font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
    overflow: hidden; position: relative;
  }
  .deco { position: absolute; border-radius: 50%; }
  .top-bar {
    position: relative; z-index: 10;
    padding: 44px 56px 0;
    display: flex; justify-content: space-between; align-items: center;
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-dot { width: 14px; height: 14px; border-radius: 50%; background: ${BRAND.blue}; }
  .logo-text { font-size: 28px; font-weight: 900; color: ${BRAND.blue}; letter-spacing: -0.5px; }
  .card-num {
    background: white; border: 2px solid #D6EDFA;
    color: ${BRAND.blueDark}; font-size: 20px; font-weight: 700;
    padding: 10px 22px; border-radius: 40px; letter-spacing: 1px;
  }
  .bottom-bar {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 10;
    background: ${BRAND.blue}; padding: 26px 56px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .brand { color: white; font-size: 26px; font-weight: 900; }
  .slogan { color: rgba(255,255,255,0.8); font-size: 19px; font-weight: 400; }
`;

function topBar(num, total) {
  return `
    <div class="top-bar">
      <div class="logo"><div class="logo-dot"></div><span class="logo-text">약문약답</span></div>
      <div class="card-num">${String(num).padStart(2,'0')} · ${String(total).padStart(2,'0')}</div>
    </div>`;
}

function bottomBar() {
  return `
    <div class="bottom-bar">
      <span class="brand">약문약답</span>
      <span class="slogan">똑똑한 약사의 파트너</span>
    </div>`;
}

function decos(style = 'default') {
  const color = style === 'warning'
    ? 'rgba(229,57,53,0.06)'
    : 'rgba(27,163,232,0.07)';
  return `
    <div class="deco" style="width:360px;height:360px;top:-80px;right:-60px;background:${color};"></div>
    <div class="deco" style="width:200px;height:200px;bottom:100px;left:-40px;background:${color};"></div>`;
}

// ── 카드 1: 표지 ──────────────────────────────────────
function renderCover(cover, total) {
  const titleHtml = cover.title_lines.map((line, i) =>
    i === cover.highlight_line
      ? `<span style="color:${BRAND.blue}">${line}</span>`
      : line
  ).join('<br>');

  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
    ${BASE_CSS}
    body { background: ${BRAND.bg}; }
    .main {
      position: relative; z-index: 10;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 860px;
      padding: 0 80px; text-align: center;
    }
    .tag {
      display: inline-block; background: ${BRAND.blue}; color: white;
      font-size: 22px; font-weight: 700; padding: 12px 28px;
      border-radius: 40px; margin-bottom: 36px;
    }
    .title {
      font-size: 80px; font-weight: 900; color: ${BRAND.text};
      line-height: 1.18; margin-bottom: 36px; letter-spacing: -2px;
    }
    .divider { width: 60px; height: 5px; background: ${BRAND.blue}; border-radius: 4px; margin: 0 auto 32px; }
    .subtitle { font-size: 30px; font-weight: 700; color: ${BRAND.textMuted}; line-height: 1.5; }
  </style></head><body>
    ${decos()}
    ${topBar(1, total)}
    <div class="main">
      <div class="tag">${cover.tag}</div>
      <div class="title">${titleHtml}</div>
      <div class="divider"></div>
      <div class="subtitle">${cover.subtitle}</div>
    </div>
    ${bottomBar()}
  </body></html>`;
}

// ── 카드 2~5: 본문 ────────────────────────────────────
function renderContent(card, cardIdx, total) {
  const isWarning = parseInt(card.badge_num) === 4;
  const badgeColor = isWarning ? BRAND.red : BRAND.blue;
  const hlColor = isWarning ? BRAND.red : BRAND.blue;

  const titleHtml = card.title.includes(card.title_hl)
    ? card.title.replace(card.title_hl, `<span style="color:${hlColor}">${card.title_hl}</span>`)
    : `<span style="color:${hlColor}">${card.title}</span>`;

  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
    ${BASE_CSS}
    body { background: ${BRAND.bg}; }
    .main { position: relative; z-index: 10; padding: 36px 60px 0; }
    .badge {
      display: inline-flex; align-items: center; gap: 12px;
      background: ${badgeColor}; color: white;
      font-size: 22px; font-weight: 700;
      padding: 12px 26px; border-radius: 40px; margin-bottom: 28px;
    }
    .badge-num {
      background: white; color: ${badgeColor};
      font-size: 20px; font-weight: 900;
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .title { font-size: 58px; font-weight: 900; color: ${BRAND.text}; line-height: 1.2; letter-spacing: -1.5px; margin-bottom: 32px; }
    .box { background: white; border-radius: 24px; padding: 38px 48px; box-shadow: 0 4px 24px rgba(13,122,192,0.08); }
    .body-text { font-size: 29px; font-weight: 700; color: ${BRAND.textSub}; line-height: 1.65; margin-bottom: 26px; }
    .tip-box { background: ${BRAND.bg}; border-left: 5px solid ${BRAND.blue}; border-radius: 0 12px 12px 0; padding: 16px 22px; }
    .tip-label { font-size: 17px; font-weight: 700; color: ${BRAND.blue}; margin-bottom: 6px; }
    .tip-text { font-size: 22px; font-weight: 700; color: ${BRAND.text}; line-height: 1.5; }
  </style></head><body>
    ${decos(isWarning ? 'warning' : 'default')}
    ${topBar(cardIdx + 1, total)}
    <div class="main">
      <div class="badge">
        <div class="badge-num">${card.badge_num}</div>
        ${card.badge_label}
      </div>
      <div class="title">${titleHtml}</div>
      <div class="box">
        <div class="body-text">${card.body.replace(/\n/g, '<br>')}</div>
        <div class="tip-box">
          <div class="tip-label">💡 약사 TIP</div>
          <div class="tip-text">${card.tip}</div>
        </div>
      </div>
    </div>
    ${bottomBar()}
  </body></html>`;
}

// ── 카드 6: 마무리 ────────────────────────────────────
function renderSummary(summary, total) {
  const itemsHtml = summary.items.map(item => `
    <div style="display:flex;align-items:center;gap:18px;background:rgba(255,255,255,0.15);border-radius:16px;padding:18px 26px;">
      <span style="font-size:24px;">✅</span>
      <div>
        <div style="font-size:26px;font-weight:700;color:white;">${item.text}</div>
        <div style="font-size:17px;color:rgba(255,255,255,0.75);margin-top:2px;">${item.sub}</div>
      </div>
    </div>`).join('');

  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><style>
    ${BASE_CSS}
    body { background: ${BRAND.blue}; }
    .main { position: relative; z-index: 10; padding: 44px 60px 0; }
    .label { font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.8); margin-bottom: 16px; letter-spacing: 1px; }
    .sum-title { font-size: 58px; font-weight: 900; color: white; line-height: 1.2; letter-spacing: -1.5px; margin-bottom: 36px; }
    .items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
    .cta-box { background: white; border-radius: 20px; padding: 22px 34px; display: flex; align-items: center; justify-content: space-between; }
    .cta-text { font-size: 23px; font-weight: 700; color: ${BRAND.text}; line-height: 1.4; }
    .cta-text span { color: ${BRAND.blue}; }
    .cta-btn { background: ${BRAND.blue}; color: white; font-size: 19px; font-weight: 900; padding: 13px 26px; border-radius: 40px; white-space: nowrap; }
    .top-logo { color: white; font-size: 28px; font-weight: 900; }
    .top-num { background: rgba(255,255,255,0.2); color: white; font-size: 20px; font-weight: 700; padding: 10px 22px; border-radius: 40px; }
  </style></head><body>
    <div class="deco" style="width:500px;height:500px;top:-160px;right:-130px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
    <div class="deco" style="width:280px;height:280px;bottom:-60px;left:-60px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
    <div class="top-bar">
      <span class="top-logo">약문약답</span>
      <div class="top-num">${String(total).padStart(2,'0')} · ${String(total).padStart(2,'0')}</div>
    </div>
    <div class="main">
      <div class="label">📋 오늘의 핵심 요약</div>
      <div class="sum-title">${summary.title}</div>
      <div class="items">${itemsHtml}</div>
      <div class="cta-box">
        <div class="cta-text">${summary.cta.replace('약문약답', '<span>약문약답</span>')}</div>
        <div class="cta-btn">바로가기 →</div>
      </div>
    </div>
  </body></html>`;
}

// ── 메인 ──────────────────────────────────────────────
async function main() {
  const [,, jsonPath, outputDir] = process.argv;
  if (!jsonPath || !outputDir) {
    console.error('사용법: node render.mjs <json파일> <출력폴더>');
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
  mkdirSync(outputDir, { recursive: true });

  const total = 1 + data.contents.length + 1; // cover + contents + summary
  const cards = [
    { html: renderCover(data.cover, total), name: 'card_01_cover.png' },
    ...data.contents.map((c, i) => ({
      html: renderContent(c, i + 1, total),
      name: `card_0${i + 2}_content.png`
    })),
    { html: renderSummary(data.summary, total), name: `card_0${total}_summary.png` },
  ];

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  const results = [];
  for (const card of cards) {
    await page.setContent(card.html, { waitUntil: 'networkidle' });
    // 폰트 로딩 대기
    await page.waitForTimeout(800);
    const outPath = join(outputDir, card.name);
    await page.screenshot({ path: outPath, type: 'png' });
    results.push(outPath);
    console.log(`✓ ${card.name}`);
  }

  await browser.close();
  console.log(JSON.stringify({ success: true, files: results }));
}

main().catch(err => {
  console.error('렌더링 오류:', err.message);
  process.exit(1);
});
