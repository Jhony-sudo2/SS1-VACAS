from fastapi import APIRouter

router = APIRouter()

@router.get("/healt")
def healt():
    return{"HOLA MUNDO"}