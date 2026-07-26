from typing import Optional, Union


def safe_int(value: Optional[str], default: Union[int, None] = None) -> Union[int, None]:
    if value is None or str(value).strip() == "":
        return default
    try:
        return int(float(str(value).strip()))
    except ValueError:
        return default
