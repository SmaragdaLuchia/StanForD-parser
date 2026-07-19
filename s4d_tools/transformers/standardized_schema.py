from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd

STANDARDIZED_HEADER_COLUMNS = [
    "creation_date",
    "modification_date",
    "application_version_created",
    "application_version_modified",
    "country_code",
]

STANDARDIZED_MACHINE_COLUMNS = [
    "machine_base_manufacturer",
    "machine_base_model",
]

STANDARDIZED_OBJECTS_COLUMNS = [
    "object_name",
    "contract_number",
    "start_date",
    "end_date",
]

STANDARDIZED_SPECIES_GROUPS_COLUMNS = [
    "species_group_key",
    "species_group_name",
]

STANDARDIZED_PRODUCTS_COLUMNS = [
    "product_key",
    "product_name",
]

STANDARDIZED_STATISTICS_COLUMNS = [
    "total_stems",
    "species_names",
    "stems_per_species",
    "volume_per_species",
]

STANDARDIZED_SPECIES_TABLE_COLUMNS = [
    "species_name",
    "stems",
    "volume_m3",
]

STANDARDIZED_SPECIES_PRODUCT_VOLUME_COLUMNS = [
    "species_name",
    "product_name",
    "volume_m3",
]

STANDARDIZED_STEMS_COLUMNS = [
    "stem_key",
    "object_key",
    "sub_object_key",
    "species_group_key",
    "harvest_date",
    "stem_number",
]

STANDARDIZED_LOGS_COLUMNS = [
    "stem_key",
    "log_key",
    "product_key",
    "volume_sob_m3",
    "volume_sub_m3",
    "length_cm",
    "diameter_top_ob",
    "diameter_mid_ob",
    "diameter_butt_ob",
]

STANDARDIZED_PRICE_MATRIX_COLUMNS = [
    "species_name",
    "assortment_name",
    "allowed_grades_bitmask",
    "diameter_lower_mm",
    "diameter_limit_mm",
    "length_lower_cm",
    "length_limit_cm",
    "relative_value",
]

StandardizedReport = Dict[str, pd.DataFrame]

META_SOURCE_TYPE = "source_type"
META_HAS_PRI = "has_pri"

SOURCE_TYPE_CLASSIC_PRD = "stanford_classic_prd"
SOURCE_TYPE_CLASSIC_APT = "stanford_classic_apt"
SOURCE_TYPE_2010_HPR = "stanford_2010_hpr"
SOURCE_TYPE_2010_PIN = "stanford_2010_pin"

SOURCE_TYPES = (
    SOURCE_TYPE_CLASSIC_PRD,
    SOURCE_TYPE_CLASSIC_APT,
    SOURCE_TYPE_2010_HPR,
    SOURCE_TYPE_2010_PIN,
)


def empty_standardized_table(columns: List[str]) -> pd.DataFrame:
    return pd.DataFrame(columns=columns)


def empty_standardized_report(source_type: str, has_pri: bool = False) -> Dict[str, Any]:
    if source_type not in SOURCE_TYPES:
        raise ValueError(
            f"Unknown source_type {source_type!r}; expected one of {SOURCE_TYPES}"
        )
    return {
        "header": empty_standardized_table(STANDARDIZED_HEADER_COLUMNS),
        "machine": empty_standardized_table(STANDARDIZED_MACHINE_COLUMNS),
        "objects": empty_standardized_table(STANDARDIZED_OBJECTS_COLUMNS),
        "species_groups": empty_standardized_table(STANDARDIZED_SPECIES_GROUPS_COLUMNS),
        "products": empty_standardized_table(STANDARDIZED_PRODUCTS_COLUMNS),
        "statistics": empty_standardized_table(STANDARDIZED_STATISTICS_COLUMNS),
        "species_table": empty_standardized_table(STANDARDIZED_SPECIES_TABLE_COLUMNS),
        "species_product_volume": empty_standardized_table(
            STANDARDIZED_SPECIES_PRODUCT_VOLUME_COLUMNS
        ),
        "stems": empty_standardized_table(STANDARDIZED_STEMS_COLUMNS),
        "logs": empty_standardized_table(STANDARDIZED_LOGS_COLUMNS),
        "price_matrix": empty_standardized_table(STANDARDIZED_PRICE_MATRIX_COLUMNS),
        META_SOURCE_TYPE: source_type,
        META_HAS_PRI: has_pri,
    }