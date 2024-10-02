import React from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminSideBar() {
  const navigationItems = [
    "Personal Details",
    "Research Papers",
    "Student Guided",
    "Projects and Seminars",
    "Contribution Graph",

  ]

  return (
    <Card className="w-80 rounded-lg mt-5 overflow-hidden shadow-lg">
      <CardHeader className="bg-blue-500 py-3 px-4">
        <h2 className="text-xl font-bold text-white text-center">Navigation</h2>
      </CardHeader>
      <CardContent className="p-0">
        {navigationItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start rounded-none border-b border-gray-200 py-3 px-4 text-left font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
          >
            {item}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}