import { ReactNode } from "react";
import { useActiveHeading } from "../hooks/useActiveHeading";
import SiteNav from "./SiteNav";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Three-column documentation layout: navigation sidebar, main content
 * (max-width 800px), and an "On this page" table of contents.
 */
export default function DocsLayout({
  toc = [],
  children,
}: {
  toc?: TocItem[];
  children: ReactNode;
}) {
  const activeId = useActiveHeading(toc.map((item) => item.id));

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_200px]">
      {/* Left: site navigation */}
      <nav
        aria-label="Documentation"
        className="hidden lg:block"
      >
        <div className="sticky top-24">
          <SiteNav />
        </div>
      </nav>

      {/* Center: main content */}
      <div className="min-w-0">
        <article className="prose-doc max-w-content">{children}</article>
      </div>

      {/* Right: on-this-page TOC */}
      {toc.length > 0 && (
        <nav aria-label="On this page" className="hidden xl:block">
          <div className="sticky top-24">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              On this page
            </p>
            <ul className="space-y-1 border-l border-edge">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? "location" : undefined}
                    className={`-ml-px block border-l-2 py-1 pl-3 text-sm ${
                      activeId === item.id
                        ? "border-pine font-medium text-pine-dark"
                        : "border-transparent text-muted hover:text-gunmetal"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}
