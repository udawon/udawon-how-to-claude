/**
 * fetch-rankings.mjs
 *
 * 데이터 출처: Smithery.ai (공식 Claude Skills + MCP 레지스트리)
 * - Skills: https://api.smithery.ai/skills (qualityScore 기준 상위 100개)
 * - MCP:    https://api.smithery.ai/servers (useCount 실사용량 기준 상위 100개)
 *
 * 한국어 설명: Claude Code가 직접 번역 후 rankings.json에 저장
 * → GitHub Actions는 번역 없이 데이터 업데이트만 수행
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "data", "rankings.json");

const SMITHERY = "https://api.smithery.ai";
const LIMIT = 100;

// ── 데이터 다운로드 ────────────────────────────────────────────────
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

// ── 기존 번역 캐시 (repo → koreanDesc) ───────────────────────────
function loadTranslationCache() {
  if (!existsSync(OUTPUT_PATH)) return new Map();
  try {
    const existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
    const map = new Map();
    for (const category of ["skills", "mcp"]) {
      for (const item of existing[category] || []) {
        if (item.repo && item.koreanDesc) {
          map.set(item.repo, item.koreanDesc);
        }
      }
    }
    console.log(`📦 기존 번역 캐시: ${map.size}개`);
    return map;
  } catch {
    return new Map();
  }
}

// ── Skills 수집 (qualityScore 내림차순 상위 100개) ─────────────────
async function fetchSkills() {
  const data = await fetchJson(
    `${SMITHERY}/skills?pageSize=${LIMIT}&sort=qualityScore&order=desc&listed=true`
  );
  return data.skills || [];
}

// ── MCP 수집 (useCount 내림차순 상위 100개, 중복 제거) ────────────
// Smithery API는 useCount 정렬을 직접 지원하지 않으므로
// 전체 서버를 페이지별로 수집 후 클라이언트에서 정렬 및 중복 제거
async function fetchMcp() {
  console.log("   MCP 전체 수집 중 (페이지별 병렬 요청)...");

  // 첫 페이지로 totalPages 확인
  const first = await fetchJson(`${SMITHERY}/servers?pageSize=100`);
  const allServers = [...first.servers];
  const totalPages = first.pagination.totalPages;

  console.log(`   총 ${first.pagination.totalCount}개 서버, ${totalPages}페이지`);

  // 나머지 페이지를 병렬로 수집 (최대 41페이지)
  const pageNums = [];
  for (let p = 2; p <= totalPages; p++) pageNums.push(p);

  // 10개씩 배치 처리 (API 부하 분산)
  const BATCH = 10;
  for (let i = 0; i < pageNums.length; i += BATCH) {
    const batch = pageNums.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map((p) => fetchJson(`${SMITHERY}/servers?pageSize=100&page=${p}`))
    );
    for (const r of results) allServers.push(...r.servers);
  }

  // displayName 기준 중복 제거 (useCount 높은 항목 유지)
  const seen = new Map();
  for (const s of allServers) {
    const key = s.displayName.toLowerCase().trim();
    if (!seen.has(key) || (s.useCount || 0) > (seen.get(key).useCount || 0)) {
      seen.set(key, s);
    }
  }

  // useCount 내림차순 정렬 후 상위 100개
  return Array.from(seen.values())
    .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
    .slice(0, LIMIT);
}

// ── GitHub URL (gitUrl 그대로 사용) ───────────────────────────────
function toGithubRepoUrl(gitUrl) {
  if (!gitUrl || !gitUrl.includes("github.com")) return null;
  return gitUrl;
}

// ── 매핑 함수 ─────────────────────────────────────────────────────
function mapSkills(items, cache) {
  return items.map((it, i) => {
    const repo = `${it.namespace}/${it.slug}`;
    return {
      rank: i + 1,
      name: it.displayName || it.slug,
      repo,
      stars: it.externalStars || 0,
      description: it.description || "",
      koreanDesc: cache.get(repo) || "",
      url: `https://smithery.ai/skills/${it.namespace}/${it.slug}`,
      githubUrl: toGithubRepoUrl(it.gitUrl),
      isOfficial: it.namespace === "anthropics" || it.verified === true,
      updatedAt: it.createdAt?.split("T")[0] || "",
      installCommand: "",
      category: (it.categories || []).join(", "),
      qualityScore: it.qualityScore || 0,
    };
  });
}

function mapMcp(items, cache) {
  return items.map((it, i) => ({
    rank: i + 1,
    name: it.displayName,
    repo: it.qualifiedName,
    stars: it.useCount || 0,
    description: it.description || "",
    koreanDesc: cache.get(it.qualifiedName) || "",
    url: `https://smithery.ai/servers/${it.qualifiedName}`,
    isOfficial: it.verified === true,
    updatedAt: it.createdAt?.split("T")[0] || "",
    installCommand: `npx @smithery/cli install ${it.qualifiedName}`,
    category: it.remote ? "remote" : "local",
    qualityScore: 0,
  }));
}

// ── 메인 ──────────────────────────────────────────────────────────
async function main() {
  const existing = existsSync(OUTPUT_PATH)
    ? JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"))
    : null;

  const cache = loadTranslationCache();

  try {
    console.log("📥 Smithery.ai 데이터 수집 중...");
    const [rawSkills, rawMcp] = await Promise.all([
      fetchSkills(),
      fetchMcp(),
    ]);
    console.log(`   skills=${rawSkills.length} mcp=${rawMcp.length}`);

    const skills = mapSkills(rawSkills, cache);
    const mcp = mapMcp(rawMcp, cache);

    // 한국어 설명 없는 신규 항목 리포트
    const missing = [...skills, ...mcp].filter((it) => !it.koreanDesc).length;
    if (missing > 0) {
      console.log(
        `\n⚠️  한국어 설명 없는 신규 항목 ${missing}개 → Claude Code로 번역 필요`
      );
    }

    const output = {
      updatedAt: new Date().toISOString(),
      skills,
      mcp,
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
    console.log(
      `\n✅ 완료: skills=${skills.length} mcp=${mcp.length}`
    );
    console.log(`📝 저장: ${OUTPUT_PATH}`);
  } catch (err) {
    console.error("❌ 실패:", err.message);
    if (existing) console.log("⚠️  기존 rankings.json 유지");
    process.exit(1);
  }
}

main();
