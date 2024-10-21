import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FacultyPerformanceBarChart() {
  // Hardcoded data
  const data = {
    labels: ['Faculty A', 'Faculty B', 'Faculty C', 'Faculty D'],
    datasets: [
      {
        label: 'Publications',
        data: [10, 7, 5, 12],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Teaching Hours',
        data: [120, 130, 140, 150],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Research Impact',
        data: [85, 90, 75, 80],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  // Chart options
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Faculty Performance Comparison',
      },
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default FacultyPerformanceBarChart;
