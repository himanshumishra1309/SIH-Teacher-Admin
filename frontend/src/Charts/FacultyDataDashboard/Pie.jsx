import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FacultyPieChart } from '../Data/fakeData/Data';

// Register the necessary components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function FacultyResearchAreaPieChart() {
    const options = {
        plugins: {
          title: {
            display: true,
            text: 'Research Area Distribution',
          },
        },
        responsive: true,
      };
    
      return <Pie data={FacultyPieChart} options={options} />;

}