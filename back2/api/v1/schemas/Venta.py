from pydantic import BaseModel

class MedicamentoCreate(BaseModel):
    nombre:str
    precio:int    
    minimo:int
    stock:int
    tipo:int
    imagen:str

class updateStock(BaseModel):
    id: int
    cantidad:int