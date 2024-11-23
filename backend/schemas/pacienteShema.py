from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# Esquema base para Paciente
class PacienteBase(BaseModel):
    nombre: str
    sexo: str
    fecha_ingreso: date
    peso: float
    id_diagnostico: int

# Esquema que incluye el ID, para respuestas o actualizaciones
class Paciente(PacienteBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True

# Esquema de respuesta que debuel un Paciente
class PacienteResponse(BaseModel):
    status: int
    paciente: Paciente

# Esquema de respuesta que debuel Pacientes
class PacientesResponse(BaseModel):
    status: int
    pacientes: List[Paciente]
