from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from controllers.farmacoController import obtener_farmacos, obtener_farmaco, crear_farmaco, actualizar_farmaco, eliminar_farmaco
from schemas.farmacoShema import FarmacoBase, FarmacoResponse, FarmacosResponse
from config.config import get_db


farmacos = APIRouter()

@farmacos.get('/farmacos', response_model=FarmacosResponse, status_code=status.HTTP_200_OK)
def get_farmacos(db: Session = Depends(get_db)):
    lista_farmacos = obtener_farmacos(db)
    if not lista_farmacos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No hay fármacos registrados')
    return {
        'status': status.HTTP_200_OK,
        'farmacos': lista_farmacos
    }

@farmacos.get('/farmacos/{id}', response_model=FarmacoResponse, status_code=status.HTTP_200_OK)
def get_farmaco(id: int, db: Session = Depends(get_db)):
    farmaco = obtener_farmaco(id, db)
    if not farmaco:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Fármaco no encontrado')
    return {
        'status': status.HTTP_200_OK,
        'farmaco': farmaco
    }

@farmacos.post('/farmacos', response_model=FarmacoResponse, status_code=status.HTTP_201_CREATED)
def create_farmaco(farmaco_data: FarmacoBase, db: Session = Depends(get_db)):
    nuevo_farmaco = crear_farmaco(farmaco_data, db)
    return {
        'status': status.HTTP_201_CREATED,
        'farmaco': nuevo_farmaco
    }

@farmacos.put('/farmacos/{id}', response_model=FarmacoResponse, status_code=status.HTTP_200_OK)
def update_farmaco(id: int, farmaco_data: FarmacoBase, db: Session = Depends(get_db)):
    farmaco_actualizado = actualizar_farmaco(id, farmaco_data, db)
    if not farmaco_actualizado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Fármaco no encontrado')
    return {
        'status': status.HTTP_200_OK,
        'farmaco': farmaco_actualizado
    }


@farmacos.delete('/farmacos/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_farmaco(id: int, db: Session = Depends(get_db)):
    farmaco_eliminado = eliminar_farmaco(id, db)
    if not farmaco_eliminado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Fármaco no encontrado')
    return {'status': status.HTTP_204_NO_CONTENT}
