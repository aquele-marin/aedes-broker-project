const express = require("express");
const http = require('http');
const mqtt = require('mqtt');
const websocket = require('websocket-stream');
const WebSocket = require('ws');
const { mongoose, writeRoomTemperatureToDatabase, writeDeviceStatusToDatabase } = require("./src/database/connection");
const Test = require("./src/models/test");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app); // Used for the web-socket connector
const wss = new WebSocket.Server({ server });

// Broker connection
const brokerUrl = 'ws://127.0.0.1:8884';
const topics = ['room_temperature', 'device_status'];  // Topics to subscribe
const client = mqtt.connect(brokerUrl, {
  clientId: 'node_backend',
  username: 'asd',
  password: 'asdasd'
});

client.subscribe(topics, (err, granted) => {
  if (err) {
      console.error('Error subscribing to topics:', err);
  } else {
      console.log('Subscribed to topics:', granted);
  }
});

client.on('message', async (receivedTopic, message) => {
  if (receivedTopic === 'room_temperature'){
    jsonMessage = JSON.parse(message.toString())
    await writeRoomTemperatureToDatabase(jsonMessage.current_time, jsonMessage.device_id, jsonMessage.room_temperature);
  }
  console.log(JSON.parse(message.toString()))
});

// NAO FUNCIONAAAAAA
// console.log('Before websocket.createServer');
// websocket.createServer({ server }, (stream, request) => {
//   console.log("Nem entrou")
//   const duplexStream = websocket.createWebSocketStream(stream);
//   client.pipe(duplexStream).pipe(client);

//   client.subscribe(["room_temperature", "device_status"], (err, granted) => {
//     if (err) {
//         console.error('Error subscribing to topics:', err);
//     } else {
//         console.log('Subscribed to topics:', granted);
//     }
//   });

//   client.on('message', async (receivedTopic, message) => {
//     console.log(message)
//   });
// });

// API
app.get("/", async (req, res) => {
  console.log("Received request for URL: " + req.url);

  const test = await Test.find();
  console.log(test);

  return res.send(test);
});

// app.listen(3000, "127.0.0.1");
server.listen(3000, () => {
  console.log(`Server listening on port ${3000}`);
});
