import FacultyPerformanceBarChart from "@/Charts/Data/fakeData/Admin Dashboard/FacultyPerformanceBarChart";
import ResearchImpactRadarChart from "@/Charts/Data/fakeData/Admin Dashboard/ResearchImpactRadarChat";
import GrantAllocationPieChart from "@/Charts/Data/fakeData/Admin Dashboard/GrantAllocationPieChart";
import TeachingLoadBarChart from "@/Charts/Data/fakeData/Admin Dashboard/TeachingLoadBarChart";

import MonthlySubmissionsLineChart from "@/Charts/Data/fakeData/Admin Dashboard/MonthlySubmissionLineChart";
import FeedbackRatingsRadarChart from "@/Charts/Data/fakeData/Admin Dashboard/FeedbackRatingsRadarChat";
import DepartmentGrowthLineChart from "@/Charts/Data/fakeData/Admin Dashboard/DepartmentGrowthLineChart";

function AdminDataDashboard() {
  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {/* Row 1: Performance Bar Chart, Radar Research Impact, Pie Chart */}
      {/* 
        <div className="col-span-1 bg-white shadow-md p-4 rounded-lg">
        <FacultyPerformanceBarChart />
      </div>
      <div className="col-span-1 bg-white shadow-md p-4 rounded-lg">
        <ResearchImpactRadarChart />
      </div>
      <div className="col-span-1 bg-white shadow-md p-4 rounded-lg">
        <GrantAllocationPieChart />
      </div>
      <div className="col-span-1 bg-white shadow-md p-4 rounded-lg">
        <TeachingLoadBarChart />
      </div>
      <div className="col-span-1 bg-white shadow-md p-4 rounded-lg">
        <MonthlySubmissionsLineChart />
      </div>
      <div className="col-span-1 bg-white shadow-md p-4 rounded-lg">
        <FeedbackRatingsRadarChart />
      </div>
      */}

      {/* Extra Row: Departmental Growth */}
      <div className="col-span-3 bg-white shadow-md p-4 rounded-lg">
        <DepartmentGrowthLineChart />
      </div>
    </div>
  );
}

export default AdminDataDashboard;
