from __future__ import annotations

from pydantic import BaseModel, ConfigDict
import re
from sqlalchemy.inspection import inspect

def to_camel(s: str) -> str:
    parts = s.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])
_camel_1 = re.compile(r"(.)([A-Z][a-z]+)")
_camel_2 = re.compile(r"([a-z0-9])([A-Z])")

def to_snake(name: str) -> str:
    s1 = _camel_1.sub(r"\1_\2", name)
    return _camel_2.sub(r"\1_\2", s1).lower()

def filter_model_kwargs(model_cls, data: dict) -> dict:
    mapper = inspect(model_cls)
    valid_cols = {c.key for c in mapper.columns}  # SOLO columnas
    out = {}
    for k, v in (data or {}).items():
        if isinstance(v, (dict, list)):  # ignora historia/paciente anidados
            continue
        sk = to_snake(k)
        if sk in valid_cols:
            out[sk] = v
        elif k in valid_cols:
            out[k] = v
    return out

class CamelModel(BaseModel):
    # Pydantic v2 config
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        extra="ignore",
    )
