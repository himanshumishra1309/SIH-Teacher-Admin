'use client'

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Users } from 'lucide-react'

const departments = [
  { value: "All", label: "All Departments" },
  { value: "CSE", label: "Computer Science" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
]

export default function Component() {
  const [facultyData, setFacultyData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [sortOrder, setSortOrder] = useState("ascending")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const token = sessionStorage.getItem("adminAccessToken")
        const response = await axios.get("http://localhost:6005/api/v1/admins/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFacultyData(response.data.data.teachers)
      } catch (error) {
        console.error("Error fetching faculty data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredFaculty = facultyData
    .filter((faculty) => {
      const matchesSearch =
        faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === "All" || faculty.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })
    .sort((a, b) => (sortOrder === "ascending" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Profiles</h1>
          <p className="mt-2 text-gray-600">Manage and view faculty information</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-10"
              placeholder="Search by Name or Employee Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ascending">A-Z</SelectItem>
              <SelectItem value="descending">Z-A</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedDepartment} defaultValue={selectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <Users className="h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">No faculty members found</p>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFaculty.map((faculty) => (
              <Card key={faculty._id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={faculty.avatarUrl} alt={faculty.name} />
                    <AvatarFallback className="bg-blue-100 text-lg font-medium text-blue-600">
                      {faculty.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">{faculty.name}</CardTitle>
                    <p className="text-sm font-medium text-blue-600">{faculty.department}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">ID:</span>
                      <span className="ml-2">{faculty.employee_code}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Email:</span>
                      <span className="ml-2 truncate">{faculty.email}</span>
                    </div>
                    <Link to={`/admin-info/${faculty._id}`} className="mt-4 block">
                      <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}