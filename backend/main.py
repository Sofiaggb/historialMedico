from fastapi_offline import FastAPIOffline
from config.config import motor
from models import models
from routes.routesTipo import tipos
from routes.routesFarmaco import farmacos


#Ejecutar la creación del modelo en la BD
models.Base.metadata.create_all(bind=motor)

app = FastAPIOffline(
    title = 'Proyecto para administrar farmacos',
    description = 'Acreditable II',
    version = '1.0')

@app.get('/')
def index():
    return {'mensaje': 'FastAPI funcionando'}

# Incluye el router de farmacos y tipos en la aplicación principal
app.include_router(tipos)
app.include_router(farmacos)