import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";
import type { Root as MdastRoot, Code } from "mdast";

// Mermaid 코드 블록을 raw HTML <pre class="mermaid">로 변환하는 remark 플러그인
function remarkMermaid() {
  return (tree: MdastRoot) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index === undefined) return;

      // code 노드를 raw HTML 노드로 교체
      const htmlNode = {
        type: "html" as const,
        value: `<pre class="mermaid">${node.value}</pre>`,
      };

      parent.children.splice(index, 1, htmlNode);
    });
  };
}

// 문서 내 링크를 사이트 라우팅에 맞게 변환하는 rehype 플러그인
function rehypeRewriteLinks(categorySlug: string) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = node.properties?.href;
      if (typeof href !== "string" || href.startsWith("http") || href.startsWith("#")) return;

      let newHref = href;

      // 패턴 1: /en/xxx → /docs/claude-code-docs/xxx (공식문서 내부 링크)
      const enMatch = newHref.match(/^\/en\/([a-zA-Z0-9-]+)/);
      if (enMatch) {
        const slug = enMatch[1];
        const anchor = newHref.includes("#") ? newHref.slice(newHref.indexOf("#")) : "";
        newHref = `/docs/claude-code-docs/${slug}${anchor}`;
      }

      // 패턴 2: ./파일명.md 또는 파일명.md → 같은 카테고리 내 링크
      const mdMatch = newHref.match(/^(?:\.\/)?([a-zA-Z0-9-]+)\.md(#.*)?$/);
      if (mdMatch) {
        const slug = mdMatch[1];
        const anchor = mdMatch[2] || "";
        newHref = `/docs/${categorySlug}/${slug}${anchor}`;
      }

      // 패턴 3: /workflow/xxx 등 /docs 접두사 누락 → /docs/workflow/xxx
      if (newHref.match(/^\/(basics|workflow|tips|config|troubleshooting|quick-start|claude-code-docs|youtube-update)\//)) {
        newHref = `/docs${newHref}`;
      }

      node.properties!.href = newHref;
    });
  };
}

// 문서 디렉토리 경로
const docsDirectory = path.join(process.cwd(), "content");

// 카테고리 정의
export interface Category {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export const categories: Category[] = [
  {
    slug: "basics",
    title: "기본 기능",
    description: "Claude Code의 핵심 도구와 명령어",
    icon: "terminal",
    order: 1,
  },
  {
    slug: "workflow",
    title: "워크플로우",
    description: "프로젝트 시작부터 배포까지의 패턴",
    icon: "workflow",
    order: 2,
  },
  {
    slug: "tips",
    title: "팁 & 트릭",
    description: "효율적인 프롬프트와 활용 패턴",
    icon: "lightbulb",
    order: 3,
  },
  {
    slug: "config",
    title: "설정 & 커스터마이징",
    description: "CLAUDE.md, hooks, skills, MCP 설정",
    icon: "settings",
    order: 4,
  },
  {
    slug: "troubleshooting",
    title: "트러블슈팅",
    description: "자주 발생하는 문제와 해결법",
    icon: "bug",
    order: 5,
  },
  {
    slug: "quick-start",
    title: "처음부터 끝까지",
    description: "왕초보부터 고급까지 — 내 레벨에 맞는 프로젝트 가이드",
    icon: "rocket",
    order: 6,
  },
  {
    slug: "claude-code-docs",
    title: "공식 문서 한국어판",
    description: "Claude Code 공식 문서를 비개발자도 이해할 수 있게 번역한 가이드",
    icon: "doc",
    order: 7,
  },
  {
    slug: "youtube-update",
    title: "유튜브 업데이트",
    description: "YouTube 영상에서 발굴한 최신 Claude Code 활용법과 팁",
    icon: "video",
    order: 8,
  },
];

// 문서 메타데이터
export interface DocMeta {
  slug: string;
  title: string;
  category: string;
  description: string;
  order: number;
  tags: string[];
}

// 문서 전체 데이터
export interface Doc extends DocMeta {
  contentHtml: string;
}

// 특정 카테고리의 문서 목록 가져오기
export function getDocsByCategory(categorySlug: string): DocMeta[] {
  const categoryDir = path.join(docsDirectory, categorySlug);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".md"));

  const docs = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(categoryDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: (data.title as string) || slug,
      category: categorySlug,
      description: (data.description as string) || "",
      order: (data.order as number) || 99,
      tags: (data.tags as string[]) || [],
    };
  });

  return docs.sort((a, b) => a.order - b.order);
}

// 모든 문서 목록 가져오기
export function getAllDocs(): DocMeta[] {
  return categories.flatMap((cat) => getDocsByCategory(cat.slug));
}

// 특정 문서 내용 가져오기
export async function getDoc(
  categorySlug: string,
  docSlug: string
): Promise<Doc | null> {
  const fullPath = path.join(docsDirectory, categorySlug, `${docSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkMermaid as never)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeRewriteLinks(categorySlug))
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug: docSlug,
    title: (data.title as string) || docSlug,
    category: categorySlug,
    description: (data.description as string) || "",
    order: (data.order as number) || 99,
    tags: (data.tags as string[]) || [],
    contentHtml,
  };
}

// 검색 기능
export function searchDocs(query: string): DocMeta[] {
  const allDocs = getAllDocs();
  const lowerQuery = query.toLowerCase();

  return allDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
