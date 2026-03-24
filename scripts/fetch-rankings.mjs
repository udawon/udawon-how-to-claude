import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "data", "rankings.json");

const TOPICS = {
  skills: ["claude-code-skill", "claude-skill"],
  mcp: ["mcp-server"],
  plugins: ["claude-plugin"],
  marketplaces: ["claude-marketplace"],
};

const HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
  Accept: "application/vnd.github+json",
  "User-Agent": "how-to-claude-rankings-bot",
};

async function fetchTopic(topic) {
  const url = `https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=50`;
  const res = await fetch(url, { headers: HEADERS });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} for topic=${topic}`);
  }

  const data = await res.json();
  return data.items || [];
}

function dedup(items) {
  const seen = new Map();
  for (const item of items) {
    const key = item.full_name;
    if (!seen.has(key) || item.stargazers_count > seen.get(key).stargazers_count) {
      seen.set(key, item);
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.stargazers_count - a.stargazers_count);
}

function toRankingItem(item, rank) {
  return {
    rank,
    name: item.name,
    repo: item.full_name,
    stars: item.stargazers_count,
    description: item.description || "",
    koreanDesc: "",
    url: item.html_url,
    isOfficial: item.owner?.login === "anthropics",
    updatedAt: item.updated_at ? item.updated_at.split("T")[0] : "",
  };
}

async function fetchCategory(topics) {
  const results = await Promise.all(topics.map(fetchTopic));
  const merged = dedup(results.flat());
  return merged.slice(0, 50).map((item, i) => toRankingItem(item, i + 1));
}

async function main() {
  const existing = existsSync(OUTPUT_PATH)
    ? JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"))
    : null;

  try {
    console.log("GitHub API에서 랭킹 데이터 수집 중...");

    const [skills, mcp, plugins, marketplaces] = await Promise.all([
      fetchCategory(TOPICS.skills),
      fetchCategory(TOPICS.mcp),
      fetchCategory(TOPICS.plugins),
      fetchCategory(TOPICS.marketplaces),
    ]);

    const output = {
      updatedAt: new Date().toISOString(),
      skills,
      mcp,
      plugins,
      marketplaces,
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

    console.log(`✅ 완료: skills=${skills.length} mcp=${mcp.length} plugins=${plugins.length} marketplaces=${marketplaces.length}`);
    console.log(`📝 저장: ${OUTPUT_PATH}`);
  } catch (err) {
    console.error("❌ fetch 실패:", err.message);

    if (existing) {
      console.log("⚠️  기존 rankings.json 유지 (덮어쓰지 않음)");
    } else {
      console.log("⚠️  기존 파일 없음, 빈 데이터로 초기화");
      writeFileSync(
        OUTPUT_PATH,
        JSON.stringify({ updatedAt: "", skills: [], mcp: [], plugins: [], marketplaces: [] }, null, 2),
        "utf-8"
      );
    }

    process.exit(1);
  }
}

main();
