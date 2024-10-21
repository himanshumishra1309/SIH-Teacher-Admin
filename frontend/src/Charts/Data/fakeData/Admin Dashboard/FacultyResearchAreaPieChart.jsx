import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register the necessary components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

function FacultyResearchAreaPieChart() {
  // Hardcoded data
  const data = {
    labels: ['AI', 'Data Science', 'Cybersecurity', 'Networking', 'Blockchain'],
    datasets: [
      {
        label: 'Research Area Distribution',
        data: [20, 25, 15, 20, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  // Chart options
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Research Area Distribution',
      },
    },
    responsive: true,
  };

  return <Pie data={data} options={options} />;
}

export default FacultyResearchAreaPieChart;
