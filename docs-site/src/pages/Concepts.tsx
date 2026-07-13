import DocsLayout, { TocItem } from "../components/DocsLayout";

const TOC: TocItem[] = [
  { id: "machines", label: "The machines" },
  { id: "sensors", label: "Sensors & signals" },
  { id: "timestamps", label: "Timestamps" },
  { id: "glossary", label: "Glossary" },
];

/** Flat-vector placeholder: harvester and forwarder in a stylized forest. */
function ForestIllustration() {
  return (
    <svg
      viewBox="0 0 560 200"
      role="img"
      aria-labelledby="forest-illu-title"
      className="my-6 w-full rounded-xl border border-edge bg-surface"
    >
      <title id="forest-illu-title">
        Stylized illustration of a harvester felling trees and a forwarder
        carrying logs
      </title>
      {/* ground */}
      <rect x="0" y="160" width="560" height="40" fill="#DDE3DE" />
      {/* trees */}
      {[40, 90, 140, 420, 470, 520].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y={120} width="8" height="42" fill="#8A7B6C" />
          <path d={`M${x} 55 L${x + 26} 125 L${x - 26} 125 Z`} fill="#4A7C59" opacity={0.85} />
          <path d={`M${x} 75 L${x + 20} 128 L${x - 20} 128 Z`} fill="#3E6B4C" opacity={0.9} />
        </g>
      ))}
      {/* harvester */}
      <g>
        <rect x="200" y="128" width="70" height="34" rx="6" fill="#4A7C59" />
        <rect x="212" y="108" width="34" height="26" rx="4" fill="#3E6B4C" />
        <circle cx="216" cy="166" r="11" fill="#2B343A" />
        <circle cx="254" cy="166" r="11" fill="#2B343A" />
        <path d="M270 130 L305 100" stroke="#55636C" strokeWidth="6" strokeLinecap="round" />
        <rect x="298" y="92" width="18" height="14" rx="3" fill="#55636C" />
      </g>
      {/* forwarder with logs */}
      <g>
        <rect x="340" y="132" width="46" height="30" rx="5" fill="#4A7C59" />
        <rect x="348" y="114" width="26" height="22" rx="4" fill="#3E6B4C" />
        <rect x="388" y="138" width="4" height="24" fill="#55636C" />
        {[0, 1, 2].map((row) => (
          <rect key={row} x="392" y={150 - row * 9} width="52" height="8" rx="4" fill="#8A7B6C" />
        ))}
        <circle cx="352" cy="166" r="10" fill="#2B343A" />
        <circle cx="378" cy="166" r="10" fill="#2B343A" />
        <circle cx="412" cy="166" r="10" fill="#2B343A" />
        <circle cx="436" cy="166" r="10" fill="#2B343A" />
      </g>
    </svg>
  );
}

/** Flat-vector placeholder: a sensor signal becoming a timestamped record. */
function SignalIllustration() {
  return (
    <svg
      viewBox="0 0 560 120"
      role="img"
      aria-labelledby="signal-illu-title"
      className="my-6 w-full rounded-xl border border-edge bg-surface"
    >
      <title id="signal-illu-title">
        Stylized illustration of a sensor waveform turning into structured
        timestamped records
      </title>
      <polyline
        points="30,60 70,60 85,30 100,90 115,45 130,75 145,60 190,60"
        fill="none"
        stroke="#4A7C59"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M225 60 h60 M270 45 l15 15 -15 15" fill="none" stroke="#55636C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect x="330" y={30 + row * 24} width="200" height="16" rx="4" fill="#FFFFFF" stroke="#D9DEE2" />
          <rect x="338" y={34 + row * 24} width="60" height="8" rx="3" fill="#4A7C59" opacity="0.55" />
          <rect x="406" y={34 + row * 24} width="100" height="8" rx="3" fill="#55636C" opacity="0.35" />
        </g>
      ))}
    </svg>
  );
}

