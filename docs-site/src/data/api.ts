/** Static API reference model, mirroring the s4d_tools package layout. */

export interface ApiParam {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface ApiMethod {
  name: string;
  signature: string;
  summary: string;
  params: ApiParam[];
  returns?: { type: string; description: string };
}

export interface ApiClass {
  id: string;
  name: string;
  module: string;
  summary: string;
  /** Constructor signature, for classes instantiated with a file path. */
  construct?: string;
  methods: ApiMethod[];
}

export interface ApiModule {
  module: string;
  classes: ApiClass[];
}

export const API: ApiModule[] = [
  {
    module: "s4d_tools.parsers",
    classes: [
      {
        id: "hpr-parser",
        name: "HPRParser",
        module: "s4d_tools.parsers.stanford_2010",
        summary:
          "Parser for StanForD 2010 harvested-production (.hpr) XML files produced by harvesters. The XML tree is parsed on construction; measurement units (length, diameter, volume) are read from the root element attributes.",
        construct: "HPRParser(file_path)",
        methods: [
          {
            name: "parse",
            signature: "parser.parse() -> dict[str, pd.DataFrame]",
            summary:
              "Parse every section of the file into DataFrames. Sections that are absent come back as empty DataFrames, never None.",
            params: [],
            returns: {
              type: "dict[str, pd.DataFrame]",
              description:
                'Keys: "header", "machine", "species_groups", "products", "objects", "stems", "logs".',
            },
          },
        ],
      },
      {
        id: "pin-parser",
        name: "PINParser",
        module: "s4d_tools.parsers.stanford_2010",
        summary:
          "Parser for StanForD 2010 product-instruction (.pin) XML files, which carry product definitions and diameter × length price matrices.",
        construct: "PINParser(file_path)",
        methods: [
          {
            name: "parse",
            signature: "parser.parse() -> dict[str, pd.DataFrame]",
            summary: "Parse product definitions and price matrices.",
            params: [],
            returns: {
              type: "dict[str, pd.DataFrame]",
              description: 'Keys: "products", "price_matrices".',
            },
          },
        ],
      },
      {
        id: "prd-parser",
        name: "PRDParser",
        module: "s4d_tools.parsers.stanford_classic",
        summary:
          "Parser for StanForD Classic production (.prd) files — tilde-separated text keyed by (group_id, variable_id) pairs. Files are read with the iso-8859-15 encoding.",
        construct: "PRDParser(file_path)",
        methods: [
          {
            name: "parse",
            signature: "parser.parse() -> dict[str, pd.DataFrame]",
            summary: "Parse all known sections into DataFrames.",
            params: [],
            returns: {
              type: "dict[str, pd.DataFrame]",
              description:
                'Keys: "header", "machine", "objects", "species_groups", "products", "statistics".',
            },
          },
        ],
      },
      {
        id: "pri-parser",
        name: "PRIParser",
        module: "s4d_tools.parsers.stanford_classic",
        summary:
          "Parser for StanForD Classic production-individual (.pri) files. Produces the richest Classic output, including a dynamic per-log table whose columns are driven by the numeric log codes present in the file.",
        construct: "PRIParser(file_path)",
        methods: [
          {
            name: "parse",
            signature: "parser.parse() -> dict[str, pd.DataFrame]",
            summary: "Parse all known sections into DataFrames.",
            params: [],
            returns: {
              type: "dict[str, pd.DataFrame]",
              description:
                'Keys include "header", "machine", "objects", "buyer_vendor", "calibration", "apt_history", "species_groups", "products", "price_matrices", "operators", "production_statistics", "log_codes", "tree_codes", "additional_info", "logs".',
            },
          },
        ],
      },
      {
        id: "apt-parser",
        name: "APTParser",
        module: "s4d_tools.parsers.stanford_classic",
        summary:
          "Parser for StanForD Classic bucking / price-instruction (.apt) files. Its main job is extracting the relative price-value matrix per species and assortment.",
        construct: "APTParser(file_path)",
        methods: [
          {
            name: "parse",
            signature: "parser.parse() -> dict[str, Any]",
            summary:
              "Parse the file. The result can be passed directly as apt_parse_result to the transform/merge functions.",
            params: [],
            returns: {
              type: "dict[str, Any]",
              description:
                'A dict with key "price_matrix" holding species names, assortment names, diameter/length class limits, grade bitmasks, and the flat relative-price matrix.',
            },
          },
          {
            name: "parse_price_matrix",
            signature: "parser.parse_price_matrix() -> dict[str, Any]",
            summary:
              "Parse only the price-matrix variables (groups 111–162) into typed lists.",
            params: [],
            returns: {
              type: "dict[str, Any]",
              description:
                "Species counts, assortment/diameter/length class definitions, and the flat relative-price value matrix.",
            },
          },
          {
            name: "parse_raw_blocks",
            signature:
              "parser.parse_raw_blocks() -> dict[tuple[int, int], str]",
            summary:
              "Return every (group_id, variable_id) block in the file as normalized text — useful for exploring fields the parser does not shape yet.",
            params: [],
            returns: {
              type: "dict[tuple[int, int], str]",
              description: "Raw block values keyed by (group_id, variable_id).",
            },
          },
        ],
      },
    ],
  },
  {
    module: "s4d_tools.transformers",
    classes: [
      {
        id: "transform-functions",
        name: "transform_* functions",
        module: "s4d_tools.transformers",
        summary:
          'Build a standardized report from one primary source. The standardized report is a dict of DataFrames with fixed column sets — keys "header", "machine", "objects", "species_groups", "products", "statistics", "species_table", "species_product_volume", "stems", "logs", "pricing_matrix" — plus the metadata keys "source_type" and "has_pri". It is the only shape the UI layer consumes.',
        methods: [
          {
            name: "transform_hpr_to_standardized",
            signature:
              "transform_hpr_to_standardized(hpr_data, apt_parse_result=None) -> dict",
            summary:
              "Standardize HPRParser output. Computes per-species statistics and the species table from stems and logs.",
            params: [
              {
                name: "hpr_data",
                type: "dict[str, pd.DataFrame]",
                description: "Output of HPRParser.parse().",
              },
              {
                name: "apt_parse_result",
                type: "dict | pd.DataFrame | None",
                description:
                  "Optional APTParser.parse() output; fills the pricing_matrix table.",
                default: "None",
              },
            ],
            returns: {
              type: "dict",
              description:
                'Standardized report with source_type "stanford_2010_hpr".',
            },
          },
          {
            name: "transform_prd_to_standardized",
            signature:
              "transform_prd_to_standardized(prd_data, apt_parse_result=None) -> dict",
            summary: "Standardize PRDParser output.",
            params: [
              {
                name: "prd_data",
                type: "dict[str, pd.DataFrame]",
                description: "Output of PRDParser.parse().",
              },
              {
                name: "apt_parse_result",
                type: "dict | pd.DataFrame | None",
                description:
                  "Optional APTParser.parse() output; fills the pricing_matrix table.",
                default: "None",
              },
            ],
            returns: {
              type: "dict",
              description:
                'Standardized report with source_type "classic_prd".',
            },
          },
          {
            name: "transform_pin_to_standardized",
            signature: "transform_pin_to_standardized(pin_data) -> dict",
            summary:
              "Standardize PINParser output into a report carrying products and the pricing matrix.",
            params: [
              {
                name: "pin_data",
                type: "dict[str, pd.DataFrame]",
                description: "Output of PINParser.parse().",
              },
            ],
            returns: {
              type: "dict",
              description:
                'Standardized report with source_type "stanford_2010_pin".',
            },
          },
          {
            name: "transform_apt_to_standardized",
            signature:
              "transform_apt_to_standardized(apt_parse_result) -> dict",
            summary:
              "Standardize APTParser output into a report whose only populated table is pricing_matrix.",
            params: [
              {
                name: "apt_parse_result",
                type: "dict | pd.DataFrame",
                description: "Output of APTParser.parse().",
              },
            ],
            returns: {
              type: "dict",
              description:
                'Standardized report with source_type "classic_apt".',
            },
          },
        ],
      },
      {
        id: "merge-functions",
        name: "merge_* functions",
        module: "s4d_tools.transformers",
        summary:
          "Layer optional secondary sources onto an existing standardized report. Each returns a new report dict; the input is not mutated.",
        methods: [
          {
            name: "merge_pri_into_standardized",
            signature:
              "merge_pri_into_standardized(standardized, pri_data) -> dict",
            summary:
              'Fill missing header/machine/object fields from a PRI file, attach its per-log table, build the species × product volume table, and set has_pri to True.',
            params: [
              {
                name: "standardized",
                type: "dict",
                description: "An existing standardized report.",
              },
              {
                name: "pri_data",
                type: "dict[str, pd.DataFrame]",
                description: "Output of PRIParser.parse().",
              },
            ],
            returns: {
              type: "dict",
              description: "New standardized report enriched with PRI data.",
            },
          },
          {
            name: "merge_pin_into_standardized",
            signature:
              "merge_pin_into_standardized(standardized, pin_data) -> dict",
            summary:
              "Replace the pricing_matrix table (and fill products, if empty) from a PIN file.",
            params: [
              {
                name: "standardized",
                type: "dict",
                description: "An existing standardized report.",
              },
              {
                name: "pin_data",
                type: "dict[str, pd.DataFrame]",
                description: "Output of PINParser.parse().",
              },
            ],
            returns: {
              type: "dict",
              description: "New standardized report with PIN pricing data.",
            },
          },
          {
            name: "merge_apt_into_standardized",
            signature:
              "merge_apt_into_standardized(standardized, apt_parse_result) -> dict",
            summary: "Replace the pricing_matrix table from an APT file.",
            params: [
              {
                name: "standardized",
                type: "dict",
                description: "An existing standardized report.",
              },
              {
                name: "apt_parse_result",
                type: "dict | pd.DataFrame",
                description: "Output of APTParser.parse().",
              },
            ],
            returns: {
              type: "dict",
              description: "New standardized report with APT pricing data.",
            },
          },
        ],
      },
    ],
  },
  {
    module: "s4d_tools.aggregators",
    classes: [
      {
        id: "species-aggregations",
        name: "Species & product aggregations",
        module: "s4d_tools.aggregators",
        summary:
          "Pure functions over standardized DataFrames that produce chart-ready frames. No parsing, no I/O.",
        methods: [
          {
            name: "aggregate_stems_by_species",
            signature:
              "aggregate_stems_by_species(stems, species_groups) -> pd.DataFrame",
            summary:
              "Count harvested trees (stems) per species, resolving species names from the species_groups table.",
            params: [
              {
                name: "stems",
                type: "pd.DataFrame",
                description: 'The standardized report\'s "stems" table.',
              },
              {
                name: "species_groups",
                type: "pd.DataFrame",
                description:
                  'The standardized report\'s "species_groups" table, used to map keys to names.',
              },
            ],
            returns: {
              type: "pd.DataFrame",
              description: "Columns: species_name, tree_count.",
            },
          },
          {
            name: "aggregate_volume_by_species_and_product",
            signature:
              "aggregate_volume_by_species_and_product(logs, stems, species_groups, products) -> tuple[pd.DataFrame, list[str]]",
            summary:
              "Join logs to stems and sum log volume (volume_sob_m3) per species × product pair.",
            params: [
              {
                name: "logs",
                type: "pd.DataFrame",
                description: 'The standardized report\'s "logs" table.',
              },
              {
                name: "stems",
                type: "pd.DataFrame",
                description: 'The standardized report\'s "stems" table.',
              },
              {
                name: "species_groups",
                type: "pd.DataFrame",
                description: "Species key → name mapping.",
              },
              {
                name: "products",
                type: "pd.DataFrame",
                description: "Product key → name mapping.",
              },
            ],
            returns: {
              type: "tuple[pd.DataFrame, list[str]]",
              description:
                "A long-form frame with columns species_name, product_name, volume — plus the species display order.",
            },
          },
          {
            name: "pivot_volume_for_streamlit",
            signature:
              "pivot_volume_for_streamlit(sp_long, species_order) -> pd.DataFrame",
            summary:
              "Pivot the long-form species × product volumes into a species-by-product matrix for charting.",
            params: [
              {
                name: "sp_long",
                type: "pd.DataFrame",
                description:
                  "Long-form output of aggregate_volume_by_species_and_product.",
              },
              {
                name: "species_order",
                type: "list[str]",
                description: "Row order for the pivoted matrix.",
              },
            ],
            returns: {
              type: "pd.DataFrame",
              description: "Species rows × product columns, volumes as values.",
            },
          },
          {
            name: "pivot_volume_to_percent_long",
            signature: "pivot_volume_to_percent_long(pivot) -> pd.DataFrame",
            summary:
              "Convert a pivoted volume matrix into long-form row percentages (each species sums to 100%).",
            params: [
              {
                name: "pivot",
                type: "pd.DataFrame",
                description: "Output of pivot_volume_for_streamlit.",
              },
            ],
            returns: {
              type: "pd.DataFrame",
              description: "Columns: species_name, product_name, percent.",
            },
          },
        ],
      },
      {
        id: "price-matrix",
        name: "Price-matrix aggregations",
        module: "s4d_tools.aggregators",
        summary:
          'Functions over the standardized "pricing_matrix" table (long-form rows with Species_Name, Assortment_Name, diameter/length class limits, and Relative_Value).',
        methods: [
          {
            name: "pivot_relative_value_matrix",
            signature: "pivot_relative_value_matrix(longform) -> pd.DataFrame",
            summary:
              "Pivot long-form pricing rows into a diameter-class × length-class matrix of relative values.",
            params: [
              {
                name: "longform",
                type: "pd.DataFrame",
                description:
                  'The standardized "pricing_matrix" table (or one species/assortment slice of it).',
              },
            ],
            returns: {
              type: "pd.DataFrame",
              description:
                "Diameter_Limit_mm rows × Length_Limit_cm columns with Relative_Value cells.",
            },
          },
          {
            name: "price_matrix_heatmaps_by_assortment",
            signature:
              "price_matrix_heatmaps_by_assortment(longform) -> list[dict]",
            summary:
              "Split the pricing table by (species, assortment) and pivot each group into its own heatmap-ready matrix.",
            params: [
              {
                name: "longform",
                type: "pd.DataFrame",
                description: 'The standardized "pricing_matrix" table.',
              },
            ],
            returns: {
              type: "list[dict]",
              description:
                "One dict per assortment: species_name, assortment_name, allowed_grades_bitmask, relative_value_matrix.",
            },
          },
        ],
      },
    ],
  },
];
