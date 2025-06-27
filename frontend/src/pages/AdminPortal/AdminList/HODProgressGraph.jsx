import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const HODProgressGraph = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [data, setData] = useState([
    {
      id: 1,
      name: "Dr. John Doe",
      overallProgress: 30,
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      overallProgress: 92,
    },
    {
      id: 3,
      name: "Dr. Mark Johnson",
      overallProgress: 76,
    },
  ]);

  useEffect(() => {
    // Destroy the chart instance if it already exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get the context of the canvas
    const ctx = chartRef.current.getContext('2d');

    // Create a new Chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.name),
        datasets: [
          {
            label: 'Overall Progress (%)',
            data: data.map(item => item.overallProgress),
            backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue color with opacity
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Progress (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'HODs'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'HOD Overall Progress',
            font: {
              size: 16
            }
          }
        }
      }
    });

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-md">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default HODProgressGraph;