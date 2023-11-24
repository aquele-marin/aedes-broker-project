class AirConditioning:
    on: bool = False
    environment_temperature: float
    temperature: int
    intensity: int
    min_temperature: int
    max_temperature: int
    
    def __init__(self, start_temperature=21, min_temp=16, max_temp=28, env_temp_start=23) -> None:
        pass
    
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
            
        if new_temp <= self.min_temperature:
            self.temperature = self.min_temperature
            
        self.temperature = new_temp