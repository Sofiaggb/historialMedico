from pydantic import BaseModel
from typing import List, Optional

class Contacto(BaseModel):
    codigo: Optional[int] = None
    nombre: str
    telefono: str
    correo: str

class ContactoResponse(BaseModel):
    status: int
    contacto: Contacto

class ContactosResponse(BaseModel):
    status: int
    contactos: List[Contacto]

class ContactoPut(BaseModel):
    nombre: str
    telefono: str
    correo: str