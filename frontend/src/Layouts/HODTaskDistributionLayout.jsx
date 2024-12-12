"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import HODProgressGraph from "@/pages/AdminPortal/AdminList/HODProgressGraph";
import ResearchDistributionPage from "@/pages/AdminPortal/AdminList/HODTaskDistribution/Pages/ResearchDistributionPage";
import EventDistributionPage from "@/pages/AdminPortal/AdminList/HODTaskDistribution/Pages/EventDistributionPage";
import SeminarDistributionPage from "@/pages/AdminPortal/AdminList/HODTaskDistribution/Pages/SemianardistributionPage";
import STTPDistributionPage from "@/pages/AdminPortal/AdminList/HODTaskDistribution/Pages/STTPDistributionPage";

export default function HODTaskDistributionLayout() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">HoD Appraisal</h1>

      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="seminars">Seminars</TabsTrigger>
          <TabsTrigger value="sttp">STTP</TabsTrigger>
        </TabsList>

        {/* Research Tab */}
        <TabsContent value="research">
          <Card className="p-4">
            <div className="flex justify-end mb-4">
              <ResearchDistributionPage/>
            </div>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card className="p-4">
            <EventDistributionPage/>
          </Card>
        </TabsContent>

        {/* Seminars Tab */}
        <TabsContent value="seminars">
          <Card className="p-4">
            <SeminarDistributionPage/>
          </Card>
        </TabsContent>

        {/* STTP Tab */}
        <TabsContent value="sttp">
          <Card className="p-4">
            <STTPDistributionPage/>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Popup Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Task Assignment</DialogTitle>
          </DialogHeader>
          <ResearchDistributionPage />
        </DialogContent>
      </Dialog>
    </div>
  );
}
