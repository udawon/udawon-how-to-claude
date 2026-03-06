import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getDocsByCategory } from "@/lib/docs";
import { Icon } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClaudeCharacter } from "@/components/ClaudeCharacter";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);

  if (!cat) {
    notFound();
  }

  const docs = getDocsByCategory(category);

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
        ) : (
          <div className="space-y-2">
            {docs.map((doc, i) => (
              <Link
                key={doc.slug}
                href={`/docs/${category}/${doc.slug}`}
                className="card-hover group flex items-center gap-4 rounded-xl px-5 py-4"
              >
                <div className="number-box">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[15px] text-[var(--text-primary)]">
                    {doc.title}
                  </div>
                  <div className="text-sm mt-0.5 text-[var(--text-muted)]">
                    {doc.description}
                  </div>
                  {doc.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2.5">
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
