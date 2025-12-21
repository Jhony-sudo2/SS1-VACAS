from pydantic import BaseModel

class ConfirmarCorreoRequest(BaseModel):
    codigo: str

class UpdateEstado(BaseModel):
    id: int