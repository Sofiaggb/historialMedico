from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models.models import Paciente
from schemas.pacienteShema import PacienteBase, PacienteResponse, PacientesResponse
from config.config import get_db

# Crear un enrutador para la gestión de pacientes
pacientes = APIRouter()

# Controlador: Obtener todos los pacientes
@pacientes.get('/pacientes', response_model=PacientesResponse, status_code=status.HTTP_200_OK)
def get_pacientes(db: Session = Depends(get_db)):
    """
    Endpoint para obtener todos los pacientes registrados.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Lista de pacientes.
    """
    lista_pacientes = db.query(Paciente).all()
    if not lista_pacientes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No hay pacientes registrados')
    return {
        'status': status.HTTP_200_OK,
        'pacientes': lista_pacientes
    }

# Controlador: Obtener un paciente por ID
@pacientes.get('/pacientes/{id}', response_model=PacienteResponse, status_code=status.HTTP_200_OK)
def get_paciente(id: int, db: Session = Depends(get_db)):
    """
    Endpoint para obtener un paciente específico por su ID.
    :param id: ID del paciente a buscar.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Paciente encontrado.
    """
    paciente = db.query(Paciente).filter(Paciente.id == id).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Paciente no encontrado')
    return {
        'status': status.HTTP_200_OK,
        'paciente': paciente
    }

# Controlador: Crear un nuevo paciente
@pacientes.post('/save-pacientes', response_model=PacienteResponse, status_code=status.HTTP_201_CREATED)
def create_paciente(paciente_data: PacienteBase, db: Session = Depends(get_db)):
    """
    Endpoint para crear un nuevo paciente.
    :param paciente_data: Datos del paciente a crear (schema `PacienteBase`).
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Paciente creado.
    """
    nuevo_paciente = Paciente(
        nombre=paciente_data.nombre,
        sexo=paciente_data.sexo,
        fecha_ingreso=paciente_data.fecha_ingreso,
        peso=paciente_data.peso,
        id_diagnostico=paciente_data.id_diagnostico
    )
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)
    return {
        'status': status.HTTP_201_CREATED,
        'paciente': nuevo_paciente
    }

# Controlador: Actualizar un paciente existente
@pacientes.put('/update-pacientes/{id}', response_model=PacienteResponse, status_code=status.HTTP_200_OK)
def update_paciente(id: int, paciente_data: PacienteBase, db: Session = Depends(get_db)):
    """
    Endpoint para actualizar un paciente existente.
    :param id: ID del paciente a actualizar.
    :param paciente_data: Nuevos datos para el paciente.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Paciente actualizado.
    """
    paciente = db.query(Paciente).filter(Paciente.id == id).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Paciente no encontrado')
    paciente.nombre = paciente_data.nombre
    paciente.sexo = paciente_data.sexo
    paciente.fecha_ingreso = paciente_data.fecha_ingreso
    paciente.peso = paciente_data.peso
    paciente.id_diagnostico = paciente_data.id_diagnostico
    db.commit()
    db.refresh(paciente)
    return {
        'status': status.HTTP_200_OK,
        'paciente': paciente
    }

# Controlador: Eliminar un paciente
@pacientes.delete('/pacientes/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_paciente(id: int, db: Session = Depends(get_db)):
    """
    Endpoint para eliminar un paciente por su ID.
    :param id: ID del paciente a eliminar.
    :param db: Sesión de base de datos proporcionada por Depends.
    :return: Código de estado HTTP 204 si la operación fue exitosa.
    """
    paciente = db.query(Paciente).filter(Paciente.id == id).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Paciente no encontrado')
    db.delete(paciente)
    db.commit()
    return {'status': status.HTTP_204_NO_CONTENT}
