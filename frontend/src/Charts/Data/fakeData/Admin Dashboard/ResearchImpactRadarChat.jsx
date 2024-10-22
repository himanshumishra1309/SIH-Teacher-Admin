import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

function ResearchImpactRadarChart() {
  // Hardcoded data
  const data = {
    labels: ['Citations', 'Journal Impact Factor', 'Collaboration Index', 'Grants'],
    datasets: [
      {
        label: 'Faculty A',
        data: [85, 90, 75, 70],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Faculty B',
        data: [65, 80, 85, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Research Paper Impact Comparison',
      },
    },
    responsive: true,
  };

  return <Radar data={data} options={options} />;
}

export default ResearchImpactRadarChart;
