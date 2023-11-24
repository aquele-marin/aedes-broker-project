from fastapi import FastAPI

from .air_conditioning import AirConditioning

app = FastAPI()

@app.post('/temperature')
def set_new_temperature(new_temperature: int):
    ...