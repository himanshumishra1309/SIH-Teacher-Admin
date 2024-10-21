import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TeachingLoadBarChart() {
  // Hardcoded data
  const data = {
    labels: ['Faculty A', 'Faculty B', 'Faculty C', 'Faculty D'],
    datasets: [
      {
        label: 'Teaching Hours',
        data: [120, 100, 150, 130],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This turns the chart horizontal
    plugins: {
      title: {
        display: true,
        text: 'Faculty Teaching Load (Hours)',
      },
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default TeachingLoadBarChart;
