import uuid
import threading
import time
from .publisher import client, kill_client
import paho.mqtt.client as mqtt
from datetime import datetime
import json

class DeviceIsNotTurnedOnException(Exception):
    ...


class AirConditioning:
    ENV_TEMP_CALCULATION : bool = True

    def __init__(self, start_intensity=3, start_temperature=21, min_temp=16, max_temp=28, env_temp_start=23, env_max_temp=30) -> None:
        self.id = str(uuid.uuid4())
        self.on = False
        self.intensity = start_intensity
        self.min_intensity = 1
        self.max_intensity = 5
        self.temperature = start_temperature
        self.min_temperature = min_temp
        self.max_temperature = max_temp
        self.environment_temperature = env_temp_start
        self.max_enviroment_temperature = env_max_temp
        
        self.ENV_TEMP_CALCULATION = True
        self.ENV_TEMP_PUBLISH = True
        
        self.mqtt_client: mqtt.Client = client
        background_thread_env_temperature_calculation = threading.Thread(target=self.calculate_new_environment_temperature)
        background_thread_env_temperature_calculation.start()
        background_thread_env_temperature_publish = threading.Thread(target=self.publish_environment_temperature)
        background_thread_env_temperature_publish.start()
        
    def kill(self):
        self.ENV_TEMP_CALCULATION = False
        self.ENV_TEMP_PUBLISH = False
        
    def calculate_new_environment_temperature(self):
        while self.ENV_TEMP_CALCULATION:
            result = self.set_new_environment_temperature()
            self.environment_temperature = result

            # Sleep for one second
            time.sleep(1)
    
    def publish_environment_temperature(self):
        while self.ENV_TEMP_PUBLISH:
            msg = self.mqtt_client.publish("room_temperature", json.dumps({
                'current_time': str(datetime.now()),
                'device_id': self.id,
                'room_temperature': self.environment_temperature
            }))
            time.sleep(1)
        kill_client(self.mqtt_client)
        
    def on_update_publish_status(self):
        msg = self.mqtt_client.publish('device_status', json.dumps({
            'current_time': str(datetime.now()),
            'device_id': self.id,
            'is_on': self.on,
            'temperature': self.temperature,
            'intensity': self.intensity
        }))
        print(f"Wrote message on topic {'device_status'} with rc", msg.rc)
        
    def turn_on(self):
        if not self.on:
            self.on = True
            self.on_update_publish_status()

    def turn_off(self):
        if self.on:
            self.on = False
            self.on_update_publish_status()

    def reduce_temperature(self):
        if self.temperature > self.min_temperature:
            self.temperature -= 1

    def increase_temperature(self):
        if self.temperature < self.max_temperature:
            self.temperature += 1

    def set_temperature(self, new_temp):
        if not self.on:
            raise DeviceIsNotTurnedOnException(f"Device {self.id} is not on. Turn on to use")
        
        if new_temp == self.temperature:
            return
        
        if new_temp >= self.max_temperature:
            self.temperature = self.max_temperature
        elif new_temp <= self.min_temperature:
            self.temperature = self.min_temperature
        else:
            self.temperature = new_temp
            
        self.on_update_publish_status()

    def set_intensity(self, new_instensity):
        if not self.on:
            raise DeviceIsNotTurnedOnException(f"Device {self.id} is not on. Turn on to use")
        
        if new_instensity == self.intensity:
            return
        
        if new_instensity >= self.max_intensity:
            self.intensity = self.max_intensity
        elif new_instensity <= self.min_intensity:
            self.intensity = self.min_intensity
        else:
            self.intensity = new_instensity
            
        self.on_update_publish_status()

    def set_new_environment_temperature(self) -> float:
        temperature = self.environment_temperature + \
            ((1) - ((float(10 + self.intensity) / 10) * self.on))
        temperature = round(temperature, 2)
            
        if temperature >= self.max_enviroment_temperature:
            temperature = self.max_enviroment_temperature
        elif temperature <= self.temperature:
            temperature = self.temperature
            
        self.environment_temperature = temperature
        
        return temperature
