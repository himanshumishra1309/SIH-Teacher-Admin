import { Line } from "react-chartjs-2"
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
 } from "chart.js"

import { lineChartData } from "../Data/fakeData/Data";

 ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
 );

export default function FacultyTeachingHoursLineChart() {

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

    return <Line options={options} data={lineChartData} />;
};