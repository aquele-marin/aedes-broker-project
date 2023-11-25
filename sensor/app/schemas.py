from pydantic import BaseModel

class DeviceStatus (BaseModel):
    on: bool
    intensity: int
    temperature: int

    class Config:
        from_attributes = True