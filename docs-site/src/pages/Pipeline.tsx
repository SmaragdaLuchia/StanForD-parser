import { useRef, useState } from "react";
import DocsLayout, { TocItem } from "../components/DocsLayout";

interface Step {
  id: string;
  label: string;
  heading: string;
  description: string;
  inputNote: string | null; // shown above the table for derived steps
  columns: string[];
  rows: string[][];
  module: string;
}

const STEPS: Step[] = [
  {
    id: "raw",
    label: "Raw Parsing",
    heading: "Step 1 · Raw Parsing",
    description:
      "Machine logs arrive in one of two StanForD dialects: Classic tilde-separated text files (.prd, .pri, .apt, .stm) or StanForD 2010 XML (.hpr, .pin). Each parser reads one format and returns a dict of DataFrames, one per file section — header, machine, objects, stems, logs — keeping the source file's own field vocabulary. Below: the logs table from HPRParser.parse().",
    inputNote: null,
    module: "s4d_tools.parsers",
    columns: ["stem_key", "log_key", "product_key", "volume_sob_m3", "length_cm", "diameter_top_ob"],
    rows: [
      ["STEM_001", "1", "1", "0.312", "450", "218"],
      ["STEM_001", "2", "1", "0.204", "430", "176"],
      ["STEM_002", "1", "2", "0.155", "400", "152"],
      ["STEM_002", "2", "3", "0.089", "310", "121"],
    ],
  },
  {
    id: "standardizing",
    label: "Standardizing",
    heading: "Step 2 · Standardizing",
    description:
      "The transform_* functions reshape parser output into the standardized report: a dict of DataFrames with fixed column sets that looks identical whether the data came from a Classic PRD file or a 2010 HPR file. Companion files (PRI, PIN, APT) are layered on with merge_* functions. Two metadata keys — source_type and has_pri — record where the report came from. Below: the standardized stems table.",
    inputNote: "Derived from the Raw Parsing output above",
    module: "s4d_tools.transformers",
    columns: ["stem_key", "object_key", "sub_object_key", "species_group_key", "harvest_date", "stem_number"],
    rows: [
      ["STEM_001", "SITE_01", "Sub_01", "1", "01-06-2024 08:14", "1"],
      ["STEM_002", "SITE_01", "Sub_01", "1", "01-06-2024 08:19", "2"],
      ["STEM_003", "SITE_01", "Sub_01", "2", "01-06-2024 08:25", "3"],
      ["STEM_004", "SITE_01", "Sub_01", "2", "01-06-2024 08:31", "4"],
    ],
  },
  {
    id: "aggregating",
    label: "Aggregating",
    heading: "Step 3 · Aggregating",
    description:
      "Aggregators are pure functions over standardized DataFrames — no parsing, no I/O. They produce the chart-ready frames the Streamlit app plots: tree counts per species, volume per species × product, and price-matrix heatmaps. Because they only ever consume the standardized schema, the same aggregations work for every source format. Below: aggregate_volume_by_species_and_product().",
    inputNote: "Derived from the Standardizing output above",
    module: "s4d_tools.aggregators",
    columns: ["species_name", "product_name", "volume_m3"],
    rows: [
      ["Pine", "Pine sawlog", "0.516"],
      ["Pine", "Pine pulpwood", "0.155"],
      ["Spruce", "Spruce sawlog", "0.089"],
    ],
  },
];

const TOC: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "explorer", label: "Layer explorer" },
  { id: "why-layers", label: "Why three layers?" },
];

/**
 * Interactive stepped explorer for the three pipeline layers.
 * Implements the WAI-ARIA tabs pattern: arrow keys move between steps,
 * Home/End jump to first/last, selection follows focus.
 */
function LayerExplorer() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (active + 1) % STEPS.length;
    else if (e.key === "ArrowLeft") next = (active - 1 + STEPS.length) % STEPS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = STEPS.length - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div>
      {/* Segmented control */}
      <div
        role="tablist"
        aria-label="Pipeline layers"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 rounded-xl border border-edge bg-surface p-2 sm:flex-row sm:items-center"
      >
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <button
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${s.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                active === i
                  ? "bg-pine text-white shadow-sm"
                  : "text-muted hover:bg-alabaster hover:text-gunmetal"
              }`}
            >
              <span className="mr-1.5 font-mono text-xs opacity-80">{i + 1}</span>
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="hidden shrink-0 text-muted sm:block"
              >
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Active panel */}
      {STEPS.map((s, i) => (
        <div
          key={s.id}
          role="tabpanel"
          id={`panel-${s.id}`}
          aria-labelledby={`tab-${s.id}`}
          hidden={active !== i}
          tabIndex={0}
          className="mt-6 rounded-xl border border-edge bg-white p-6"
        >
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="!my-0 text-base font-semibold">{s.heading}</h3>
            <code className="rounded bg-surface px-2 py-0.5 font-mono text-xs text-muted">
              {s.module}
            </code>
          </div>
          <p className="mb-5 mt-2 leading-7 text-gunmetal">{s.description}</p>

          {s.inputNote && (
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-pine-dark">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 2v10M4 8.5L8 12.5L12 8.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {s.inputNote}
            </p>
          )}

          <div className="overflow-x-auto rounded-lg border border-edge">
            <table className="table-doc">
              <caption>Example data at the {s.label} stage</caption>
              <thead>
                <tr>
                  {s.columns.map((col) => (
                    <th key={col} scope="col" className="font-mono normal-case">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {s.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Pipeline() {
  return (
    <DocsLayout toc={TOC}>
      <h1 id="overview">The Layered Architecture</h1>
      <p>
        <code>s4d_tools</code> processes forestry machine data in three strictly
        ordered layers. Each layer consumes only the output of the one before
        it, which keeps vendor quirks contained at the bottom and business
        logic clean at the top.
      </p>

      <h2 id="explorer">Layer explorer</h2>
      <p>
        Select a step to see what the data looks like at that stage of the
        pipeline.
      </p>
      <LayerExplorer />

      <h2 id="why-layers">Why three layers?</h2>
      <p>
        Forestry machines speak more than one dialect — StanForD Classic
        tilde-separated text files and StanForD 2010 XML, with several file
        types in each family. A layered design means:
      </p>
      <ul>
        <li>
          <strong>Isolation of mess.</strong> Vendor-specific decoding lives
          only in the parsing layer. A new machine model means a new parser,
          nothing else.
        </li>
        <li>
          <strong>One schema to learn.</strong> Everything downstream of
          standardizing works with the same column names and units, regardless
          of the data source.
        </li>
        <li>
          <strong>Reproducible reports.</strong> Aggregations are pure
          functions of standardized data, so a report can always be traced
          back to the source records that produced it.
        </li>
      </ul>
      <p>
        Ready to run it yourself? Head to the{" "}
        <a href="#/quickstart">Quickstart</a>.
      </p>
    </DocsLayout>
  );
}
