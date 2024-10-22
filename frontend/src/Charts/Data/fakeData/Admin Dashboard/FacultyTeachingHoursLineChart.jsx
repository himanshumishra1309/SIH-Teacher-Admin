import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function FacultyTeachingHoursLineChart() {
  // Hardcoded data
  const data = {
    labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'],
    datasets: [
      {
        label: 'Teaching Hours',
        data: [150, 180, 160, 170, 190],
        borderColor: 'rgba(54, 162, 235, 0.6)',
        fill: false,
      },
    ],
  };

  // Chart options
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Teaching Hours Across Semesters',
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

export default FacultyTeachingHoursLineChart;
