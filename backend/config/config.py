from sqlalchemy import create_engine   #Motor de conexión
from sqlalchemy.ext.declarative import declarative_base    #Para heredar la clase Base
from sqlalchemy.orm import sessionmaker    #Para establecer la sesión de creación

cadena_conexion = "mysql+pymysql://root:@localhost:3306/historial_medico"
'''
    Primer parámetro: Tipo de conexión y conector
    Segundo parámetro: Nombre de usuario BD
    Tercer parámetro: Contraseña de usuario
    Luego de la arroba: Servidor BD y puerto, nombre de BD
'''

motor = create_engine(cadena_conexion, echo=True)
#Se crea la conexión con la cadena; echo se coloca a True para que las sentencias SQL aparezcan en la consola (no es necesario)

sesionLocal = sessionmaker(autocommit=False, autoflush=False, bind=motor)
#Se crea la sesión que va a efectuar las operaciones sobre la BD, a través de la conexión creada por engine

Base = declarative_base()   #Se crea la clase Base para mapear la BD

#Esta función va a permitir el enlace entre el modelo de BD y las rutas, a través de una relación de dependencia
def get_db():
    db = sesionLocal()
    try:
        yield db
    finally:
        db.close()