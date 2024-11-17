from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# Esquema base para Farmaco
class FarmacoBase(BaseModel):
    nombre_comercial: str
    fecha_elaboracion: date
    principio_activo: str
    miligramos: float
    id_tipo: int

# Esquema que incluye el ID, para respuestas o actualizaciones
class Farmaco(FarmacoBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True

# Esquema de respuesta que debuel un farmaco
class FarmacoResponse(BaseModel):
    status: int
    farmaco: Farmaco

# Esquema de respuesta que debuel farmacos
class FarmacosResponse(BaseModel):
    status: int
    farmacos: List[Farmaco]
