import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HODResearchDistributionTable from '../Tables/HODResearchDistTable';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import HODSeminarDistTable from '../Tables/HODSeminarDistTable';

ChartJS.register(ArcElement, Tooltip, Legend);

const SeminarDistributionPage = () => {
  // Sample data for the pie chart
  const data = {
    labels: ['Teacher A', 'Teacher B', 'Teacher C', 'Teacher D', 'Teacher E'],
    datasets: [
      {
        data: [3, 2.5, 2, 1.5, 1],
        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'],
        hoverBackgroundColor: ['#0077E0', '#00B48F', '#EFAB18', '#EF7032', '#7874C8'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Task Assignment</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First column: Total and Description */}
        <Card>
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Total Tasks: 100</p>
            <p className="mt-2">
              This is a description of the task assignment process. It provides an overview of how tasks are distributed among faculty members based on their research output and other factors.
            </p>
          </CardContent>
        </Card>

        {/* Second column: Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Pie data={data} options={options} />
            </div>
          </CardContent>
        </Card>

        {/* Third column: Research Table */}
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Research Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <HODSeminarDistTable/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeminarDistributionPage;
