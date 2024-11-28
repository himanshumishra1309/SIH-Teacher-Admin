"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import FacultyResearchTable from "@/table/Tables/Faculty/FacultyResearchTable"
import FacultyResearchFundingTable from "@/table/Tables/Faculty/FacultyResearchFundingTable"
// import ResearchPublications from "./research-publications"
// import ResearchFunding from "./research-funding"
// import ResearchProjects from "./research-projects"
// import ConferenceProceedings from "./conference-proceedings"
// import EditorialWork from "./editorial-work"

export default function ResearchLayout() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Research & Publications</h1>
      
      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="funding">Research Funding</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="proceedings">Conference Proceedings</TabsTrigger>
          <TabsTrigger value="editorial">Editorial Work</TabsTrigger>
        </TabsList>
        
        <TabsContent value="publications">
          <Card className="p-4">
            <FacultyResearchTable/>
          </Card>
        </TabsContent>
        
        <TabsContent value="funding">
          <Card className="p-4">
            <FacultyResearchFundingTable/>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card className="p-4">
            {/* <ResearchProjects /> */}
          </Card>
        </TabsContent>
        
        <TabsContent value="proceedings">
          <Card className="p-4">
            {/* <ConferenceProceedings /> */}
          </Card>
        </TabsContent>
        
        <TabsContent value="editorial">
          <Card className="p-4">
            {/* <EditorialWork /> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

