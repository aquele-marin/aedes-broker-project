"""
Neste arquivo fica a criação da conexão com o Broker. Para consumi-lo, apenas importe a variavel 'client'
"""
import paho.mqtt.client as mqtt
import time
import logging
import os

# Apenas serve para printar os logs com mais detalhes
logging.basicConfig(level=logging.DEBUG)

def set_env_variables():
    """Quando executamos o programa pelo docker compose
    as variaveis de ambiente ja sao setadas. Mas se estiver
    rodando localmente precisamos setar as variaveis manualmente
    apontando para o broker em localhost
    """
    if not os.getenv("BROKER_HOST"):
        os.environ["BROKER_HOST"] = "127.0.0.1"
        os.environ["BROKER_PORT"] = "1884"
        os.environ["BROKER_USER"] = "broker_user"
        os.environ["BROKER_PWD"] = "broker_pwd"
        os.environ["BROKER_CLIENT_ID"] = "sensor"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to the broker")
    else:
        print(f"Connection failed with result code {rc}")


def on_disconnect(client, userdata, rc):
    if rc != 0:
        print(f"Unexpected disconnection. Result code: {rc}")


def connect_to_broker(host, port, keep_alive, usename, password, client_id) -> mqtt.Client:
    client = mqtt.Client(client_id)
    client.username_pw_set(usename, password) # Passa credenciais
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.enable_logger()
    client.connect(host, port, keep_alive)
    
    return client


def kill_client(client):
    client.disconnect()
    client.loop_stop()

set_env_variables()
client = connect_to_broker(os.getenv("BROKER_HOST"),
                           int(os.getenv("BROKER_PORT")),
                           180,
                           os.getenv("BROKER_USER"),
                           os.getenv("BROKER_PWD"),
                           os.environ["BROKER_CLIENT_ID"])

client.loop_start()
