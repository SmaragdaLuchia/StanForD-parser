from __future__ import annotations

from typing import Any, Dict, List, Union

import pandas as pd


def pivot_relative_value_matrix(
    longform: pd.DataFrame,
) -> pd.DataFrame:

    if longform.empty:
        return pd.DataFrame()
    dedup_cols: List[str] = []
    if "diameter_lower_mm" in longform.columns:
        dedup_cols.append("diameter_lower_mm")
    dedup_cols.append("diameter_limit_mm")
    if "length_lower_cm" in longform.columns:
        dedup_cols.append("length_lower_cm")
    dedup_cols.append("length_limit_cm")
    sub = longform.drop_duplicates(subset=dedup_cols, keep="first")
    return sub.pivot_table(
        index="diameter_limit_mm",
        columns="length_limit_cm",
        values="relative_value",
        aggfunc="first",
    )


def price_matrix_heatmaps_by_assortment(
    longform: pd.DataFrame,
) -> List[Dict[str, Union[str, int, pd.DataFrame]]]:
    out: List[Dict[str, Union[str, int, pd.DataFrame]]] = []
    if longform.empty:
        return out
    keys = longform.groupby(["species_name", "assortment_name"], sort=False)
    for (species, assortment), g in keys:
        bitmask = int(g["allowed_grades_bitmask"].iloc[0])
        matrix = pivot_relative_value_matrix(g)
        out.append(
            {
                "species_name": species,
                "assortment_name": assortment,
                "allowed_grades_bitmask": bitmask,
                "relative_value_matrix": matrix,
            }
        )
    return out


__all__ = [
    "pivot_relative_value_matrix",
    "price_matrix_heatmaps_by_assortment",
]
