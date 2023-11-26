from pydantic import BaseModel

class DeviceStatus (BaseModel):
    on: bool
    intensity: int
    temperature: int

    class Config:
        from_attributes = True


class EnvironmentTemp (BaseModel):
    environment_temperature: float

    class Config:
        from_attributes = True