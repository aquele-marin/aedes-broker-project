const express = require("express");
const http = require('http');
const mqtt = require('mqtt');
const websocket = require('websocket-stream');
const WebSocket = require('ws');
const { mongoose, writeRoomTemperatureToDatabase, writeDeviceStatusToDatabase } = require("./src/database/connection");
const cors = require("cors");
const axios = require('axios');

const app = express();
app.use(cors());

const server = http.createServer(app); // Used for the web-socket connector
const wss = new WebSocket.Server({ server });

// Broker connection
const brokerHost = process.env.BROKER_HOST || '127.0.0.1';
const brokerPort = process.env.BROKER_PORT || '8884';
const brokerUser = process.env.BROKER_USER || 'broker_user';
const brokerPwd = process.env.BROKER_PWD || 'broker_pwd';
const brokerClientName = process.env.BROKER_CLIENT_ID || 'node_backend';

const brokerUrl = `ws://${brokerHost}:${brokerPort}`;
const topics = ['room_temperature', 'device_status'];  // Topics to subscribe
const client = mqtt.connect(brokerUrl, {
  clientId: brokerClientName,
  username: brokerUser,
  password: brokerPwd
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
  if (receivedTopic === 'device_status'){
    jsonMessage = JSON.parse(message.toString())
    await writeDeviceStatusToDatabase(jsonMessage.current_time, jsonMessage.device_id, jsonMessage.is_on, jsonMessage.temperature, jsonMessage.intensity);
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


// Device API connection
const deviceHost = process.env.SENSOR_API_HOST || '127.0.0.1';
const devicePort = process.env.SENSOR_API_PORT || '8000';
const deviceURL = `http://${deviceHost}:${devicePort}`

// API
app.get("/", async (req, res) => {
  console.log("Received request for URL: " + req.url);

  // const test = await Test.find();
  // console.log(test);

  return res.status(200).send('Hi');
});


app.get("/device/turnon", async (req, res) => {
  try {
    const response = await axios.get(`${deviceURL}/device/turnon`);
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.get("/device/turnoff", async (req, res) => {
  try {
    const response = await axios.get(`${deviceURL}/device/turnoff`);
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.get("/device/temperature/increase", async (req, res) => {
  try {
    const value = parseInt(req.query.value) || 1;
    if (value <= 0) {
      return res.status(422).json({ error: "Value must be greater than 0" });
    }
    const response = await axios.get(`${deviceURL}/device/temperature/increase`);
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.get("/device/temperature/decrease", async (req, res) => {
  try {
    const value = parseInt(req.query.value) || 1;
    if (value <= 0) {
      return res.status(422).json({ error: "Value must be greater than 0" });
    }
    const response = await axios.get(`${deviceURL}/device/temperature/decrease`);
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.get("/device/intensity/increase", async (req, res) => {
  try {
    const value = parseInt(req.query.value) || 1;
    if (value <= 0) {
      return res.status(422).json({ error: "Value must be greater than 0" });
    }
    const response = await axios.get(`${deviceURL}/device/intensity/increase`);
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.get("/device/intensity/decrease", async (req, res) => {
  try {
    const value = parseInt(req.query.value) || 1;
    if (value <= 0) {
      return res.status(422).json({ error: "Value must be greater than 0" });
    }
    const response = await axios.get(`${deviceURL}/device/intensity/decrease?value=${value}`);
    const responseData = response.data;
    if (response.status === 409) {
      res.status(409).json(responseData);
      throw new Error(responseData.message);
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
  }
})

app.listen(3000, "127.0.0.1", () => {console.log("Running on port 3000")});
