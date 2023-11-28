// https://medium.com/mindful-engineering/mqtt-aedes-broker-a036d607e5db
const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const httpServer = require("http").createServer();
const ws = require("websocket-stream");

const MQTT_Port = 1884;
const wsPort = 8884;

// MQTT Broker
server.listen(MQTT_Port, function () {
  console.log("server started and listening on port ", MQTT_Port);
});

// Web Socket do Broker
ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(wsPort, function () {
  console.log("websocket server listening on port ", wsPort);
});

// authentication
aedes.authenticate = (client, username, password, callback) => {
  password = Buffer.from(password, "base64").toString();
  if (username === "asd" && password === "asdasd") {
    return callback(null, true);
  }
  const error = new Error(
    "Authentication Failed!! Please enter valid credentials."
  );
  console.log("Authentication failed.");
  return callback(error, false);
};


// authorising client topic to publish a message
aedes.authorizePublish = (client, packet, callback) => {
  if (packet.topic === "abc") {
    console.log(`Client ${client.id} is attempting to publish on topic 'abc'`);
    // Add any additional authorization logic here
    if (client.id !== "allowedClient") {
      console.log(`Authorization failed for client ${client.id}`);
      return callback(new Error("Unauthorized to publish on this topic"));
    }
  }
  callback(null);
};


// emitted when a client connects to the broker
aedes.on("client", function (client) {
  console.log(
    `CLIENT_CONNECTED : MQTT Client ${
      client ? client.id : client
    } connected to aedes broker ${aedes.id}`
  );
});

// emitted when a client disconnects from the broker
aedes.on("clientDisconnect", function (client) {
  console.log(
    `CLIENT_DISCONNECTED : MQTT Client ${
      client ? client.id : client
    } disconnected from the aedes broker ${aedes.id}`
  );
});

// emitted when a client subscribes to a message topic
aedes.on("subscribe", function (subscriptions, client) {
  console.log(
    `TOPIC_SUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } subscribed to topic: ${subscriptions
      .map((s) => s.topic)
      .join(",")} on aedes broker ${aedes.id}`
  );
});

// emitted when a client unsubscribes from a message topic
aedes.on("unsubscribe", function (subscriptions, client) {
  console.log(
    `TOPIC_UNSUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } unsubscribed to topic: ${subscriptions.join(",")} from aedes broker ${
      aedes.id
    }`
  );
});

// emitted when a client publishes a message packet on the topic
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log(
      `MESSAGE_PUBLISHED : MQTT Client ${
        client ? client.id : "AEDES BROKER_" + aedes.id
      } has published message "${packet.payload}" on ${
        packet.topic
      } to aedes broker ${aedes.id}`
    );
  }
});
