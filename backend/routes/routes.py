from config.config import sesionLocal
from models.models import Agenda
from sqlalchemy.orm import Session
from fastapi import status, HTTPException, APIRouter, Depends
from schemas.schemas import *

contactos = APIRouter()

#Esta función va a permitir el enlace entre el modelo de BD y las rutas, a través de una relación de dependencia
def get_db():
    db = sesionLocal()
    try:
        yield db
    finally:
        db.close()

@contactos.get('/contactos', response_model=ContactosResponse, status_code=status.HTTP_200_OK)
def get_contactos(db: Session=Depends(get_db)):
    lista_contactos = db.query(Agenda).all()
    if lista_contactos is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No hay contactos')
    return {
        'contactos': lista_contactos,
        'status': status.HTTP_200_OK
    }

@contactos.get('/contactos/{codigo}', response_model=ContactoResponse, status_code=status.HTTP_200_OK)
def get_contacto(codigo: int, db: Session=Depends(get_db)):
    contacto = db.query(Agenda).filter(Agenda.codigo==codigo).first()
    if contacto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= 'Contacto no encontrado')
    return {
        'status': status.HTTP_200_OK,
        'contacto': contacto
    }

@contactos.post('/contactos', response_model=ContactoResponse, status_code=status.HTTP_201_CREATED)
def create_contacto(contacto: Contacto, db: Session=Depends(get_db)):
    contacto_data = Agenda(nombre=contacto.nombre, telefono=contacto.telefono, correo=contacto.correo)
    db.add(contacto_data)
    db.commit()
    db.refresh(contacto_data)
    return {
        'status': status.HTTP_201_CREATED,
        'contacto': contacto_data
    }

@contactos.put('/contactos', response_model=ContactoResponse, status_code=status.HTTP_200_OK)
def update_contacto(codigo: int, contacto_data: ContactoPut, db: Session = Depends(get_db)):
    contacto = db.query(Agenda).filter(Agenda.codigo==codigo).first()
    if contacto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= 'Contacto no encontrado')
    contacto.nombre = contacto_data.nombre
    contacto.telefono = contacto_data.telefono
    contacto.correo = contacto_data.correo
    db.commit()
    db.refresh(contacto)
    return {
        'status': status.HTTP_200_OK,
        'contacto': contacto
    }

@contactos.delete('/contactos/{codigo}', status_code=status.HTTP_204_NO_CONTENT)
def delete_contacto(codigo: int, db: Session = Depends(get_db)):
    contacto = db.query(Agenda).filter(Agenda.codigo==codigo).first()
    if contacto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= 'Contacto no encontrado')
    db.query(Agenda).filter(Agenda.codigo==codigo).delete()
    db.commit()
    return {
        'status': status.HTTP_204_NO_CONTENT
    }