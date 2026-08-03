/** Lightweight static search index over the site's pages and key sections. */
export interface SearchEntry {
  title: string;
  path: string; // react-router path, optionally with #anchor
  keywords: string;
}

export const SEARCH_INDEX: SearchEntry[] = [
  { title: "Forestry Data 101", path: "/concepts", keywords: "concepts machine data sensors timestamps beginner intro" },
  { title: "Glossary — Stem Profile, Assortment, Productivity", path: "/concepts", keywords: "glossary stem profile assortment productivity harvester forwarder stanford definitions" },
  { title: "The Layered Architecture", path: "/pipeline", keywords: "pipeline layers raw parsing standardizing aggregating architecture" },
  { title: "Raw Parsing layer", path: "/pipeline", keywords: "raw parsing hex payload packets parsers stanford classic 2010" },
  { title: "Standardizing layer", path: "/pipeline", keywords: "standardize transformers schema iso timestamps machine id" },
  { title: "Aggregating layer", path: "/pipeline", keywords: "aggregate volume fleet productivity reports summaries" },
  { title: "Quickstart", path: "/quickstart", keywords: "quickstart install pip pipeline parse standardize aggregate tutorial" },
  { title: "Sample files — download toy HPR, PIN, PRD, PRI, APT", path: "/quickstart", keywords: "sample files download zip example test data toy hpr pin prd pri apt try it out quickstart" },
  { title: "API Reference", path: "/api", keywords: "api classes functions methods reference parser transformer aggregator" },
  { title: "Parsers — HPRParser, PRDParser, PRIParser, APTParser, PINParser", path: "/api", keywords: "HPRParser PRDParser PRIParser APTParser PINParser parse hpr prd pri apt pin stanford classic 2010 api" },
  { title: "Transformers — standardized report", path: "/api", keywords: "transform_hpr_to_standardized transform_prd_to_standardized merge_pri_into_standardized merge_pin_into_standardized merge_apt_into_standardized standardized report source_type has_pri api transformers" },
  { title: "Aggregators — species, volume, price matrix", path: "/api", keywords: "aggregate_stems_by_species aggregate_volume_by_species_and_product pivot_volume_for_streamlit pivot_relative_value_matrix price_matrix_heatmaps_by_assortment api aggregators" },
];

/** Case-insensitive substring match over title + keywords. */
export function searchSite(query: string, limit = 6): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return SEARCH_INDEX.filter(
    (e) =>
      e.title.toLowerCase().includes(q) || e.keywords.toLowerCase().includes(q),
  ).slice(0, limit);
}
