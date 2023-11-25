from fastapi import FastAPI, HTTPException

from .air_conditioning import AirConditioning
from . import schemas

app = FastAPI()
device = AirConditioning()

# RETIRAR ISSO DEPOIS
device.turn_on()

@app.get('/')
async def home():
    return 'Hello'


@app.get('/devices/{id}/turnon', status_code=200, response_model=schemas.DeviceStatus)
async def turn_on_device(id: str):
    device.turn_on()
    return device


@app.get('/devices/{id}/turnoff', status_code=200, response_model=schemas.DeviceStatus)
async def turn_off_device(id: str):
    device.turn_off()
    return device


@app.post('/devices/{id}/temperature', status_code=200, response_model=schemas.DeviceStatus)
async def set_new_temperature_for_device(id: str, new_temperature: int):
    device.set_temperature(new_temperature)
    return device


@app.get('/devices/{id}/temperature/increase', status_code=200, response_model=schemas.DeviceStatus)
async def increase_temperature(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    device.set_temperature(device.temperature + value)
    return device


@app.get('/devices/{id}/temperature/decrease', status_code=200, response_model=schemas.DeviceStatus)
async def decrease_temperature(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    device.set_temperature(device.temperature - value)
    return device


@app.get('/devices/{id}/intensity/increase', status_code=200, response_model=schemas.DeviceStatus)
async def increase_intensity(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    device.set_intensity(device.intensity + value)
    return device


@app.get('/devices/{id}/intensity/decrease', status_code=200, response_model=schemas.DeviceStatus)
async def decrease_intensity(id: str, value: int = 1):
    if value < 0:
        raise HTTPException(422, f'Value must be above 0')
    device.set_intensity(device.intensity - value)
    return device