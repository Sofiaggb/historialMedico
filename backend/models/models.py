from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from config.config import Base

# Definición de la clase Diagnostico que hereda de Base
class Diagnostico(Base):
    __tablename__ = 'diagnostico'  # Nombre de la tabla en la base de datos
    id = Column(Integer, primary_key=True, autoincrement=True)  # Columna 'id' como clave primaria con autoincremento
    descripcion = Column(String(60), nullable=False)  # Columna 'descripcion' de tipo String con longitud máxima de 60 caracteres, no puede ser nula
    # Relación con la tabla Paciente
    paciente = relationship('Paciente', back_populates='diagnostico')  # Relación uno a muchos con la tabla Paciente, usando 'diagnostico' como back_populates

# Definición de la clase Paciente que hereda de Base
class Paciente(Base):
    __tablename__ = 'paciente'  # Nombre de la tabla en la base de datos
    id = Column(Integer, primary_key=True, autoincrement=True)  # Columna 'id' como clave primaria con autoincremento
    nombre = Column(String(50), nullable=False)  # Columna 'nombre' de tipo String con longitud máxima de 50 caracteres, no puede ser nula
    sexo = Column(String(9), nullable=False)  # Columna 'sexo' de tipo String con longitud máxima de 9 caracteres, no puede ser nula
    fecha_ingreso = Column(Date, nullable=False)  # Columna 'fecha_ingreso' de tipo Date, no puede ser nula
    peso = Column(Float, nullable=False)  # Columna 'peso' de tipo Float, no puede ser nula
    id_diagnostico = Column(Integer, ForeignKey('diagnostico.id'), nullable=False)  # Columna 'id_diagnostico' como clave foránea que referencia a 'id' en la tabla Diagnostico, no puede ser nula
    # Relación con la tabla Diagnostico
    diagnostico = relationship('Diagnostico', back_populates='paciente')  # Relación muchos a uno con la tabla Diagnostico, usando 'paciente' como back_populates