const GLOSSARY: { term: string; definition: string }[] = [
  {
    term: "Harvester",
    definition:
      "The machine that fells, delimbs, and cuts trees into logs at the stump. Its measuring head is the source of most stem-level data.",
  },
  {
    term: "Forwarder",
    definition:
      "The machine that picks up cut logs and carries them from the felling site to the roadside landing.",
  },
  {
    term: "Stem Profile",
    definition:
      "The sequence of diameter measurements taken along a single tree stem as it is fed through the harvester head — effectively the tree's shape as data.",
  },
  {
    term: "Assortment",
    definition:
      "A product class a log is bucked into (e.g. sawlog, pulpwood), defined by species, dimensions, and quality requirements.",
  },
  {
    term: "Bucking",
    definition:
      "Cutting a felled stem into logs. The harvester's onboard computer chooses cut points to maximize the value of the assortments produced.",
  },
  {
    term: "Productivity",
    definition:
      "Output per unit of time, typically cubic metres harvested or forwarded per effective working hour (m³/h).",
  },
  {
    term: "StanForD",
    definition:
      "The de-facto standard file formats for forest machine data. Classic uses key–value text files (.apt, .prd, .pri, .stm); StanForD 2010 uses XML (.hpr, .pin).",
  },
  {
    term: "Cut-to-length (CTL)",
    definition:
      "The harvesting method — dominant in the Nordics — where trees are processed into final log lengths in the forest, by the harvester–forwarder pair.",
  },
];

export default function Concepts() {
  return (
    <DocsLayout toc={TOC}>
      <h1>Forestry Data 101</h1>
      <p>
        Modern timber harvesting is run by two machines and a stream of
        numbers. This page gives you just enough forestry context to read that
        stream comfortably — no chainsaw required.
      </p>

      <h2 id="machines">The machines</h2>
      <p>
        In cut-to-length logging, a <strong>harvester</strong> fells each tree,
        strips its branches, and cuts the stem into logs on the spot. A{" "}
        <strong>forwarder</strong> then carries those logs to the roadside.
        Both machines carry onboard computers that record what they do — every
        stem, every cut, every load — and write it to log files in the
        StanForD family of formats.
      </p>
      <ForestIllustration />

      <h2 id="sensors">Sensors &amp; signals</h2>
      <p>
        The harvester head is a measuring instrument as much as a saw. Feed
        rollers measure length as the stem passes through; delimbing knives
        measure diameter. Combined, they produce the{" "}
        <strong>stem profile</strong> — from which volume is computed the
        moment the log is cut. Additional sensors report machine state: engine
        load, hydraulic pressure, operator actions.
      </p>
      <p>
        These signals arrive as dense, vendor-specific records. A single shift
        can produce tens of thousands of them, and their formats differ
        between manufacturers — which is exactly the problem{" "}
        <code>s4d_tools</code> exists to solve.
      </p>
      <SignalIllustration />

      <h2 id="timestamps">Timestamps</h2>
      <p>
        Every record carries a timestamp, and timestamps are where most
        forestry data projects first go wrong:
      </p>
      <ul>
        <li>
          Machines log in <strong>local cab time</strong>, often without a
          timezone marker, and operators cross timezone borders.
        </li>
        <li>
          Onboard clocks drift, and are sometimes reset mid-shift.
        </li>
        <li>
          Different files from the same machine may use different date formats.
        </li>
      </ul>
      <p>
        The parsers therefore normalize the date fields they extract into one
        consistent <code>DD-MM-YYYY HH:MM</code> display format, so headers,
        objects, and stems read the same regardless of which file format they
        came from. See <a href="#/pipeline">The Layered Architecture</a> for
        how that fits into the pipeline.
      </p>

      <h2 id="glossary">Glossary</h2>
      <div className="overflow-x-auto rounded-lg border border-edge">
        <table className="table-doc">
          <caption>Definitions of common forestry data terms</caption>
          <thead>
            <tr>
              <th scope="col" className="w-44">
                Term
              </th>
              <th scope="col">Definition</th>
            </tr>
          </thead>
          <tbody>
            {GLOSSARY.map((row) => (
              <tr key={row.term}>
                <th scope="row" className="border-b border-edge bg-transparent px-3 py-2 text-left align-top text-sm font-semibold normal-case tracking-normal text-gunmetal">
                  {row.term}
                </th>
                <td className="leading-6">{row.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocsLayout>
  );
}
