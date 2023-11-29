import paho.mqtt.client as mqtt
import time
import logging

logging.basicConfig(level=logging.DEBUG)

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to the broker")
    else:
        print(f"Connection failed with result code {rc}")


def on_disconnect(client, userdata, rc):
    if rc != 0:
        print(f"Unexpected disconnection. Result code: {rc}")


def connect_to_broker(host, port, keep_alive, usename, password) -> mqtt.Client:
    client = mqtt.Client()
    client.username_pw_set(usename, password)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.enable_logger()
    client.connect(host, port, keep_alive)
    
    return client


def kill_client(client):
    client.disconnect()
    client.loop_stop()


client = connect_to_broker("127.0.0.1", 1884, 180, 'asd', 'asdasd')

client.loop_start()
