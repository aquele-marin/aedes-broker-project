from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
import asyncio
import threading
import time

from .air_conditioning import AirConditioning
from . import schemas

run_enviroment_temp_calculation = True
run_send_environment_temp_to_topic = True
a = 1

@asynccontextmanager
async def lifespan(app: FastAPI):
    global run_enviroment_temp_calculation
    global run_send_environment_temp_to_topic
    run_enviroment_temp_calculation = True
    run_send_environment_temp_to_topic = True
    yield
    run_enviroment_temp_calculation = False
    run_send_environment_temp_to_topic = False


app = FastAPI(lifespan=lifespan)
device = AirConditioning()


def write_result_to_file(result):
    # Write the result to a file
    # with open("result.txt", "a") as file:
    #     file.write(f"{result}\n")
    print(result)


def background_task():
    global run_enviroment_temp_calculation
    while run_enviroment_temp_calculation:
        # Your task logic goes here
        result = device.environment_temperature

        # Write the result to a file
        write_result_to_file(result)

        # Sleep for one second
        time.sleep(1)


background_thread_temp_calculation = threading.Thread(target=background_task)
background_thread_temp_calculation.start()

# RETIRAR ISSO DEPOIS
device.turn_on()

# @asyncio.coroutine
def change_environment_temperature():
    new_temp = device.calculate_new_environment_temperature()
    device.environment_temperature = new_temp
    print('Env', str(device.environment_temperature))
    return device.environment_temperature


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


@app.get('/devices/{id}/environment', status_code=200, response_model=schemas.EnvironmentTemp)
async def get_new_environment_tempearute(id: str):
    new_temp = device.calculate_new_environment_temperature()
    device.environment_temperature = new_temp
    # device.change_environment_temperature(new_temp + device.environment_temperature)
    return device