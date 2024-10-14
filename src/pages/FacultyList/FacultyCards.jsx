import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from '@/components/ui/select';

  const branches = [
    { value: 'All', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Civil', label: 'Civil' },
    { value: 'Chemical', label: 'Chemical' },
    { value: 'Biotechnology', label: 'Biotechnology' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    // Add more options as needed
  ];
  
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
export default function FacultyCards() {

    const [facultyData, setFacultyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");

  // Fetch faculty data from the backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/faculty'); // Adjust this endpoint as needed
//         setFacultyData(response.data); // Save the fetched data into state
//       } catch (error) {
//         console.error('Error fetching faculty data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter the cards based on search and selected branch
//   const filteredFaculty = facultyData.filter((faculty) => {
//     const matchesSearchTerm = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) || faculty.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesBranch = selectedBranch === "All" || faculty.department === selectedBranch;
//     return matchesSearchTerm && matchesBranch;
//   });


  return (

    <>
        <div className="container mx-auto px-4 py-10">
      {/* Set ScrollArea with limited height for the cards */}

       {/* Search and Filter Section */}
       <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg w-1/2"
          placeholder="Search by Name or Employee Code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
  <Select>
  <SelectTrigger className="w-[150px]">
    <SelectValue placeholder="Sorting" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="ascending">Ascending</SelectItem>
    <SelectItem value="descending">Descending</SelectItem>
  </SelectContent>
</Select>
        {/* Dropdown for Department Filter */}
        <Select
      onValueChange={(value) => setSelectedBranch(value)}
      defaultValue={selectedBranch}
    >
      <SelectTrigger className="p-2 border border-gray-300 rounded-lg max-w-40">
        <SelectValue placeholder="Select a branch" />
      </SelectTrigger>
      <SelectContent className="max-h-40 overflow-y-auto">
        {branches.map((branch) => (
          <SelectItem key={branch.value} value={branch.value}>
            {branch.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>



                {/* Dropdown for Department Filter
                <select
          className="p-2 border border-gray-300 rounded-lg"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Mechanical">Mechanical</option>
          {/* Add more options based on available departments */}
        {/* </select> */} 

      </div>

      <ScrollArea className="h-[600px]"> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>

          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>



          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>

          
          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>


          
          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>


          
          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>


          
          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>


          
          <Card className="w-full bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg">
                <AvatarImage src={'/default-avatar.png'} alt={'Default Avatar'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">Dr. Vikul J. Pawar</CardTitle>
                <CardDescription className="text-sm text-gray-500">Professor</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-base">Department: Computer Science</h2>
              <h2 className="text-base">Employee Code: 123456</h2>
            </CardContent>
            <CardFooter>
              <Button variant="default">Check Profile</Button>
            </CardFooter>
          </Card>

        </div>
      </ScrollArea>
    </div>
    
    
    </>

  );
}
