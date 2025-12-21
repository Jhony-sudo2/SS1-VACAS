from api.v1.errors.api_exception import ApiException
from api.v1.repositories.VentaRepo import MedicamentoRepo
from fastapi import status

class MedicamentoService():
    def __init__(self):
        self.repo = MedicamentoRepo()
        pass

    def saveMedicamento(self,db,data):
        return self.repo.save(db,data)
    
    def find_all(self,db):
        return self.repo.fin_all(db)
    
    def find_by_id(self,db,id:int):
        medicamento = self.repo.find_by_id(db,id)
        if not medicamento:
            raise ApiException("Area no encontrada", status.HTTP_404_NOT_FOUND)
        return medicamento
    
    def updateStock(self,db,id:int,cantidad:int):
        medicamento = self.find_by_id(db,id)
        if cantidad <= 0:
            raise ApiException("La cantidad no puede ser negativa",status.HTTP_406_NOT_ACCEPTABLE)
        medicamento.stock = medicamento.stock + cantidad
        self.repo.update(db,medicamento)
