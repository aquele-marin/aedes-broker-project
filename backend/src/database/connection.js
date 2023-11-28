const mongoose = require("mongoose");

const uri =
  "mongodb://f:f@127.0.0.1:27017/?authMechanism=DEFAULT";

const db = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const RoomTemperatureSchema = new mongoose.Schema({
  received_at: { type: Date, default: Date.now },
  sent_at: { type: Date, required: true },
  device_id: { type: String, required: true },
  room_temperature: { type: Number, required: true }
});

const RoomTemperatureModel = mongoose.model('roomTemperature', RoomTemperatureSchema);

const DeviceStatusSchema = new mongoose.Schema({
  received_at: { type: Date, default: Date.now },
  sent_at: { type: Date, required: true },
  device_id: { type: String, required: true },
  is_on: { type: Boolean, required: true },
  temperature: { type: Number, required: true },
  intensity: { type: Number, required: true }
});

const DeviceStatusModel = mongoose.model('deviceStatus', DeviceStatusSchema);

async function writeRoomTemperatureToDatabase(sent_at, device_id, room_temperature) {
  try {
    const roomTemperatureDoc = new RoomTemperatureModel({
      sent_at: sent_at,
      device_id: device_id,
      room_temperature: room_temperature
    });
    await roomTemperatureDoc.save().then(savedUser => {
      console.log('User saved:', savedUser);
    });
    console.log('Escreveu o log');
  } catch (error) {
    console.error('Falhou no log', error);
  }
}

async function writeDeviceStatusToDatabase(device_id, is_on, temperature, intensity) {
  try {
    const deviceStatusDoc = new DeviceStatusModel({
      device_id: device_id,
      is_on: is_on,
      temperature: temperature,
      intensity: intensity
    });
    await deviceStatusDoc.save();
    console.log('Escreveu status');
  } catch (error) {
    console.error('Falhou no status', error);
  }
}

console.log("Rodou")
module.exports = { mongoose, writeRoomTemperatureToDatabase, writeDeviceStatusToDatabase };
