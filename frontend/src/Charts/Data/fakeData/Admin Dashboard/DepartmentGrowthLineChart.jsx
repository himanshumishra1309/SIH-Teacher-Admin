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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              borderColor: "rgba(37, 99, 235, 1)", // Darker blue color
              backgroundColor: "rgba(37, 99, 235, 0.1)", // Light blue background
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "rgba(37, 99, 235, 1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(37, 99, 235, 1)",
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
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: "Department Growth Over Time",
        font: {
          size: 20,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        titleColor: '#2563eb',
        bodyColor: '#1e40af',
        borderColor: '#2563eb',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10, // Adjust step size to space the y-axis labels
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: "Time (Year)",
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: 12
          }
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (isLoading) {
    return <div className="text-center py-10 text-blue-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-700">Faculty Performance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}

export default DepartmentGrowthLineChart;