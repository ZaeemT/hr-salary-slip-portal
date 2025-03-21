"use client"

import { ArrowRight, FileSpreadsheet, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data for preview
const samplePreviewData = [
  {
    id: "EMP001",
    name: "John Doe",
    department: "Engineering",
    position: "Senior Developer",
    basicSalary: 5000,
    allowances: 1200,
    deductions: 800,
    netSalary: 5400,
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    department: "Marketing",
    position: "Marketing Manager",
    basicSalary: 4500,
    allowances: 1000,
    deductions: 700,
    netSalary: 4800,
  },
  {
    id: "EMP003",
    name: "Robert Johnson",
    department: "Finance",
    position: "Financial Analyst",
    basicSalary: 4200,
    allowances: 900,
    deductions: 650,
    netSalary: 4450,
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    department: "Human Resources",
    position: "HR Specialist",
    basicSalary: 3800,
    allowances: 850,
    deductions: 600,
    netSalary: 4050,
  },
  {
    id: "EMP005",
    name: "Michael Wilson",
    department: "Sales",
    position: "Sales Representative",
    basicSalary: 3500,
    allowances: 1500,
    deductions: 550,
    netSalary: 4450,
  },
]

interface DataPreviewProps {
  selectedMonth: string
  selectedYear: string
  selectedDepartment: string
  onBack: () => void
}

export function DataPreview({ selectedMonth, selectedYear, selectedDepartment, onBack }: DataPreviewProps) {
  // Get month label from value
  const getMonthLabel = (value: string) => {
    const months = [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ]
    return months.find((m) => m.value === value)?.label || value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>Data Preview</span>
        </CardTitle>
        <CardDescription>Review the uploaded salary data before generating salary slips.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {getMonthLabel(selectedMonth)} {selectedYear}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {selectedDepartment}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {samplePreviewData.length} Employees
            </Badge>
          </div>

          <Separator />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Position</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Allowances</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Deductions</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samplePreviewData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.position}</TableCell>
                    <TableCell className="text-right">${employee.basicSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      ${employee.allowances.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      ${employee.deductions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">${employee.netSalary.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Data Validation</AlertTitle>
            <AlertDescription>
              Please review the data carefully. Once you proceed, salary slips will be generated based on this
              information.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={onBack}>
          Back to Upload
        </Button>
        <Button className="gap-2">
          <ArrowRight className="h-4 w-4" />
          <span>Generate Salary Slips</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

