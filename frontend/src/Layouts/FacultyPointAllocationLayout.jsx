"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import FacultyResearchProjectsDomainTable from "../table/Tables/Domain/Column/FacultyResearchProjectsDomainTable";
import FacultyGuidanceDomainTable from "../table/Tables/Domain/Column/FacultyGuidanceDomainTable";
import FacultyOtherDomainTable from "../table/Tables/Domain/Column/FacultyOtherDomainTable";
import FacultyEventsDomainTable from "../table/Tables/Domain/Column/FacultyEventsDomainTable";
import FacultyConferencesDomainTable from "../table/Tables/Domain/Column/FacultyConferencesDomainTable";
import FacultyPublicationTable from "../table/Tables/Domain/FacultyPublicationDomainTable";
import FacultyDomainSttpTable from "../table/Tables/Domain/Column/FacultyDomainSttpTable";

export default function FacultyPointAllocationLayout() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Domain Points Management
      </h1>

      <Tabs defaultValue="publications" className="w-full">
        {/* Tab Triggers */}
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="publications">Publications</TabsTrigger>
          {/* <TabsTrigger value="conferences">Conferences</TabsTrigger> */}
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="sttp">STTP</TabsTrigger>

          <TabsTrigger value="mentorship">Guidance & Mentorship</TabsTrigger>
          <TabsTrigger value="others">Other Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="publications">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Publications</h2>
              <FacultyPublicationTable />
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="conferences">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Conferences</h2>
              <FacultyConferencesDomainTable />
            </Card>
          </motion.div>
        </TabsContent>

        {/* Events Tab Content */}
        <TabsContent value="events">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Events</h2>
              {/* Replace the following with your table or content component */}
              <div>
                <p>
                  Content for managing Events (e.g., Organizing, Speaking,
                  Judging).
                </p>
                <FacultyEventsDomainTable />
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Research Projects Tab Content */}
        <TabsContent value="projects">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Research Projects</h2>
              {/* Replace the following with your table or content component */}
              <div>
                <p>
                  Content for managing Research Projects (e.g., Funded,
                  Completed).
                </p>
                <FacultyResearchProjectsDomainTable />
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="sttp">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">STTP</h2>
              {/* Replace the following with your table or content component */}
              <div>
                <FacultyDomainSttpTable />
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Guidance & Mentorship Tab Content */}
        <TabsContent value="mentorship">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                Guidance & Mentorship
              </h2>
              {/* Replace the following with your table or content component */}
              <div>
                <p>
                  Content for managing Mentorship (e.g., PhD, M.Tech,
                  Undergraduate).
                </p>
                <FacultyGuidanceDomainTable />
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Other Activities Tab Content */}
        <TabsContent value="others">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Other Activities</h2>
              {/* Replace the following with your table or content component */}
              <div>
                <p>
                  Content for managing other activities (e.g., Miscellaneous,
                  STTPs).
                </p>
                <FacultyOtherDomainTable />
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
