import uuid
import threading
import time


class AirConditioning:
    ENV_TEMP_CALCULATION : bool = True

    def __init__(self, start_intensity=3, start_temperature=21, min_temp=16, max_temp=28, env_temp_start=23, env_max_temp=30) -> None:
        # self.id = str(uuid.uuid4())
        self.id = 1
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
        background_thread_temp_calculation = threading.Thread(target=self.calculate_new_environment_temperature)
        background_thread_temp_calculation.start()
        
    def calculate_new_environment_temperature(self):
        while self.ENV_TEMP_CALCULATION:
            result = self.get_new_environment_temperature()
            self.environment_temperature = result

            # Sleep for one second
            time.sleep(1)
        
    def turn_on(self):
        self.on = True

    def turn_off(self):
        self.on = False

    def reduce_temperature(self):
        if self.temperature > self.min_temperature:
            self.temperature -= 1

    def increase_temperature(self):
        if self.temperature < self.max_temperature:
            self.temperature += 1

    def set_temperature(self, new_temp):
        if new_temp >= self.max_temperature:
            self.temperature = self.max_temperature
        elif new_temp <= self.min_temperature:
            self.temperature = self.min_temperature
        else:
            self.temperature = new_temp

    def set_intensity(self, new_instensity):
        if new_instensity >= self.max_intensity:
            self.intensity = self.max_intensity
        elif new_instensity <= self.min_intensity:
            self.intensity = self.min_intensity
        else:
            self.intensity = new_instensity

    def change_environment_temperature(self, change_by):
        temperature = change_by + self.environment_temperature
        if temperature >= self.max_enviroment_temperature:
            self.environment_temperature = self.max_enviroment_temperature
        elif temperature <= self.temperature:
            self.environment_temperature = self.temperature
        else:
            self.environment_temperature = temperature

        return self.environment_temperature

    def get_new_environment_temperature(self) -> float:
        temperature = self.environment_temperature + \
            ((1) - ((float(10 + self.intensity) / 10) * self.on))
        temperature = round(temperature, 2)
            
        if temperature >= self.max_enviroment_temperature:
            temperature = self.max_enviroment_temperature
        elif temperature <= self.temperature:
            temperature = self.temperature
            
        return temperature
