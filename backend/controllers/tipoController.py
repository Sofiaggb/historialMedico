from sqlalchemy.orm import Session
from models.models import Tipo
from schemas.tipoShema import TipoBase

def obtener_tipos(db: Session):
    return db.query(Tipo).all()

def obtener_tipo(id_tipo: int, db: Session):
    return db.query(Tipo).filter(Tipo.id_tipo == id_tipo).first()

def crear_tipo(tipo_data: TipoBase, db: Session):
    nuevo_tipo = Tipo(descripcion=tipo_data.descripcion)
    db.add(nuevo_tipo)
    db.commit()
    db.refresh(nuevo_tipo)
    return nuevo_tipo

def actualizar_tipo(id_tipo: int, tipo_data: TipoBase, db: Session):
    tipo = db.query(Tipo).filter(Tipo.id_tipo == id_tipo).first()
    if not tipo:
        return None
    tipo.descripcion = tipo_data.descripcion
    db.commit()
    db.refresh(tipo)
    return tipo


def eliminar_tipo(id_tipo: int, db: Session):
    tipo = db.query(Tipo).filter(Tipo.id_tipo == id_tipo).first()
    if tipo:
        db.delete(tipo)
        db.commit()
    return tipo
