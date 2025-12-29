from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, user, medicamento, empleado, paciente, cita, historia, empresa, admin, general, compra, reportes

app = FastAPI(
    title="ss1 PYTHON",
    openapi_url=f"{settings.app_context_path}/v3/api-docs",
    docs_url=f"{settings.app_context_path}/doc/swagger-vi.html",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers (keep same paths as Spring under /api)
app.include_router(auth.router, prefix=settings.app_context_path)
app.include_router(user.router, prefix=settings.app_context_path)
app.include_router(medicamento.router, prefix=settings.app_context_path)
app.include_router(empleado.router, prefix=settings.app_context_path)
app.include_router(paciente.router, prefix=settings.app_context_path)
app.include_router(cita.router, prefix=settings.app_context_path)
app.include_router(historia.router, prefix=settings.app_context_path)
app.include_router(empresa.router, prefix=settings.app_context_path)
app.include_router(admin.router, prefix=settings.app_context_path)
app.include_router(general.router, prefix=settings.app_context_path)
app.include_router(compra.router, prefix=settings.app_context_path)
app.include_router(reportes.router, prefix=settings.app_context_path)

@app.get(f"{settings.app_context_path}/health")
def health():
    return {"status":"ok"}
