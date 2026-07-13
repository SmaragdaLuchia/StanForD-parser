import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchSite, SearchEntry } from "../data/searchIndex";

/**
 * Site search implementing the ARIA combobox pattern: results render in a
 * listbox, ArrowUp/ArrowDown move the active option, Enter navigates,
 * Escape closes.
 */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const results: SearchEntry[] = open ? searchSite(query) : [];

  function go(entry: SearchEntry) {
    setOpen(false);
    setQuery("");
    navigate(entry.path);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      >
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
        }
        aria-label="Search documentation"
        placeholder="Search the docs…"
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-edge bg-white py-2.5 pl-10 pr-4 text-sm text-gunmetal placeholder:text-muted"
      />
      <ul
        id={listboxId}
        role="listbox"
        aria-label="Search results"
        hidden={!open || results.length === 0}
        className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-edge bg-white py-1 text-left shadow-lg"
      >
        {results.map((r, i) => (
          <li
            key={`${r.path}-${r.title}`}
            id={`${listboxId}-opt-${i}`}
            role="option"
            aria-selected={i === activeIndex}
            onMouseDown={(e) => {
              e.preventDefault(); // keep focus on the input
              go(r);
            }}
            onMouseEnter={() => setActiveIndex(i)}
            className={`cursor-pointer px-4 py-2 text-sm ${
              i === activeIndex ? "bg-pine-tint text-pine-dark" : "text-gunmetal"
            }`}
          >
            {r.title}
            <span className="ml-2 font-mono text-xs text-muted">{r.path}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
