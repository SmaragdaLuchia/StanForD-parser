import { useMemo, useState } from "react";
import { API, ApiClass, ApiMethod, ApiModule } from "../data/api";
import { useActiveHeading } from "../hooks/useActiveHeading";
import SiteNav from "../components/SiteNav";

/** Anchor id for a class heading. */
const classAnchor = (classId: string) => classId;
/** Anchor id for a method heading (underscores stripped to keep ids clean). */
const methodAnchor = (classId: string, methodName: string) =>
  `${classId}-${methodName.replace(/_/g, "")}`;

/** Smooth-scroll to an in-page anchor without adding a history entry. */
function jumpTo(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  };
}

/** Type shown as a compact monospace badge so the API's shape stays scannable. */
function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block rounded bg-surface px-1.5 py-0.5 font-mono text-[12px] leading-5 text-pine-dark">
      {type}
    </span>
  );
}

/**
 * Method block. Signature, summary, a compact parameter table, and a returns
 * row. Parameters use the shared `.table-doc` style rather than stacked cards.
 */
function MethodBlock({ method, classId }: { method: ApiMethod; classId: string }) {
  const anchor = methodAnchor(classId, method.name);
  return (
    <section id={anchor} className="border-t border-edge py-6 first:border-t-0">
      <h3 className="!mt-0 font-mono text-[15px] font-semibold">{method.name}</h3>
      <pre className="my-3 overflow-x-auto rounded-lg border border-edge bg-surface px-4 py-3">
        <code className="font-mono text-[13px] text-gunmetal">{method.signature}</code>
      </pre>
      <p className="mb-4 leading-7">{method.summary}</p>

      {method.params.length > 0 && (
        <>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Parameters
          </h4>
          <div className="mb-4 overflow-x-auto">
            <table className="table-doc">
              <caption>Parameters for {method.name}</caption>
              <thead>
                <tr>
                  <th className="w-1/3">Parameter</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {method.params.map((p) => (
                  <tr key={p.name}>
                    <td className="whitespace-nowrap">
                      <span className="font-mono text-sm font-bold text-gunmetal">
                        {p.name}
                      </span>
                      <span className="mt-1 block">
                        <TypeBadge type={p.type} />
                      </span>
                      {p.default !== undefined && (
                        <span className="mt-1 block font-mono text-xs text-muted">
                          default: {p.default}
                        </span>
                      )}
                    </td>
                    <td className="text-sm leading-6 text-gunmetal">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {method.returns && (
        <>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Returns
          </h4>
          <div className="rounded-lg bg-surface/60 px-4 py-2.5">
            <TypeBadge type={method.returns.type} />
            <p className="mt-1.5 text-sm leading-6">{method.returns.description}</p>
          </div>
        </>
      )}
    </section>
  );
}

function ClassSection({ cls }: { cls: ApiClass }) {
  return (
    <section id={classAnchor(cls.id)} className="mb-14">
      <div className="mb-1 flex flex-wrap items-baseline gap-3">
        <h2 className="!my-0 !border-b-0 !pb-0 font-mono text-xl">{cls.name}</h2>
        <code className="rounded bg-surface px-2 py-0.5 font-mono text-xs text-muted">
          {cls.module}
        </code>
      </div>
      <p className="mb-4 mt-2 leading-7">{cls.summary}</p>
      {cls.construct && (
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Construct
          </span>
          <code className="rounded-lg border border-edge bg-surface px-3 py-1.5 font-mono text-[13px] text-gunmetal">
            {cls.construct}
          </code>
          <span className="text-sm text-muted">
            Pass the file path as a <code>str</code> or <code>Path</code>.
          </span>
        </div>
      )}
      <div className="rounded-xl border border-edge bg-white px-6">
        {cls.methods.map((m) => (
          <MethodBlock key={m.name} method={m} classId={cls.id} />
        ))}
      </div>
    </section>
  );
}

/**
 * At-a-glance index: one card per class listing its methods as jump links, so
 * the whole API surface is visible before scrolling into the detail.
 */
function ApiIndex({ modules }: { modules: ApiModule[] }) {
  return (
    <section aria-label="API at a glance" className="mb-14 grid gap-4 sm:grid-cols-2">
      {modules.flatMap((mod) =>
        mod.classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-xl border border-edge bg-surface/40 p-4"
          >
            <span className="block font-mono text-[11px] text-muted">
              {cls.module}
            </span>
            <a
              href={`#${classAnchor(cls.id)}`}
              onClick={jumpTo(classAnchor(cls.id))}
              className="mt-0.5 block font-mono text-sm font-semibold !text-gunmetal no-underline hover:!text-pine-dark"
            >
              {cls.name}
            </a>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {cls.methods.map((m) => (
                <a
                  key={m.name}
                  href={`#${methodAnchor(cls.id, m.name)}`}
                  onClick={jumpTo(methodAnchor(cls.id, m.name))}
                  className="rounded border border-edge bg-white px-1.5 py-0.5 font-mono text-[12px] !text-muted no-underline hover:border-pine hover:!text-pine-dark"
                >
                  {m.name}
                </a>
              ))}
            </div>
          </div>
        )),
      )}
    </section>
  );
}

export default function Api() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return API;
    return API.map((mod) => ({
      ...mod,
      classes: mod.classes.filter(
        (cls) =>
          cls.name.toLowerCase().includes(q) ||
          cls.module.toLowerCase().includes(q) ||
          cls.methods.some((m) => m.name.toLowerCase().includes(q)),
      ),
    })).filter((mod) => mod.classes.length > 0);
  }, [query]);

  const visibleClasses = filtered.flatMap((m) => m.classes);

  // Every rendered anchor (class + method) feeds the scroll-spy so the sidebar
  // highlights whatever is currently in view.
  const anchorIds = useMemo(
    () =>
      visibleClasses.flatMap((cls) => [
        classAnchor(cls.id),
        ...cls.methods.map((m) => methodAnchor(cls.id, m.name)),
      ]),
    [visibleClasses],
  );
  const activeId = useActiveHeading(anchorIds);

  /** A class is "active" when itself or one of its methods is in view. */
  const isClassActive = (cls: ApiClass) =>
    activeId === cls.id || (activeId?.startsWith(`${cls.id}-`) ?? false);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Left column: site nav on top, searchable API tree below */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <SiteNav />

          <nav aria-label="API reference" className="border-t border-edge pt-6">
            <label htmlFor="api-search" className="sr-only">
              Filter classes and methods
            </label>
            <input
              id="api-search"
              type="search"
              placeholder="Filter classes & methods…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-4 w-full rounded-lg border border-edge bg-white px-3 py-2 text-sm placeholder:text-muted"
            />
            <p aria-live="polite" className="sr-only">
              {visibleClasses.length} classes shown
            </p>
            <div className="space-y-5">
              {filtered.map((mod) => (
                <div key={mod.module}>
                  <p className="mb-1.5 break-words font-mono text-xs font-medium text-muted">
                    {mod.module}
                  </p>
                  <ul className="space-y-0.5 border-l border-edge">
                    {mod.classes.map((cls) => (
                      <li key={cls.id}>
                        <a
                          href={`#${classAnchor(cls.id)}`}
                          onClick={jumpTo(classAnchor(cls.id))}
                          aria-current={isClassActive(cls) ? "location" : undefined}
                          className={`-ml-px block break-words border-l-2 py-1 pl-3 font-mono text-sm leading-snug ${
                            isClassActive(cls)
                              ? "border-pine font-medium text-pine-dark"
                              : "border-transparent text-gunmetal hover:border-pine hover:text-pine-dark"
                          }`}
                        >
                          {cls.name}
                        </a>
                        <ul>
                          {cls.methods.map((m) => {
                            const anchor = methodAnchor(cls.id, m.name);
                            const active = activeId === anchor;
                            return (
                              <li key={m.name}>
                                <a
                                  href={`#${anchor}`}
                                  onClick={jumpTo(anchor)}
                                  aria-current={active ? "location" : undefined}
                                  className={`-ml-px block break-words border-l-2 py-0.5 pl-6 font-mono text-[13px] leading-snug ${
                                    active
                                      ? "border-pine font-medium text-pine-dark"
                                      : "border-transparent text-muted hover:border-pine hover:text-pine-dark"
                                  }`}
                                >
                                  {m.name}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted">No matches for “{query}”.</p>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Reference content */}
      <div className="prose-doc min-w-0 max-w-content">
        <h1>API Reference</h1>
        <p>
          Every public class and function in <code>s4d_tools</code>, grouped by
          layer. Jump straight from the index below, or use the sidebar to
          filter by name.
        </p>

        {visibleClasses.length > 0 && <ApiIndex modules={filtered} />}

        {visibleClasses.map((cls) => (
          <ClassSection key={cls.id} cls={cls} />
        ))}

        {visibleClasses.length === 0 && (
          <p className="text-muted">Nothing matches your filter.</p>
        )}
      </div>
    </div>
  );
}
