export const lineChartData  = {
    
  labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'],
  datasets: [
    {
      label: 'Teaching Hours',
      data: [150, 180, 160, 170, 190],
      borderColor: 'rgba(54, 162, 235, 0.6)',
      fill: false,
    },
  ],
    
}

export const BarchartData = {
  labels: ['2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Number of Publications',
      data: [2, 4, 3, 5, 7],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

export const FacultyPieChart = {
  
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
  
}