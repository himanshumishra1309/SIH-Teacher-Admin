import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function GrantAllocationPieChart() {
  // Hardcoded data
  const data = {
    labels: ['Faculty A', 'Faculty B', 'Faculty C', 'Faculty D'],
    datasets: [
      {
        label: 'Grant Allocation',
        data: [50000, 75000, 100000, 120000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Grant Allocation Among Faculty Members',
      },
    },
    responsive: true,
  };

  return <Pie data={data} options={options} />;
}

export default GrantAllocationPieChart;
