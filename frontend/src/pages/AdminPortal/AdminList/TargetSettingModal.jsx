import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
// import { Calendar } from "../../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const targetCategories = [
  { id: 'publications', name: 'Publications', defaultTarget: 10, maxTarget: 20 },
  { id: 'events', name: 'Events', defaultTarget: 3, maxTarget: 10 },
  { id: 'seminars', name: 'Seminars', defaultTarget: 2, maxTarget: 5 },
  { id: 'sttp', name: 'STTP', defaultTarget: 15, maxTarget: 30 },
]

export function TargetSettingModal({ isOpen, onClose, department, hodName, onSaveTargets }) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [targets, setTargets] = useState(
    targetCategories.map(category => ({
      category: category.id,
      name: category.name,
      target: category.defaultTarget,
      title: '',
      description: '',
      date: category.id === 'events' ? new Date() : null,
      progress: 0
    }))
  )

  const handleTargetChange = (index, field, value) => {
    const newTargets = [...targets]
    newTargets[index][field] = value
    setTargets(newTargets)
  }

  const handleProgressChange = (index, value) => {
    const newTargets = [...targets]
    newTargets[index].progress = Math.min(100, Math.max(0, value))
    setTargets(newTargets)
  }

  const handleSave = () => {
    onSaveTargets(targets, selectedYear)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">Set Department Targets</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-500">{department} Department - HOD: {hodName}</h3>
          </div>
          <Tabs defaultValue={targetCategories[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {targetCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
              ))}
            </TabsList>
            {targetCategories.map((category, index) => (
              <TabsContent key={category.id} value={category.id} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${category.id}`}>Title:</Label>
                  <Input
                    id={`title-${category.id}`}
                    value={targets[index].title}
                    onChange={(e) => handleTargetChange(index, 'title', e.target.value)}
                    placeholder={`Enter ${category.name.toLowerCase()} title...`}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Label htmlFor={`target-${category.id}`} className="w-24">Target:</Label>
                  <Input
                    id={`target-${category.id}`}
                    type="number"
                    value={targets[index].target}
                    onChange={(e) => handleTargetChange(index, 'target', parseInt(e.target.value))}
                    min="0"
                    max={category.maxTarget}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">Max: {category.maxTarget}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${category.id}`}>Description:</Label>
                  <Input
                    id={`description-${category.id}`}
                    value={targets[index].description}
                    onChange={(e) => handleTargetChange(index, 'description', e.target.value)}
                    placeholder={`Describe the ${category.name.toLowerCase()} target...`}
                  />
                </div>
                {category.id === 'events' && (
  <div className="flex flex-col space-y-2">
    <Label htmlFor="date">Date:</Label>
    <Input
      type="date"
      id={`date-${category.id}`}
      value={targets[index].date ? format(targets[index].date, "yyyy-MM-dd") : ""}
      onChange={(e) => handleTargetChange(index, 'date', new Date(e.target.value))}
    />
  </div>
)}
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Targets</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Target Settings</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save these targets for the {department} Department for the year {selectedYear}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Summary of Targets:</h4>
                <ul className="list-disc pl-5">
                  {targets.map((target) => (
                    <li key={target.category}>
                      {target.name}: {target.title} - {target.target} 
                      {target.category === 'events' && target.date && ` (Date: ${format(target.date, "PPP")})`}
                    </li>
                  ))}
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

