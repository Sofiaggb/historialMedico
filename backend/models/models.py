from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from config.config import Base

class Agenda(Base):
    __tablename__ = 'contactos'
    codigo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(70), nullable=False)
    telefono = Column(String(20), nullable=False)
    correo = Column(String(100), nullable=False)

class Tipo(Base):
     __tablename__ = 'tipo' 
     id_tipo = Column(Integer, primary_key=True, autoincrement=True) 
     descripcion = Column(String(30), nullable=False) 
     # Relación con Fármaco 
     farmacos = relationship('Farmaco', back_populates='tipo') 
     
class Farmaco(Base):
    __tablename__ = 'farmaco' 
    id = Column(Integer, primary_key=True, autoincrement=True) 
    nombre_comercial = Column(String(50), nullable=False) 
    fecha_elaboracion = Column(Date, nullable=False) 
    principio_activo = Column(String(30), nullable=False) 
    miligramos = Column(Float, nullable=False) 
    id_tipo = Column(Integer, ForeignKey('tipo.id_tipo'), nullable=False) 
    # Relación con Tipo 
    tipo = relationship('Tipo', back_populates='farmacos')
