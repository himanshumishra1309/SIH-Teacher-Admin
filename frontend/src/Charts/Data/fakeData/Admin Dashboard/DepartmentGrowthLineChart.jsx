import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function DepartmentGrowthLineChart({ id }) {
  const teacherId = id;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await axios.post(
          `http://localhost:6005/api/v1/teachers/me/graph`, // POST request
          { teacherId }, // Send teacherId in the request body
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(
                "teacherAccessToken"
              )}`,
            },
          }
        );

        console.log(response.data.data);

        const graphData = response.data.data;

        // Extract data for the chart
        const labels = graphData.map((item) => {
          const date = new Date(item.date); // Convert string to Date object
          return date.toLocaleDateString(); // Returns the date in "MM/DD/YYYY" format
        });

        const points = graphData.map((item) => item.points); // Points for line chart

        setChartData({
          labels,
          datasets: [
            {
              label: "Performance Points",
              data: points,
              borderColor: "rgba(54, 162, 235, 0.6)",
              fill: false,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        setError("Failed to load chart data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  // const data = {
  //   labels: ["2019", "2020", "2021", "2022", "2023"],
  //   datasets: [
  //     {
  //       label: "Number of Faculty",
  //       data: [30, 32, 34, 35, 40],
  //       borderColor: "rgba(54, 162, 235, 0.6)",
  //       fill: false,
  //     },
  //     {
  //       label: "Publications",
  //       data: [40, 50, 45, 60, 75],
  //       borderColor: "rgba(255, 99, 132, 0.6)",
  //       fill: false,
  //     },
  //     {
  //       label: "Grants",
  //       data: [100000, 120000, 130000, 150000, 200000],
  //       borderColor: "rgba(75, 192, 192, 0.6)",
  //       fill: false,
  //     },
  //   ],
  // };

  const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Department Growth Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10, // Adjust step size to space the y-axis labels
        },
      },
      x: {
        title: {
          display: true,
          text: "Time (Year)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default DepartmentGrowthLineChart;
