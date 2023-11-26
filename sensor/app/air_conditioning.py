import uuid


class AirConditioning:
    id: str
    on: bool
    intensity: int
    min_intensity: int
    max_intensity: int
    temperature: int
    min_temperature: int
    max_temperature: int
    environment_temperature: float
    max_enviroment_temperature: float

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

    # Function to change env temp
    # Env temp + ((Env temp increases * random) - (( Env Temp - Temperature) * intensity))

    def calculate_new_environment_temperature(self) -> float:
        temperature = self.environment_temperature + \
            ((1) - (1.2 * (self.environment_temperature - self.temperature) * self.intensity))
        return temperature
