"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function AdminPointAllocationLayout() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Domain Points Management</h1>
      
      <Tabs defaultValue="publications" className="w-full">
        {/* Tab Triggers */}
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="conferences">Conferences</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="mentorship">Guidance & Mentorship</TabsTrigger>
          <TabsTrigger value="others">Other Activities</TabsTrigger>
        </TabsList>
        
        {/* Publications Tab Content */}
        <TabsContent value="publications">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Publications</h2>
            {/* Replace the following with your table or content component */}
            <div>
              <p>Content for managing Publications (e.g., Journals, Books, Chapters).</p>
            </div>
          </Card>
        </TabsContent>
        
        {/* Conferences Tab Content */}
        <TabsContent value="conferences">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Conferences</h2>
            {/* Replace the following with your table or content component */}
            <div>
              <p>Content for managing Conferences (e.g., International, National, Regional).</p>
            </div>
          </Card>
        </TabsContent>

        {/* Events Tab Content */}
        <TabsContent value="events">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Events</h2>
            {/* Replace the following with your table or content component */}
            <div>
              <p>Content for managing Events (e.g., Organizing, Speaking, Judging).</p>
            </div>
          </Card>
        </TabsContent>

        {/* Research Projects Tab Content */}
        <TabsContent value="projects">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Research Projects</h2>
            {/* Replace the following with your table or content component */}
            <div>
              <p>Content for managing Research Projects (e.g., Funded, Completed).</p>
            </div>
          </Card>
        </TabsContent>

        {/* Guidance & Mentorship Tab Content */}
        <TabsContent value="mentorship">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Guidance & Mentorship</h2>
            {/* Replace the following with your table or content component */}
            <div>
              <p>Content for managing Mentorship (e.g., PhD, M.Tech, Undergraduate).</p>
            </div>
          </Card>
        </TabsContent>

        {/* Other Activities Tab Content */}
        <TabsContent value="others">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Other Activities</h2>
            {/* Replace the following with your table or content component */}
            <div>
              <p>Content for managing other activities (e.g., Miscellaneous, STTPs).</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
