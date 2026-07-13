import CopyButton from "./CopyButton";

/**
 * Code block with an optional title bar and copy button.
 * `terminal` renders a `$ ` prompt per line (excluded from the copied text).
 */
export default function CodeBlock({
  code,
  title,
  terminal = false,
}: {
  code: string;
  title?: string;
  terminal?: boolean;
}) {
  const lines = code.split("\n");

  return (
    <figure className="my-5 overflow-hidden rounded-lg border border-edge bg-surface">
      <figcaption className="flex items-center justify-between gap-3 border-b border-edge px-4 py-2">
        <span className="font-mono text-xs text-muted">
          {title ?? (terminal ? "terminal" : "python")}
        </span>
        <CopyButton text={code} />
      </figcaption>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code className="font-mono text-gunmetal">
          {terminal
            ? lines.map((line, i) => (
                <span key={i} className="block">
                  <span aria-hidden="true" className="select-none text-pine-dark">
                    ${" "}
                  </span>
                  {line}
                </span>
              ))
            : code}
        </code>
      </pre>
    </figure>
  );
}
