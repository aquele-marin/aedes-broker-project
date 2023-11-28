const mongoose = require("mongoose");

const uri =
  "mongodb://127.0.0.1:27017/device?retryWrites=true&w=majority";

const db = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose schema for room_temperature
const RoomTemperatureSchema = new mongoose.Schema({
  received_at: { type: Date, default: Date.now },
  sent_at: { type: Date, required: true },
  device_id: { type: String, required: true },
  room_temperature: { type: Number, required: true }
});

// Create a Mongoose model for room_temperature
const RoomTemperatureModel = mongoose.model('RoomTemperature', RoomTemperatureSchema);

// Define a Mongoose schema for device_status
const DeviceStatusSchema = new mongoose.Schema({
  received_at: { type: Date, default: Date.now },
  sent_at: { type: Date, required: true },
  device_id: { type: String, required: true },
  is_on: { type: Boolean, required: true },
  temperature: { type: Number, required: true },
  intensity: { type: Number, required: true }
});

// Create a Mongoose model for device_status
const DeviceStatusModel = mongoose.model('DeviceStatus', DeviceStatusSchema);

async function writeRoomTemperatureToDatabase(device_id, room_temperature) {
  try {
      const roomTemperatureDoc = new RoomTemperatureModel({
          device_id: device_id,
          room_temperature: room_temperature
      });
      await roomTemperatureDoc.save();
      console.log('Room temperature written to MongoDB successfully.');
  } catch (error) {
      console.error('Error writing room temperature to MongoDB:', error);
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
      console.log('Device status written to MongoDB successfully.');
  } catch (error) {
      console.error('Error writing device status to MongoDB:', error);
  }
}

module.exports = { mongoose, writeRoomTemperatureToDatabase, writeDeviceStatusToDatabase };
