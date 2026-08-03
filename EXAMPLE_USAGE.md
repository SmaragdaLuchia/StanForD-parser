# s4d-tools Usage Examples

After `pip install s4d-tools`, here's how to use the library.

All examples below run against the downloadable sample files —
**[s4d-tools-samples.zip](https://smaragdaluchia.github.io/s4d_tools/samples/s4d-tools-samples.zip)** —
extracted so the `s4d-tools-samples/` folder sits next to your script. The
printed outputs are the actual results for those files; substitute your own
file paths to analyze real harvests. See also the
[Quickstart](https://smaragdaluchia.github.io/s4d_tools/#/quickstart).

## Example 1: Parse and analyze a single file

```python
from s4d_tools import HPRParser, transform_hpr_to_standardized
from s4d_tools import aggregate_stems_by_species

# Parse a StanForD 2010 HPR file
parser = HPRParser("s4d-tools-samples/sample.hpr")
raw_data = parser.parse()

# Transform to standardized format (common schema for all formats)
report = transform_hpr_to_standardized(raw_data)

# Analyze: count stems by species
stems_by_species = aggregate_stems_by_species(
    report["stems"],
    report["species_groups"]
)
print(stems_by_species)
#   species_name  stem_count
# 0         Pine           3
# 1       Spruce           2
```

## Example 2: Combine multiple files (PRD + PRI)

```python
from s4d_tools import PRDParser, PRIParser
from s4d_tools import transform_prd_to_standardized, merge_pri_into_standardized

# Parse PRD (production summary)
prd_data = PRDParser("s4d-tools-samples/sample.prd").parse()

# Parse PRI (production details)
pri_data = PRIParser("s4d-tools-samples/sample.pri").parse()

# Create base report from PRD
report = transform_prd_to_standardized(prd_data)

# Enrich with PRI data (fills gaps, adds log details)
report = merge_pri_into_standardized(report, pri_data)

print(f"Report has_pri: {report['has_pri']}")   # Report has_pri: True
print(f"Logs available: {len(report['logs'])}")  # Logs available: 10
```

## Example 3: Analyze volume by species and product

```python
from s4d_tools import HPRParser, transform_hpr_to_standardized
from s4d_tools import aggregate_volume_by_species_and_product

# Parse and standardize
raw = HPRParser("s4d-tools-samples/sample.hpr").parse()
report = transform_hpr_to_standardized(raw)

# Get volume breakdown by species × product
volumes, species_order = aggregate_volume_by_species_and_product(
    report["logs"],
    report["stems"],
    report["species_groups"],
    report["products"]
)

print(volumes)
#   species_name     product_name  volume_m3
# 0         Pine      Pine Sawlog      1.550
# 1         Pine    Pine Pulpwood      0.320
# 2       Spruce    Spruce Sawlog      0.890
# 3       Spruce  Spruce Pulpwood      0.215
```

## Example 4: Add pricing matrix (APT file)

```python
from s4d_tools import PRDParser, APTParser
from s4d_tools import transform_prd_to_standardized, merge_apt_into_standardized

# Parse PRD
prd_data = PRDParser("s4d-tools-samples/sample.prd").parse()

# Parse APT (price instructions)
apt_data = APTParser("s4d-tools-samples/sample.apt").parse()

# Create report with pricing
report = transform_prd_to_standardized(prd_data)
report = merge_apt_into_standardized(report, apt_data)

# Access price matrix (one row per diameter × length cell)
print(report["price_matrix"].head(4))
#   species_name assortment_name  ...  diameter_lower_mm  length_lower_cm  relative_value
# 0         Pine     Pine Sawlog  ...                180              310              90
# 1         Pine     Pine Sawlog  ...                180              430              96
# 2         Pine     Pine Sawlog  ...                250              310              98
# 3         Pine     Pine Sawlog  ...                250              430             104
```

## Example 5: Process multiple harvest records

```python
from s4d_tools import HPRParser, transform_hpr_to_standardized
from s4d_tools import aggregate_stems_by_species
import os

results = []

for filename in os.listdir("s4d-tools-samples/"):
    if filename.endswith(".hpr"):
        # Parse each file
        parser = HPRParser(f"s4d-tools-samples/{filename}")
        raw = parser.parse()
        report = transform_hpr_to_standardized(raw)

        # Aggregate data
        stems = aggregate_stems_by_species(
            report["stems"],
            report["species_groups"]
        )

        results.append({
            "file": filename,
            "total_stems": stems["stem_count"].sum(),
            "species_count": len(stems),
            "details": stems
        })

# Summarize across all files
for result in results:
    print(f"{result['file']}: {result['total_stems']} stems")
# sample.hpr: 5 stems
```

## Installation options

```bash
# Just the library (for parsing/analyzing)
pip install s4d-tools

# With testing tools (for development)
pip install s4d-tools[dev]
```
