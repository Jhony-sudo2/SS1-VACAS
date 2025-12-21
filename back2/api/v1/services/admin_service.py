from api.v1.repositories.AreaRepo import AreaRepo
from sqlalchemy.orm import Session

class AdminService:
    def __init__(self):
        self.repo = AreaRepo()

    def saveArea(self,db:Session,data):
        self.repo.save(db,data)

    