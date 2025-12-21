from pydantic import BaseModel

class AreaSchema(BaseModel):
    nombre: str

class AsignarArea(BaseModel):
    idEmpleado:int
    areas:list[int]