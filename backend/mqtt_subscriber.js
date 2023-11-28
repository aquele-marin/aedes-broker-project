const mqtt = require('mqtt');

// Replace these with your MQTT broker details
const brokerUrl = 'mqtt://127.0.0.1:1884'; // Change to your broker's address and port
const topic = 'room_temperature'; // Change to the topic you want to subscribe to

// Create a client instance
const client = mqtt.connect(brokerUrl, {
    username: 'asd',
    password: 'asdasd'
});

// Callback when the client is connected to the broker
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    
    // Subscribe to the specified topic
    client.subscribe(topic, function (err) {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error(`Error subscribing to topic: ${err}`);
        }
    });
});

// Callback when a message is received from the subscribed topic
client.on('message', function (topic, message) {
    console.log(`Received message on topic '${topic}': ${message.toString()}`);
});

// Callback when the client is disconnected from the broker
client.on('close', function () {
    console.log('Disconnected from MQTT broker');
});

// Handle program termination gracefully
process.on('SIGINT', function () {
    console.log('Disconnecting from MQTT broker...');
    client.end(); // Disconnect from the broker
    process.exit(); // Exit the program
});
