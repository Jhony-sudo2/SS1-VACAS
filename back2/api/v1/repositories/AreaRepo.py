from sqlalchemy.orm import Session
from api.v1.models.Area import Area
from api.v1.schemas.Area import AreaSchema
from api.v1.models.AsignacionArea import AsignacionArea


class AreaRepo:
    def save(self, db: Session, obj: AreaSchema):
        area = Area()
        area.nombre = obj.nombre
        db.add(area)
        db.commit()
        db.refresh(area)
        return area
    
    def get_all_areas(self,db:Session):
        return db.query(Area).all()

class AsignacionAreaRepo:

    def save(self,db:Session,obj:AsignacionArea):
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
