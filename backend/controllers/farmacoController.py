from sqlalchemy.orm import Session
from models.models import Farmaco
from schemas.farmacoShema import FarmacoBase

def obtener_farmacos(db: Session):
    return db.query(Farmaco).all()

def obtener_farmaco(id: int, db: Session):
    return db.query(Farmaco).filter(Farmaco.id == id).first()

def crear_farmaco(farmaco_data: FarmacoBase, db: Session):
    nuevo_farmaco = Farmaco(
        nombre_comercial=farmaco_data.nombre_comercial,
        fecha_elaboracion=farmaco_data.fecha_elaboracion,
        principio_activo=farmaco_data.principio_activo,
        miligramos=farmaco_data.miligramos,
        id_tipo=farmaco_data.id_tipo
    )
    db.add(nuevo_farmaco)
    db.commit()
    db.refresh(nuevo_farmaco)
    return nuevo_farmaco

def actualizar_farmaco(id: int, farmaco_data: FarmacoBase, db: Session):
    farmaco = db.query(Farmaco).filter(Farmaco.id == id).first()
    if not farmaco:
        return None
    farmaco.nombre_comercial = farmaco_data.nombre_comercial
    farmaco.fecha_elaboracion = farmaco_data.fecha_elaboracion
    farmaco.principio_activo = farmaco_data.principio_activo
    farmaco.miligramos = farmaco_data.miligramos
    farmaco.id_tipo = farmaco_data.id_tipo
    db.commit()
    db.refresh(farmaco)
    return farmaco


def eliminar_farmaco(id: int, db: Session):
    farmaco = db.query(Farmaco).filter(Farmaco.id == id).first()
    if farmaco:
        db.delete(farmaco)
        db.commit()
    return farmaco
