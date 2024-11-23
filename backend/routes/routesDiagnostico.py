from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.config import get_db
from models.models import Diagnostico
from schemas.diagnosticoShema import DiagnosticoBase, DiagnosticoResponse, DiagnosticosResponse

# Crear un enrutador para el módulo de diagnósticos
diagnosticos = APIRouter()

# Controlador: Obtener todos los diagnósticos
@diagnosticos.get('/diagnosticos', response_model=DiagnosticosResponse, status_code=status.HTTP_200_OK)
def get_diagnosticos(db: Session = Depends(get_db)):
    """
    Endpoint para obtener todos los diagnósticos.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Lista de diagnósticos.
    """
    lista_diagnosticos = db.query(Diagnostico).all()
    if not lista_diagnosticos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No hay diagnósticos registrados')
    return {
        'status': status.HTTP_200_OK,
        'diagnosticos': lista_diagnosticos
    }

# Controlador: Obtener un diagnóstico por ID
@diagnosticos.get('/diagnosticos/{id_diagnostico}', response_model=DiagnosticoResponse, status_code=status.HTTP_200_OK)
def get_diagnostico(id_diagnostico: int, db: Session = Depends(get_db)):
    """
    Endpoint para obtener un diagnóstico específico por su ID.
    :param id_diagnostico: ID del diagnóstico a buscar.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Diagnóstico encontrado.
    """
    diagnostico = db.query(Diagnostico).filter(Diagnostico.id == id_diagnostico).first()
    if not diagnostico:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Diagnóstico no encontrado')
    return {
        'status': status.HTTP_200_OK,
        'diagnostico': diagnostico
    }

# Controlador: Crear un diagnóstico
@diagnosticos.post('/diagnosticos', response_model=DiagnosticoResponse, status_code=status.HTTP_201_CREATED)
def create_diagnostico(diagnostico_data: DiagnosticoBase, db: Session = Depends(get_db)):
    """
    Endpoint para crear un nuevo diagnóstico.
    :param diagnostico_data: Datos del diagnóstico a crear (schema `DiagnosticoBase`).
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Diagnóstico creado.
    """
    nuevo_diagnostico = Diagnostico(descripcion=diagnostico_data.descripcion)
    db.add(nuevo_diagnostico)
    db.commit()
    db.refresh(nuevo_diagnostico)
    return {
        'status': status.HTTP_201_CREATED,
        'diagnostico': nuevo_diagnostico
    }

# Controlador: Actualizar un diagnóstico existente
@diagnosticos.put('/diagnosticos/{id_diagnostico}', response_model=DiagnosticoResponse, status_code=status.HTTP_200_OK)
def update_diagnostico(id_diagnostico: int, diagnostico_data: DiagnosticoBase, db: Session = Depends(get_db)):
    """
    Endpoint para actualizar un diagnóstico existente.
    :param id_diagnostico: ID del diagnóstico a actualizar.
    :param diagnostico_data: Nuevos datos para el diagnóstico.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Diagnóstico actualizado.
    """
    diagnostico = db.query(Diagnostico).filter(Diagnostico.id == id_diagnostico).first()
    if not diagnostico:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Diagnóstico no encontrado')
    diagnostico.descripcion = diagnostico_data.descripcion
    db.commit()
    db.refresh(diagnostico)
    return {
        'status': status.HTTP_200_OK,
        'diagnostico': diagnostico
    }

# Controlador: Eliminar un diagnóstico
@diagnosticos.delete('/diagnosticos/{id_diagnostico}', status_code=status.HTTP_204_NO_CONTENT)
def delete_diagnostico(id_diagnostico: int, db: Session = Depends(get_db)):
    """
    Endpoint para eliminar un diagnóstico por su ID.
    :param id_diagnostico: ID del diagnóstico a eliminar.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Código de estado HTTP 204 si la operación fue exitosa.
    """
    diagnostico = db.query(Diagnostico).filter(Diagnostico.id == id_diagnostico).first()
    if not diagnostico:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Diagnóstico no encontrado')
    db.delete(diagnostico)
    db.commit()
    return {'status': status.HTTP_204_NO_CONTENT}
