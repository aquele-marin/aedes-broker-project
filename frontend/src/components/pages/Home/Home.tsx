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
        label: "dataset",
        data: [
          { x: "01-01-2020", y: 1 },
          { x: "01-01-2021", y: 2 },
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
        </div>
        <div className="w-full h-1/2 ">
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
      </div>
    </div>
  );
}
