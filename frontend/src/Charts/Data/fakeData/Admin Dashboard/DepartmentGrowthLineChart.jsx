import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function DepartmentGrowthLineChart() {
  // Hardcoded data
  const data = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Number of Faculty',
        data: [30, 32, 34, 35, 40],
        borderColor: 'rgba(54, 162, 235, 0.6)',
        fill: false,
      },
      {
        label: 'Publications',
        data: [40, 50, 45, 60, 75],
        borderColor: 'rgba(255, 99, 132, 0.6)',
        fill: false,
      },
      {
        label: 'Grants',
        data: [100000, 120000, 130000, 150000, 200000],
        borderColor: 'rgba(75, 192, 192, 0.6)',
        fill: false,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Department Growth Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default DepartmentGrowthLineChart;
