"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import FacultyResearchFundingTable from "@/table/Tables/Faculty/FacultyResearchFundingTable"
import FacultySeminarsConductedTable from "@/table/Tables/Faculty/FacultySeminarsConductedTable"
import FacultySeminarsAttendedTable from "@/table/Tables/Faculty/FacultySeminarsAttendedTable"
// import ResearchPublications from "./research-publications"
// import ResearchFunding from "./research-funding"
// import ResearchProjects from "./research-projects"
// import ConferenceProceedings from "./conference-proceedings"
// import EditorialWork from "./editorial-work"

export default function SeminarLayout() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Seminars</h1>
      
      <Tabs defaultValue="conducted" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="conducted">Seminars Conducted</TabsTrigger>
          <TabsTrigger value="attended">Seminars Attended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conducted">
          <Card className="p-4">
            <FacultySeminarsConductedTable/>
          </Card>
        </TabsContent>
        
        <TabsContent value="attended">
          <Card className="p-4">
            <FacultySeminarsAttendedTable/>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

