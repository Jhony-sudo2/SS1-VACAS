from __future__ import annotations

from pydantic import BaseModel, ConfigDict


def to_camel(s: str) -> str:
    parts = s.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])


class CamelModel(BaseModel):
    # Pydantic v2 config
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
