# s4d-tools Usage Examples

After `pip install s4d-tools`, here's how to use the library:

## Example 1: Parse and analyze a single file

```python
from s4d_tools import HPRParser, transform_hpr_to_standardized
from s4d_tools import aggregate_stems_by_species

# Parse a StanForD 2010 HPR file
parser = HPRParser("harvest_data.hpr")
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
# 0        Pine          120
# 1       Spruce           85
```

## Example 2: Combine multiple files (PRD + PRI)

```python
from s4d_tools import PRDParser, PRIParser
from s4d_tools import transform_prd_to_standardized, merge_pri_into_standardized

# Parse PRD (production summary)
prd_data = PRDParser("production.prd").parse()

# Parse PRI (production details)
pri_data = PRIParser("production_individual.pri").parse()

# Create base report from PRD
report = transform_prd_to_standardized(prd_data)

# Enrich with PRI data (fills gaps, adds log details)
report = merge_pri_into_standardized(report, pri_data)

print(f"Report has_pri: {report['has_pri']}")  # True
print(f"Logs available: {len(report['logs'])}")
```

## Example 3: Analyze volume by species and product

```python
from s4d_tools import HPRParser, transform_hpr_to_standardized
from s4d_tools import aggregate_volume_by_species_and_product

# Parse and standardize
raw = HPRParser("harvest.hpr").parse()
report = transform_hpr_to_standardized(raw)

# Get volume breakdown by species × product
volumes, species_order = aggregate_volume_by_species_and_product(
    report["logs"],
    report["stems"],
    report["species_groups"],
    report["products"]
)

print(volumes)
#   species_name product_name  volume_m3
# 0        Pine      Sawlog      125.50
# 1        Pine        Pulp       45.30
# 2       Spruce      Sawlog       89.20
# 3       Spruce        Pulp       32.10
```

## Example 4: Add pricing matrix (APT file)

```python
from s4d_tools import PRDParser, APTParser
from s4d_tools import transform_prd_to_standardized, merge_apt_into_standardized

# Parse PRD
prd_data = PRDParser("production.prd").parse()

# Parse APT (price instructions)
apt_data = APTParser("prices.apt").parse()

# Create report with pricing
report = transform_prd_to_standardized(prd_data)
report = merge_apt_into_standardized(report, apt_data)

# Access price matrix
print(report["price_matrix"])
#   species_name assortment_name diameter_lower_mm ... relative_value
# 0        Pine      Sawlog               80            ...           100
# 1        Pine      Sawlog              120            ...            95
```

## Example 5: Process multiple harvest records

```python
from s4d_tools import HPRParser, transform_hpr_to_standardized
from s4d_tools import aggregate_stems_by_species
import os

results = []

for filename in os.listdir("harvests/"):
    if filename.endswith(".hpr"):
        # Parse each file
        parser = HPRParser(f"harvests/{filename}")
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
```

## Example 6: Export to other formats

```python
from s4d_tools import HPRParser, transform_hpr_to_standardized
import pandas as pd

# Parse and standardize
raw = HPRParser("harvest.hpr").parse()
report = transform_hpr_to_standardized(raw)

# Export to CSV
report["stems"].to_csv("stems.csv", index=False)
report["logs"].to_csv("logs.csv", index=False)
report["species_table"].to_csv("species_summary.csv", index=False)

# Export to Excel
with pd.ExcelWriter("harvest_report.xlsx") as writer:
    report["stems"].to_excel(writer, sheet_name="Stems")
    report["logs"].to_excel(writer, sheet_name="Logs")
    report["species_table"].to_excel(writer, sheet_name="Species Summary")
```

## Installation options

```bash
# Just the library (for parsing/analyzing)
pip install s4d-tools

# With testing tools (for development)
pip install s4d-tools[dev]
```

## Common workflows

### Workflow 1: Data extraction
Parse → Standardize → Export to CSV/Excel → Use in other tools

### Workflow 2: Analysis
Parse → Standardize → Aggregate → Calculate statistics → Report

### Workflow 3: Integration
Parse → Standardize → Load into database/data warehouse → BI tools

### Workflow 4: Validation
Parse → Check schema → Validate data quality → Generate report