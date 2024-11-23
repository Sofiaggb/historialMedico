from pydantic import BaseModel
from typing import List, Optional

# Esquema base para Diagnostico
class DiagnosticoBase(BaseModel):
    descripcion: str

# Esquema que incluye el ID, para respuestas o actualizaciones
class Diagnostico(DiagnosticoBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True

# Esquema de respuesta que devueleve un solo Diagnostico
class DiagnosticoResponse(BaseModel):
    status: int
    diagnostico: Diagnostico

# Esquema de respuesta que devueleve todos los Diagnosticos
class DiagnosticosResponse(BaseModel):
    status: int
    diagnosticos: List[Diagnostico]
