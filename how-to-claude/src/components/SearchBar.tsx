"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icons";

interface SearchResult {
  slug: string;
  title: string;
  category: string;
  description: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = ref.current?.querySelector("input");
        input?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    const data = await res.json();
    setResults(data);
    setIsOpen(true);
  };

  const handleSelect = (result: SearchResult) => {
    router.push(`/docs/${result.category}/${result.slug}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <div className="relative">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="문서 검색... (Ctrl+K)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full rounded-xl pl-11 pr-20 py-3 text-sm focus:outline-none transition-all duration-200"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-sm)",
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            Ctrl
          </kbd>
          <kbd
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            K
          </kbd>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full mt-2 w-full rounded-xl overflow-hidden z-50"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {results.map((result, i) => (
            <button
              key={`${result.category}-${result.slug}`}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 transition-colors duration-100 flex items-center gap-3"
              style={{
                borderBottom: i < results.length - 1 ? "1px solid var(--border-light)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
              >
                <Icon name="doc" className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {result.title}
                </div>
                <div className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {result.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
