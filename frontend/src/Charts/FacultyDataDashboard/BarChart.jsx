import { Bar } from "react-chartjs-2"

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


import { BarchartData } from "../Data/fakeData/Data";



export default function FacultyPublicationsBarChart() {
    const options = {
        plugins: {
          title: {
            display: true,
            text: 'Publications Per Year',
          },
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
    };

      return <Bar options={options} data={BarchartData}/>
}

