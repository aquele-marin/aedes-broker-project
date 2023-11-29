from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import os

from .air_conditioning import AirConditioning, DeviceIsNotTurnedOnException
from . import schemas

device = AirConditioning()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    device.kill()


app = FastAPI(lifespan=lifespan)


@app.get('/')
async def home():
    return {'message': 'Hello World!'}


@app.get('/devices/{id}/turnon', status_code=200, response_model=schemas.DeviceStatus)
async def turn_on_device(id: str):
    device.turn_on()
    return device


@app.get('/devices/{id}/turnoff', status_code=200, response_model=schemas.DeviceStatus)
async def turn_off_device(id: str):
    device.turn_off()
    return device


@app.get('/devices/{id}/temperature/increase', status_code=200, response_model=schemas.DeviceStatus)
async def increase_temperature(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_temperature(device.temperature + value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device


@app.get('/devices/{id}/temperature/decrease', status_code=200, response_model=schemas.DeviceStatus)
async def decrease_temperature(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_temperature(device.temperature - value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device


@app.get('/devices/{id}/intensity/increase', status_code=200, response_model=schemas.DeviceStatus)
async def increase_intensity(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_intensity(device.intensity + value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device


@app.get('/devices/{id}/intensity/decrease', status_code=200, response_model=schemas.DeviceStatus)
async def decrease_intensity(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    try:
        device.set_intensity(device.intensity - value)
    except DeviceIsNotTurnedOnException as e:
        raise HTTPException(409, str(e))
    return device
