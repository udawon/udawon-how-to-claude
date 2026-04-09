import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getDocsByCategory, getHiddenDocSlugs, DocMeta } from "@/lib/docs";
import { Icon } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClaudeCharacter } from "@/components/ClaudeCharacter";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string }>;
}

// 공식 문서 한국어판 섹션 정의
const officialDocSections: { label: string; tag: string }[] = [
  { label: "시작하기", tag: "시작하기" },
  { label: "설정 & 구성", tag: "설정" },
  { label: "메모리 & 커스터마이징", tag: "커스터마이징" },
  { label: "플러그인 & 에이전트", tag: "플러그인,에이전트" },
  { label: "플랫폼 & IDE", tag: "플랫폼" },
  { label: "CI/CD & 자동화", tag: "CI/CD,자동화" },
  { label: "엔터프라이즈", tag: "엔터프라이즈" },
  { label: "보안 & 참조", tag: "보안,참조" },
];

// 유튜브 업데이트 섹션 정의
const youtubeDocSections: { label: string; tag: string }[] = [
  { label: "새로운 기능 & 업데이트", tag: "신기능,업데이트" },
  { label: "활용법 & 워크플로우", tag: "활용법,워크플로우" },
  { label: "설정 & 연동", tag: "설정,연동" },
  { label: "비즈니스 & 자동화", tag: "비즈니스,자동화" },
];

function groupDocsBySections(docs: DocMeta[], sectionDefs: { label: string; tag: string }[]) {
  const grouped: { label: string; docs: DocMeta[] }[] = [];
  const used = new Set<string>();

  for (const section of sectionDefs) {
    const tags = section.tag.split(",");
    const matched = docs.filter(
      (doc) => !used.has(doc.slug) && doc.tags.some((t) => tags.includes(t))
    );
    matched.forEach((doc) => used.add(doc.slug));
    if (matched.length > 0) {
      grouped.push({ label: section.label, docs: matched });
    }
  }

  // 어디에도 속하지 않은 문서
  const remaining = docs.filter((doc) => !used.has(doc.slug));
  if (remaining.length > 0) {
    grouped.push({ label: "기타", docs: remaining });
  }

  return grouped;
}

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

function DocRow({ doc, category, index }: { doc: DocMeta; category: string; index: number }) {
  return (
    <Link
      key={doc.slug}
      href={`/docs/${category}/${doc.slug}`}
      className="card-hover group flex items-center gap-4 rounded-xl px-5 py-4"
    >
      <div className="number-box">{index}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[15px] text-[var(--text-primary)]">
          {doc.title}
        </div>
        <div className="text-sm mt-0.5 text-[var(--text-muted)]">
          {doc.description}
        </div>
        {(doc.date || doc.tags.length > 0) && (
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            {doc.date && (
              <span className="tag-badge text-xs tag-badge-date">
                {doc.date}
              </span>
            )}
            {doc.tags.map((tag) => (
              <span key={tag} className="tag-badge text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <Icon
        name="arrow"
        className="w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);

  if (!cat) {
    notFound();
  }

  const [allDocs, hiddenSlugs] = await Promise.all([
    Promise.resolve(getDocsByCategory(category)),
    getHiddenDocSlugs(),
  ]);
  const docs = allDocs.filter((doc) => !hiddenSlugs.has(`${category}/${doc.slug}`));
  const isOfficialDocs = category === "claude-code-docs";
  const isYoutubeDocs = category === "youtube-update";
  const hasSections = isOfficialDocs || isYoutubeDocs;
  const sectionDefs = isOfficialDocs ? officialDocSections : youtubeDocSections;
  const sections = hasSections ? groupDocsBySections(docs, sectionDefs) : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="site-header">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <ClaudeCharacter pose="wave" size={24} />
              <span className="font-semibold text-[15px] text-[var(--text-primary)]">How to Claude</span>
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="font-medium truncate text-[var(--text-primary)]">{cat.title}</span>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 w-full flex-1">
        {/* 카테고리 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="icon-box w-10 h-10 rounded-xl">
              <Icon name={cat.icon} className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{cat.title}</h1>
            <ClaudeCharacter pose="point" size={32} />
          </div>
          <p className="text-sm ml-[54px] text-[var(--text-muted)]">{cat.description}</p>
        </div>

        {/* 문서 목록 */}
        {docs.length === 0 ? (
          <div className="empty-state">
            <div className="flex justify-center mb-3">
              <ClaudeCharacter pose="think" size={56} />
            </div>
            이 카테고리에 아직 문서가 없습니다
          </div>
        ) : hasSections ? (
          /* 공식 문서: 섹션별 그룹 */
          <div className="space-y-12">
            {sections.map((section, sectionIdx) => {
              let globalIndex = docs.findIndex((d) => d.slug === section.docs[0].slug);
              return (
                <div key={section.label}>
                  <div className={`${sectionIdx > 0 ? "border-t border-[var(--border)] pt-6" : ""} mb-3`}>
                    <h2 className="section-label !mb-0">{section.label}</h2>
                  </div>
                  <div className="space-y-2">
                    {section.docs.map((doc, i) => (
                      <DocRow
                        key={doc.slug}
                        doc={doc}
                        category={category}
                        index={globalIndex + i + 1}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 일반 카테고리: 기존 플랫 목록 */
          <div className="space-y-2">
            {docs.map((doc, i) => (
              <DocRow key={doc.slug} doc={doc} category={category} index={i + 1} />
            ))}
          </div>
        )}
        {/* 하단 캐릭터 */}
        <div className="flex justify-center mt-12 opacity-40">
          <ClaudeCharacter pose="sit" size={36} />
        </div>
      </main>
    </div>
  );
}
