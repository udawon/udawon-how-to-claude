import Link from "next/link";
import { categories, getDocsByCategory } from "@/lib/docs";
import { Icon } from "@/components/Icons";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClaudeCharacter } from "@/components/ClaudeCharacter";

export default function Home() {
  const categoryData = categories
    .filter((cat) => cat.slug !== "claude-code-docs")
    .map((cat) => ({
      ...cat,
      docs: getDocsByCategory(cat.slug),
    }));

  const officialDocs = {
    ...categories.find((cat) => cat.slug === "claude-code-docs")!,
    docs: getDocsByCategory("claude-code-docs"),
  };

  const totalDocs = categoryData.reduce((sum, cat) => sum + cat.docs.length, 0) + officialDocs.docs.length;
  const allDocs = categoryData.flatMap((cat) =>
    cat.docs.map((doc) => ({ ...doc, catTitle: cat.title }))
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="site-header">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <ClaudeCharacter pose="wave" size={24} />
            <span className="font-semibold text-[15px] text-[var(--text-primary)]">
              How to Claude
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              {totalDocs}개 문서
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-14 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <ClaudeCharacter pose="wave" size={100} className="claude-float" />
          </div>
          <div className="badge-pill">
            Claude Code 활용 가이드
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)]" style={{ letterSpacing: "-0.02em" }}>
            더 효율적으로 Claude를
            <br />
            활용하는 방법
          </h1>
          <p className="text-base sm:text-lg mb-10 max-w-lg mx-auto text-[var(--text-secondary)]" style={{ lineHeight: "1.7" }}>
            Q&A를 통해 쌓은 실전 지식을 빠르게 찾아보세요.
            <br className="hidden sm:block" />
            비개발자도 이해할 수 있는 친절한 매뉴얼입니다.
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* 카테고리 그리드 */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-14 w-full">
        <div className="flex items-center gap-3 mb-1">
          <ClaudeCharacter pose="search" size={36} />
          <h2 className="section-label !mb-0">카테고리</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryData.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className={`group rounded-xl p-5 ${
                cat.slug === "quick-start"
                  ? "card-announcement"
                  : "card-hover"
              }`}
            >
              <div className="flex items-start justify-between mb-3.5">
                <div className="icon-box">
                  {cat.slug === "quick-start" ? (
                    <ClaudeCharacter pose="love" size={20} />
                  ) : (
                    <Icon name={cat.icon} className="w-[18px] h-[18px]" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {cat.slug === "quick-start" && (
                    <span className="announcement-badge">추천</span>
                  )}
                  <span className="count-badge">{cat.docs.length}</span>
                </div>
              </div>
              <h3 className="font-semibold text-[15px] mb-1 text-[var(--text-primary)]">
                {cat.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 공식 문서 참고 */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-14 w-full">
        <div className="flex items-center gap-3 mb-1">
          <ClaudeCharacter pose="think" size={36} />
          <h2 className="section-label !mb-0">공식 문서 참고</h2>
        </div>
        <Link
          href="/docs/claude-code-docs"
          className="card-hover group rounded-xl p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="icon-box">
              <Icon name="doc" className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] text-[var(--text-primary)]">
                {officialDocs.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {officialDocs.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="count-badge">{officialDocs.docs.length}</span>
            <Icon
              name="arrow"
              className="w-4 h-4 text-[var(--text-muted)] transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </div>
        </Link>
      </section>

      {/* 전체 문서 목록 */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 w-full flex-1">
        <div className="flex items-center gap-3 mb-1">
          <ClaudeCharacter pose="code" size={36} />
          <h2 className="section-label !mb-0">전체 문서</h2>
        </div>
        {allDocs.length === 0 ? (
          <div className="empty-state">
            <div className="flex justify-center mb-3">
              <ClaudeCharacter pose="think" size={64} />
            </div>
            아직 문서가 없습니다. Q&A를 통해 콘텐츠를 채워나가세요.
          </div>
        ) : (
          <div className="space-y-1.5">
            {allDocs.map((doc) => (
              <Link
                key={`${doc.category}-${doc.slug}`}
                href={`/docs/${doc.category}/${doc.slug}`}
                className="doc-row group"
              >
                <div className="doc-row-icon">
                  <Icon name="doc" className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-[var(--text-primary)]">
                    {doc.title}
                  </div>
                  <div className="text-xs truncate mt-0.5 text-[var(--text-muted)]">
                    {doc.description}
                  </div>
                </div>
                <span className="tag-badge hidden sm:block">{doc.catTitle}</span>
                <Icon
                  name="arrow"
                  className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)] transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer className="site-footer">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col items-center gap-2">
          <ClaudeCharacter pose="love" size={40} />
          <span className="text-xs text-[var(--text-muted)]">
            Built with Claude Code
          </span>
        </div>
      </footer>
    </div>
  );
}
