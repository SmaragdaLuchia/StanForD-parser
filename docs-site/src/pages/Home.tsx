import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import CopyButton from "../components/CopyButton";

function RoutingCard({
  to,
  eyebrow,
  title,
  body,
}: {
  to: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-2 rounded-xl border border-edge bg-surface p-6 transition-colors hover:border-pine"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {eyebrow}
      </span>
      <span className="text-lg font-semibold text-gunmetal">{title}</span>
      <span className="leading-6 text-muted">{body}</span>
      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-pine-dark">
        Get started
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          <path d="M3 8h9M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <section className="flex flex-col items-center gap-6 pb-12 pt-20 text-center">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <span className="font-mono text-2xl font-medium">s4d_tools</span>
        </div>

        <SearchBar />

        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight">
          Make sense of forestry machine data.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted">
          A clean, three-step Python pipeline to parse, standardize, and
          aggregate harvester and forwarder data.
        </p>

        {/* Install terminal */}
        <div className="w-full max-w-md overflow-hidden rounded-lg border border-edge bg-gunmetal text-left">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="font-mono text-xs text-white/60">terminal</span>
            <CopyButton text="pip install s4d_tools" label="Copy install command" />
          </div>
          <pre className="overflow-x-auto px-4 py-3.5">
            <code className="font-mono text-sm text-white">
              <span aria-hidden="true" className="select-none text-[#8FBF9F]">
                ${" "}
              </span>
              pip install s4d_tools
            </code>
          </pre>
        </div>
      </section>

      <section aria-label="Where to start" className="grid gap-5 pb-24 sm:grid-cols-2">
        <RoutingCard
          to="/concepts"
          eyebrow="Learn"
          title="New to forestry data?"
          body="Start with the concepts — machines, sensors, timestamps, and the vocabulary of the forest floor."
        />
        <RoutingCard
          to="/quickstart"
          eyebrow="Build"
          title="Ready to code?"
          body="Jump into the Quickstart and run the full parse → standardize → aggregate pipeline in minutes."
        />
      </section>
    </div>
  );
}
