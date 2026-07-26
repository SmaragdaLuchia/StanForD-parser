"""
Shared XML helpers for Stanford 2010 parsers.
"""

from __future__ import annotations

from typing import Dict, Optional
from xml.etree.ElementTree import Element

from ..constants import STANFORD_2010_NS

def get_text(
    node: Optional[Element],
    tag: str,
    ns: Optional[Dict[str, str]] = None,
) -> str:
    if node is None:
        return ""
    found = node.find(tag, ns or STANFORD_2010_NS)
    return found.text if found is not None and found.text is not None else ""


def get_attrib(
    node: Optional[Element],
    tag: str,
    attr: str,
    ns: Optional[Dict[str, str]] = None,
) -> str:
    """Get attribute value from an element, safely handling None cases."""
    if node is None:
        return ""
    found = node.find(tag, ns or STANFORD_2010_NS)
    return found.attrib.get(attr, "") if found is not None else ""


__all__ = ["get_text", "get_attrib"]
