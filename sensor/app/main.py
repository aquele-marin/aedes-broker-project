"""
Este arquivo serve como interface para o ar-condicionado.
Foi implelmentada uma interface em FastAPI. Por isso os controles
funcionam atraves do protocolo HTTP.
"""
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import os

from .air_conditioning import AirConditioning, DeviceIsNotTurnedOnException
from . import schemas

device = AirConditioning() # Instancia o ar condicionado


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Essa funcao se certifica que quando o programa for finalizado,
    as atrividades em backgroud tambem vao.
    """
    yield
    device.kill()


app = FastAPI(lifespan=lifespan)


@app.get('/')
async def home():
    return {'message': 'Hello World!'}


@app.get('/device/turnon', status_code=200, response_model=schemas.DeviceStatus)
async def turn_on_device():
    device.turn_on()
    return device


@app.get('/device/turnoff', status_code=200, response_model=schemas.DeviceStatus)
async def turn_off_device():
    device.turn_off()
    return device


@app.get('/device/temperature/increase', status_code=200, response_model=schemas.DeviceStatus)
async def increase_temperature(value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_temperature(device.temperature + value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device


@app.get('/device/temperature/decrease', status_code=200, response_model=schemas.DeviceStatus)
async def decrease_temperature(value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_temperature(device.temperature - value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device


@app.get('/device/intensity/increase', status_code=200, response_model=schemas.DeviceStatus)
async def increase_intensity(value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_intensity(device.intensity + value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device


@app.get('/device/intensity/decrease', status_code=200, response_model=schemas.DeviceStatus)
async def decrease_intensity(value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_intensity(device.intensity - value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device
