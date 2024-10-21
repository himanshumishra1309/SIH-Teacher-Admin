import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

function FeedbackRatingsRadarChart() {
  // Hardcoded data
  const data = {
    labels: ['Teaching Quality', 'Responsiveness', 'Engagement', 'Knowledge'],
    datasets: [
      {
        label: 'Faculty A',
        data: [4.5, 4.0, 4.2, 4.8],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Faculty B',
        data: [3.8, 4.2, 4.1, 4.0],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Faculty Feedback Ratings',
      },
    },
    responsive: true,
  };

  return <Radar data={data} options={options} />;
}

export default FeedbackRatingsRadarChart;
