from pydantic import BaseModel
from typing import List, Optional

# Esquema base para Tipo
class TipoBase(BaseModel):
    descripcion: str

# Esquema que incluye el ID, para respuestas o actualizaciones
class Tipo(TipoBase):
    id_tipo: Optional[int] = None

    class Config:
        orm_mode = True

# Esquema de respuesta que devueleve un solo tipo
class TipoResponse(BaseModel):
    status: int
    tipo: Tipo

# Esquema de respuesta que devueleve todos los tipos
class TiposResponse(BaseModel):
    status: int
    tipos: List[Tipo]
