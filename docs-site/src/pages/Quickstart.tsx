import { ReactNode } from "react";
import DocsLayout, { TocItem } from "../components/DocsLayout";
import CodeBlock from "../components/CodeBlock";

const TOC: TocItem[] = [
  { id: "install", label: "Install" },
  { id: "step-1", label: "1 · Parse" },
  { id: "step-2", label: "2 · Standardize" },
  { id: "step-3", label: "3 · Aggregate" },
  { id: "next", label: "Next steps" },
];

function ConsoleOutput({ children }: { children: ReactNode }) {
  return (
    <details className="group my-4 rounded-lg border border-edge bg-surface">
      <summary className="cursor-pointer select-none rounded-lg px-4 py-2.5 text-sm font-medium text-pine-dark hover:bg-pine-tint">
        Show console output
      </summary>
      <pre className="overflow-x-auto border-t border-edge p-4 text-[13px] leading-6">
        <code className="font-mono text-gunmetal">{children}</code>
      </pre>
    </details>
  );
}

function StepHeading({ id, n, children }: { id: string; n: number; children: ReactNode }) {
  return (
    <h2 id={id} className="!flex items-center gap-3 !border-b-0">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine font-mono text-sm font-medium text-white"
      >
        {n}
      </span>
      {children}
    </h2>
  );
}

export default function Quickstart() {
  return (
    <DocsLayout toc={TOC}>
      <h1>Quickstart</h1>
      <p>
        Go from a raw machine log to a species summary in three steps. Each
        step maps directly to a layer of{" "}
        <a href="#/pipeline">the pipeline architecture</a>.
      </p>

      <h2 id="install">Install</h2>
      <p>
        <code>s4d_tools</code> requires Python 3.11+ and builds on pandas.
      </p>
      <CodeBlock terminal code="pip install s4d_tools" />

      <StepHeading id="step-1" n={1}>
        Parse the file
      </StepHeading>
      <p>
        Pick the parser that matches your file extension —{" "}
        <code>HPRParser</code> for StanForD 2010 <code>.hpr</code> XML, or{" "}
        <code>PRDParser</code> / <code>PRIParser</code> /{" "}
        <code>APTParser</code> for StanForD Classic text files. Every parser
        returns a dict of pandas DataFrames, one per section of the file. The
        examples below use the minimal <code>toy_test.hpr</code> fixture from
        the repository's test suite — substitute your own file path.
      </p>
      <CodeBlock
        title="quickstart.py"
        code={`from s4d_tools import HPRParser

raw = HPRParser("tests/fixtures/toy_test.hpr").parse()

print(list(raw.keys()))
print(raw["logs"][["stem_key", "log_key", "product_key", "volume_sub_m3", "length_cm"]])`}
      />
      <ConsoleOutput>
        {`['header', 'machine', 'species_groups', 'products', 'objects', 'stems', 'logs']
   stem_key log_key product_key volume_sub_m3 length_cm
0  STEM_001       1           1         0.150        450`}
      </ConsoleOutput>

      <StepHeading id="step-2" n={2}>
        Standardize the report
      </StepHeading>
      <p>
        The transformer turns parser output into the <strong>standardized
        report</strong> — a dict of DataFrames with fixed columns that looks
        the same no matter which format it came from. Optional companion files
        are layered on with the <code>merge_*</code> functions.
      </p>
      <CodeBlock
        title="quickstart.py (continued)"
        code={`from s4d_tools.transformers import transform_hpr_to_standardized

report = transform_hpr_to_standardized(raw)

print(report["source_type"], "| has PRI:", report["has_pri"])
print(report["species_table"])`}
      />
      <ConsoleOutput>
        {`stanford_2010_hpr | has PRI: False
  species_name  trees  volume_m3
0            1      1        0.0`}
      </ConsoleOutput>
      <p>
        For Classic files the flow is identical — parse with{" "}
        <code>PRDParser</code>, standardize with{" "}
        <code>transform_prd_to_standardized</code>, and optionally enrich the
        report with a PRI or APT file:
      </p>
      <CodeBlock
        title="classic.py"
        code={`from s4d_tools import PRDParser, PRIParser, APTParser
from s4d_tools.transformers import (
    transform_prd_to_standardized,
    merge_pri_into_standardized,
)

report = transform_prd_to_standardized(
    PRDParser("data/production.prd").parse(),
    apt_parse_result=APTParser("data/instructions.apt").parse(),
)
report = merge_pri_into_standardized(report, PRIParser("data/production.pri").parse())`}
      />

      <StepHeading id="step-3" n={3}>
        Aggregate
      </StepHeading>
      <p>
        Aggregators are pure functions over the standardized tables — pass
        them the report's DataFrames and get chart-ready frames back.
      </p>
      <CodeBlock
        title="quickstart.py (continued)"
        code={`from s4d_tools.aggregators import (
    aggregate_stems_by_species,
    aggregate_volume_by_species_and_product,
)

stems_by_species = aggregate_stems_by_species(
    report["stems"], report["species_groups"]
)
print(stems_by_species)

volumes, species_order = aggregate_volume_by_species_and_product(
    report["logs"], report["stems"], report["species_groups"], report["products"]
)
print(volumes)`}
      />
      <ConsoleOutput>
        {`  species_name  stem_count
0            1           1
  species_name product_name  volume
0            1            1       0`}
      </ConsoleOutput>
      <p>
        (The toy fixture has a single unnamed species and one log without a
        bark-on volume; a real <code>.hpr</code> file yields one row per
        species and product with summed volumes.)
      </p>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          Understand what each stage does to the data in{" "}
          <a href="#/pipeline">The Layered Architecture</a>.
        </li>
        <li>
          Explore every class and function in the{" "}
          <a href="#/api">API Reference</a>.
        </li>
        <li>
          New to the domain? Read <a href="#/concepts">Forestry Data 101</a>{" "}
          first.
        </li>
      </ul>
    </DocsLayout>
  );
}
