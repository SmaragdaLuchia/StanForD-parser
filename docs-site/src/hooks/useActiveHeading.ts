import { useEffect, useState } from "react";

/**
 * Track which of the given element ids is currently scrolled into view and
 * return it, so a navigation list can highlight the active section. Shared by
 * the docs layout's "On this page" TOC and the API reference sidebar.
 */
export function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Join into a primitive so the effect only re-runs when the set of ids
  // actually changes, not on every render that rebuilds the array.
  const key = ids.join("|");

  useEffect(() => {
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return activeId;
}
