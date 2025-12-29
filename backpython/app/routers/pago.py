from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/pago", tags=["pago"])

@router.api_route("", methods=["GET","POST","PUT","DELETE","PATCH"])
def not_implemented_root():
    raise HTTPException(status_code=501, detail="No implementado aún en el clon FastAPI")

@router.api_route("/{path:path}", methods=["GET","POST","PUT","DELETE","PATCH"])
def not_implemented(path: str):
    raise HTTPException(status_code=501, detail="No implementado aún en el clon FastAPI")
