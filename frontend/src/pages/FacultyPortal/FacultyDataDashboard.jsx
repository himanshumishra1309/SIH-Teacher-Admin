import React from 'react';
import FacultyResearchAreaPieChart from '@/Charts/FacultyDataDashboard/Pie';
import FacultyTeachingHoursLineChart  from '@/Charts/FacultyDataDashboard/Line';
import FacultyPublicationsBarChart from '@/Charts/FacultyDataDashboard/BarChart';

export default function FacultyDataDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      <div className="shadow-lg p-4 flex items-center">
        <FacultyPublicationsBarChart />
      </div>
      <div className="shadow-lg p-4 flex items-center">
        <FacultyTeachingHoursLineChart />
      </div>
      <div className="shadow-lg p-4 flex items-center">
        <FacultyResearchAreaPieChart />
      </div>
    </div>
  );
}

