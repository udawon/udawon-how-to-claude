import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getDocsByCategory, getDoc, getHiddenDocSlugs } from "@/lib/docs";
import { Icon } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClaudeCharacter } from "@/components/ClaudeCharacter";
import { MermaidInit } from "@/components/MermaidInit";
import { DeleteDocButton } from "@/components/DeleteDocButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return categories.flatMap((cat) =>
    getDocsByCategory(cat.slug).map((doc) => ({
      category: cat.slug,
      slug: doc.slug,
    }))
  );
}

export default async function DocPage({ params }: Props) {
  const { category, slug } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const doc = await getDoc(category, slug);
  if (!doc) notFound();

  const hiddenSlugs = await getHiddenDocSlugs();
  if (hiddenSlugs.has(`${category}/${slug}`)) notFound();

  const siblingDocs = getDocsByCategory(category);

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="site-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <ClaudeCharacter pose="wave" size={24} />
              <span className="font-semibold text-[15px] text-[var(--text-primary)]">How to Claude</span>
            </Link>
            <span className="text-[var(--border)]">/</span>
            <Link href={`/docs/${category}`} className="breadcrumb-link shrink-0">
              {cat.title}
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="font-medium truncate text-[var(--text-primary)]">{doc.title}</span>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex gap-10">
        {/* 사이드바 */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-box w-6 h-6 rounded-md">
                <Icon name={cat.icon} className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {cat.title}
              </h3>
            </div>
            <nav className="space-y-0.5">
              {siblingDocs.map((s) => (
                <Link
                  key={s.slug}
                  href={`/docs/${category}/${s.slug}`}
                  className={`sidebar-link ${s.slug === slug ? "sidebar-link-active" : ""}`}
                >
                  {s.title}
                </Link>
              ))}
            </nav>
            <div className="flex justify-center mt-8 opacity-30">
              <ClaudeCharacter pose="read" size={40} />
            </div>
          </div>
        </aside>

        {/* 본문 */}
        <main className="min-w-0 flex-1 max-w-3xl">
          <article>
            <div className="mb-8">
              <h1
                className="text-2xl sm:text-[1.75rem] font-bold mb-2.5 text-[var(--text-primary)]"
                style={{ letterSpacing: "-0.015em" }}
              >
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-base text-[var(--text-secondary)]">{doc.description}</p>
              )}
              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: "var(--accent-soft)", color: "var(--accent-text)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8" style={{ borderTop: "1px solid var(--border)" }} />

            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
            />
            <MermaidInit />
          </article>

          <div
            className="mt-12 pt-6 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <Link href={`/docs/${category}`} className="breadcrumb-link flex items-center gap-2 text-sm">
              <Icon name="back" className="w-3.5 h-3.5" />
              {cat.title} 목록으로
            </Link>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <ClaudeCharacter pose="love" size={28} />
              도움이 되셨나요?
              <DeleteDocButton category={category} slug={slug} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
