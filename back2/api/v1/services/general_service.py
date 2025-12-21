from sqlalchemy.orm import Session
from api.v1.repositories.AreaRepo import AreaRepo

class GeneralService:
    def __init__(self):
        self.repo = AreaRepo()
    
    def get_all_areas(self,db:Session):
        return self.repo.get_all_areas(db)