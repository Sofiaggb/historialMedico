from fastapi_offline import FastAPIOffline
from config.config import motor
from models import models
from routes.routes import contactos

#Ejecutar la creación del modelo en la BD
models.Base.metadata.create_all(bind=motor)

app = FastAPIOffline(
    title = 'Proyecto para administrar contactos',
    description = 'Acreditable II',
    version = '1.0')

@app.get('/')
def index():
    return {'mensaje': 'FastAPI funcionando'}

app.include_router(contactos)