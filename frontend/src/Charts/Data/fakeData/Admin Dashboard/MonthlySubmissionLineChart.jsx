import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function MonthlySubmissionsLineChart() {
  // Hardcoded data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Research Papers Submitted',
        data: [3, 6, 8, 5, 7, 12, 10, 11, 9, 6, 5, 8],
        borderColor: 'rgba(255, 159, 64, 0.6)',
        fill: false,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Monthly Research Paper Submissions',
      },
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default MonthlySubmissionsLineChart;
