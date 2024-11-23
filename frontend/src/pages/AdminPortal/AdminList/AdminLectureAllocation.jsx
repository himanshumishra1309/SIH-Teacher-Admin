// File: src/pages/LectureAllocationPage.jsx
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { toast } from "@/components/ui/hooks/use-toast";
import axios from "axios";
import DrawerComponent from "@/Forms/AddEntry/DrawerComponent";
import DeleteDialog from "@/table/DeleteDialog";
import AdminLectureAllocationTable from "@/table/Tables/Admin/AdminLectureAllocationTable";
import { columnDef } from "../../../table/Tables/Columns/AdminLectureAllocationColumn";

export default function AdminLectureAllocationPage() {
    const [course, setCourse] = useState("");
    const [department, setDepartment] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [allocations, setAllocations] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [rowToDelete, setRowToDelete] = useState(null);
  
    useEffect(() => {
      if (course && department && academicYear) {
        fetchAllocations();
      }
    }, [course, department, academicYear]);
  
    const fetchAllocations = async () => {
      try {
        const response = await axios.get("/api/allocations", {
          params: { course, department, academicYear }
        });
        setAllocations(response.data);
      } catch (error) {
        console.error("Error fetching allocations:", error);
        toast({
          title: "Error",
          description: "Failed to fetch allocations",
          variant: "destructive",
        });
      }
    };
  
    const handleAddAllocation = async (formData) => {
      try {
        const response = await axios.post("/api/allocations", formData);
        setAllocations([...allocations, response.data]);
        setIsDrawerOpen(false);
        toast({
          title: "Success",
          description: "New allocation added successfully",
        });
      } catch (error) {
        console.error("Error adding allocation:", error);
        toast({
          title: "Error",
          description: "Failed to add allocation",
          variant: "destructive",
        });
      }
    };
  
    const handleEditAllocation = async (formData) => {
      try {
        const response = await axios.put(`/api/allocations/${formData.get('id')}`, formData);
        setAllocations(allocations.map(a => a.id === response.data.id ? response.data : a));
        setIsDrawerOpen(false);
        toast({
          title: "Success",
          description: "Allocation updated successfully",
        });
      } catch (error) {
        console.error("Error updating allocation:", error);
        toast({
          title: "Error",
          description: "Failed to update allocation",
          variant: "destructive",
        });
      }
    };
  
    const handleDeleteAllocation = async () => {
      try {
        await axios.delete(`/api/allocations/${rowToDelete.id}`);
        setAllocations(allocations.filter(a => a.id !== rowToDelete.id));
        setIsDeleteDialogOpen(false);
        setRowToDelete(null);
        toast({
          title: "Success",
          description: "Allocation deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting allocation:", error);
        toast({
          title: "Error",
          description: "Failed to delete allocation",
          variant: "destructive",
        });
      }
    };
  
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lecture Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <Select onValueChange={setCourse} value={course}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btech">B.Tech</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                  <SelectItem value="phd">Ph.D</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setDepartment} value={department}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="ece">Electronics</SelectItem>
                  <SelectItem value="me">Mechanical</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setAcademicYear} value={academicYear}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Allocation
            </Button>
          </div>
  
          {course && department && academicYear ? (
            <AdminLectureAllocationTable
              data={allocations}
              onEdit={(row) => {
                setRowToEdit(row);
                setIsDrawerOpen(true);
              }}
              onDelete={(id) => {
                setRowToDelete(allocations.find(a => a.id === id));
                setIsDeleteDialogOpen(true);
              }}
            />
          ) : (
            <p className="text-center text-gray-500">Please select all filters to view allocations</p>
          )}
  
          <DrawerComponent
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false);
              setRowToEdit(null);
            }}
            onSubmit={rowToEdit ? handleEditAllocation : handleAddAllocation}
            columns={columnDef}
            rowData={rowToEdit}
          />
  
          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteAllocation}
            rowData={rowToDelete}
          />
        </CardContent>
      </Card>
    );
  }