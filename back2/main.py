import api.v1.models
from fastapi import FastAPI
from api.v1.routes import EmpleadoController, Healt, User,Auth,AdminController,General,Medicamento
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My API", version="1.0.0")

origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],        
)

app.include_router(Healt.router, prefix="/api", tags=["health"])
app.include_router(User.router, prefix="/api", tags=["user"])
app.include_router(Auth.router, prefix="/api", tags=["auth"])
app.include_router(EmpleadoController.router, prefix="/api", tags=["empleado"])
app.include_router(AdminController.router, prefix="/api", tags=["admin"])
app.include_router(General.router, prefix="/api", tags=["general"])
app.include_router(Medicamento.router, prefix="/api", tags=["medicamento"])