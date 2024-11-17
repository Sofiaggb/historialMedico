from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.config import get_db

from controllers.tipoController import obtener_tipos, obtener_tipo, crear_tipo, actualizar_tipo, eliminar_tipo
from schemas.tipoShema import TipoBase, TipoResponse, TiposResponse

tipos = APIRouter()

@tipos.get('/tipos', response_model=TiposResponse, status_code=status.HTTP_200_OK)
def get_tipos(db: Session = Depends(get_db)):
    lista_tipos = obtener_tipos(db)
    if not lista_tipos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No hay tipos registrados')
    return {
        'status': status.HTTP_200_OK,
        'tipos': lista_tipos
    }

@tipos.get('/tipos/{id_tipo}', response_model=TipoResponse, status_code=status.HTTP_200_OK)
def get_tipo(id_tipo: int, db: Session = Depends(get_db)):
    tipo = obtener_tipo(id_tipo, db)
    if not tipo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tipo no encontrado')
    return {
        'status': status.HTTP_200_OK,
        'tipo': tipo
    }

@tipos.post('/tipos', response_model=TipoResponse, status_code=status.HTTP_201_CREATED)
def create_tipo(tipo_data: TipoBase, db: Session = Depends(get_db)):
    nuevo_tipo = crear_tipo(tipo_data, db)
    return {
        'status': status.HTTP_201_CREATED,
        'tipo': nuevo_tipo
    }

@tipos.put('/tipos/{id_tipo}', response_model=TipoResponse, status_code=status.HTTP_200_OK)
def update_tipo(id_tipo: int, tipo_data: TipoBase, db: Session = Depends(get_db)):
    tipo_actualizado = actualizar_tipo(id_tipo, tipo_data, db)
    if not tipo_actualizado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tipo no encontrado')
    return {
        'status': status.HTTP_200_OK,
        'tipo': tipo_actualizado
    }


@tipos.delete('/tipos/{id_tipo}', status_code=status.HTTP_204_NO_CONTENT)
def delete_tipo(id_tipo: int, db: Session = Depends(get_db)):
    tipo_eliminado = eliminar_tipo(id_tipo, db)
    if not tipo_eliminado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Tipo no encontrado')
    return {'status': status.HTTP_204_NO_CONTENT}
