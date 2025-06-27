"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import FacultyResearchTable from "@/table/Tables/Faculty/FacultyResearchTable"
import FacultyResearchFundingTable from "@/table/Tables/Faculty/FacultyResearchFundingTable"
import AdminHodWeightageTable from "@/pages/AdminPortal/AdminWeightage/AdminHodWeightageTable"
import AdminFacultyWeightageTable from "@/pages/AdminPortal/AdminWeightage/AdminFacultyWeightageTable"
// import ResearchPublications from "./research-publications"
// import ResearchFunding from "./research-funding"
// import ResearchProjects from "./research-projects"
// import ConferenceProceedings from "./conference-proceedings"
// import EditorialWork from "./editorial-work"

export default function WeightageDistributionLayout() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Weightage Distribution</h1>
      
      <Tabs defaultValue="Hod" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="Hod">HoD's</TabsTrigger>
          <TabsTrigger value="other">Other Faculty</TabsTrigger>
        </TabsList>
        
        <TabsContent value="Hod">
          <Card className="p-4">
            <AdminHodWeightageTable/>
          </Card>
        </TabsContent>
        
        <TabsContent value="other">
          <Card className="p-4">
            <AdminFacultyWeightageTable/>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

