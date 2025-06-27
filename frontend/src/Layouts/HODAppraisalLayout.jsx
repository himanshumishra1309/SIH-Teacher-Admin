"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import FacultyResearchTable from "@/table/Tables/Faculty/FacultyResearchTable"
import FacultyResearchFundingTable from "@/table/Tables/Faculty/FacultyResearchFundingTable"
import HODAppraisal from "@/pages/AdminPortal/AdminList/AdminHodData"
import HODProgressGraph from "@/pages/AdminPortal/AdminList/HODProgressGraph"
// import ResearchPublications from "./research-publications"
// import ResearchFunding from "./research-funding"
// import ResearchProjects from "./research-projects"
// import ConferenceProceedings from "./conference-proceedings"
// import EditorialWork from "./editorial-work"

export default function HODAppraisalLayout() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">HoD Appraisal</h1>
      
      <Tabs defaultValue="targets" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="targets">Set Department Targets</TabsTrigger>
          <TabsTrigger value="tracking">HoD Goal review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="targets">
          <Card className="p-4">
            <HODAppraisal/>
          </Card>
        </TabsContent>
        
        <TabsContent value="tracking">
          <Card className="p-4">
            <HODProgressGraph/>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

