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
  const data = {
    label: [],
    datasets: [
      {
        label: "Temperatura ambiente",
        data: [
          { x: "23-11-2023", y: 24 },
          { x: "24-11-2023", y: 23.5 },
          { x: "25-11-2023", y: 23 },
          { x: "26-11-2023", y: 24 },
          { x: "27-11-2023", y: 24.5 },
          { x: "28-11-2023", y: 23 },
          { x: "29-11-2023", y: 22 },
          { x: "30-11-2023", y: 21 },
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        tension: 0.15,
        fill: false,
      },
    ],
  };
  return (
    <div className="p-4 bg-slate-300 h-screen w-screen">
      <MainNav />
      <div className="w-full h-full">
        <div className="w-full h-1/2 flex">
          <div className="h-full w-1/2">
            <Line
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
                    time: {
                      parser: "mm-dd-yyyy",
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
              <div className="bg-green-800 w-full h-full flex justify-center items-center">
                <p className="text-[16rem]">ON</p>
              </div>
            </div>
            <p>
              Temperatura atual: <span>23</span>
            </p>
          </div>
        </div>
        <div className="bg-slate-300 w-1/2 h-[40%] flex items-center flex-col">
          <p>
            Intensidade: <span>3 de 4</span>
          </p>
          <div className="h-full w-full flex flex-col justify-between mt-2">
            <div className="bg-slate-400 w-full h-1/5"></div>
            <div className="bg-slate-500 w-full h-1/5"></div>
            <div className="bg-slate-500 w-full h-1/5"></div>
            <div className="bg-slate-500 w-full h-1/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
