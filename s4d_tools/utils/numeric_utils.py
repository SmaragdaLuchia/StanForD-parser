from typing import Optional, Union


def safe_int(value: Optional[str], default: Union[int, None] = None) -> Union[int, None]:
    if value is None or str(value).strip() == "":
        return default
    try:
        return int(float(str(value).strip()))
    except ValueError:
        return default


def safe_float(value: Optional[str], default: Union[float, None] = None) -> Union[float, None]:
    if value is None or str(value).strip() == "":
        return default
    try:
        return float(str(value).strip())
    except ValueError:
        return default
