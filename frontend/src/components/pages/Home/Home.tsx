/* eslint-disable @typescript-eslint/no-explicit-any */
import { MainNav } from "@/components/atoms/MainNav/MainNav";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import mqtt from "mqtt"
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export function Home() {
  // const [dataStream, setDatastream] = useState<Data[]>([]);
  const chartRef = useRef<ChartJS>();
  const [device, setDevice] = useState({
    intensity: 3,
    is_on: false,
    temperature: 30,
  })
  const [data, ] = useState({
    label: [],
    datasets: [
      {
        label: "Temperatura ambiente",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        tension: 0.15,
        fill: false,
      },
    ],
  });
  const topics = ['room_temperature', 'device_status']; 
  const brokerUser = 'broker_user';
  const brokerPwd = 'broker_pwd';
  const brokerClientName = 'node_backend';

  useEffect(() => {
    const client = mqtt.connect("ws://127.0.0.1:8884", {
      clientId: brokerClientName,
      username: brokerUser,
      password: brokerPwd
    });
    let exitflag = false;
    client.on("connect", () => {
      // console.log("Connected to MQTT broker");
      client.subscribe(topics, (err) => {
        if (err) {
          console.error('Error subscribing to topics:', err);
          exitflag = true;
        }
      })
    })

    if (exitflag) {
      return;
    }

    client.on('message', async (receivedTopic, message) => {
      if (!chartRef.current) return;
      const message_data = JSON.parse(message.toString())
      if (receivedTopic === 'room_temperature') {
        // setDatastream((prev: Data[]) => [...prev, {x: message_data.current_time, y: message_data.room_temperature}]);
        chartRef.current.config.data.datasets[0].data.push({x: message_data.current_time, y: message_data.room_temperature});
        chartRef.current.update()
        console.log("room_temperature message", JSON.parse(message.toString()))
        // await writeRoomTemperatureToDatabase(jsonMessage.current_time, jsonMessage.device_id, jsonMessage.room_temperature);
      } else if (receivedTopic === 'device_status') {
        // jsonMessage = JSON.parse(message.toString())
        setDevice({
          intensity: message_data.intensity,
          is_on: message_data.is_on,
          temperature: message_data.temperature,
        })
        console.log("device_status message", JSON.parse(message.toString()))
        // await writeDeviceStatusToDatabase(jsonMessage.current_time, jsonMessage.device_id, jsonMessage.is_on, jsonMessage.temperature, jsonMessage.intensity);
      }
    });
    return () => {
      client.end();
    }
  })

  async function handleIncreaseIntensity() {
    try {
      const response = await axios.get("http://localhost:3000/device/intensity/increase");
      console.log("HANDLE INCREASE INTENSITY", response.data);
      setDevice({ is_on: response.data.on, intensity:response.data.intensity, temperature: response.data.temperature});
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDecreaseIntensity() {
    try {
      const response = await axios.get("http://localhost:3000/device/intensity/decrease");
      console.log("HANDLE DECREASE INTENSITY", response.data);
      setDevice({ is_on: response.data.on, intensity:response.data.intensity, temperature: response.data.temperature});
    } catch (error) {
      console.log(error)
    }
  }

  async function switchPower() {
  try {
      const response = await axios.get(device.is_on? "http://localhost:3000/device/turnoff":"http://localhost:3000/device/turnon");
      console.log("HANDLE SWITCH POWER", response.data);
      setDevice({ is_on: response.data.on, intensity:response.data.intensity, temperature: response.data.temperature});
    } catch (error) {
      console.log(error)
    }
  }

  async function handleIncreaseTemperature() {
    try {
      const response = await axios.get("http://localhost:3000/device/temperature/increase");
      console.log("HANDLE INCEASE TEMPERATURE", response.data);
      setDevice({ is_on: response.data.on, intensity:response.data.intensity, temperature: response.data.temperature});
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDecreaseTemperature() {
    try {
      const response = await axios.get("http://localhost:3000/device/temperature/decrease");
      console.log("HANDLE DECREASE TEMPERATURE", response.data);
      setDevice({ is_on: response.data.on, intensity:response.data.intensity, temperature: response.data.temperature});
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-4 bg-slate-300 h-screen w-screen">
      <MainNav />
      <div className="w-full h-full">
        <div className="w-full h-1/2 flex">
          <div className="h-full w-1/2">
            <Line
              ref={chartRef as any}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  intersect: false,
                  mode: "index",
                },
                scales: {
                  x: {
                    type: "time",
                    display: true,
                    title: {
                      text: "Datas",
                      display: true,
                    },
                  },
                  y: {
                    display: true,
                    title: {
                      text: "Eixo y",
                      display: true,
                    },
                  },
                },
                elements: {
                  point: {
                    drawActiveElementsOnTop: false,
                    radius: 0,
                  },
                },
              }}
              data={data}
            />
          </div>
          <div className="h-full w-1/2">
            <div className="h-full">
              <p className="flex">Ligado:</p>
              <div onClick={switchPower} className={`${device.is_on? "bg-green-800":"bg-red-600"} w-full h-full flex justify-center items-center cursor-pointer`}>
                <p className="text-[16rem]">{device.is_on? "ON":"OFF"}</p>
              </div>
            </div>
            <p>
              Temperatura atual: <span>{device.temperature}</span>
            </p>
            <div className="flex justify-around">
          <Button onClick={handleIncreaseTemperature}>+</Button>
          <Button onClick={handleDecreaseTemperature}>-</Button>
        </div>
          </div>
        </div>
        <div className="bg-slate-300 w-1/2 h-[40%] flex items-center flex-col">
          <p>
            Intensidade: <span>{device.intensity} de 5</span>
          </p>
          <div className="h-full w-full flex flex-col justify-between mt-2">
            <div className={`${device.intensity === 5 ? "bg-slate-500":"bg-slate-400"} w-full h-1/6`}></div>
            <div className={`${device.intensity >= 4 ? "bg-slate-500":"bg-slate-400"} w-full h-1/6`}></div>
            <div className={`${device.intensity >= 3 ? "bg-slate-500":"bg-slate-400"} w-full h-1/6`}></div>
            <div className={`${device.intensity >= 2 ? "bg-slate-500":"bg-slate-400"} w-full h-1/6`}></div>
            <div className={`${device.intensity >= 1 ? "bg-slate-500":"bg-slate-400"} w-full h-1/6`}></div>
          </div>
        </div>
        <div className="w-1/2 flex justify-around">
          <Button onClick={handleIncreaseIntensity}>+</Button>
          <Button onClick={handleDecreaseIntensity}>-</Button>
        </div>
      </div>
    </div>
  );
}
