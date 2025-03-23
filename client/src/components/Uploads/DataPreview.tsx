"use client"

import { ArrowRight, FileSpreadsheet, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SalaryRecord {
  employee_id: string
  name: string
  email: string
  department: string
  position: string
  basic_salary: number
  allowances: number
  deductions: number
  net_salary: number
  status: string
}

interface PreviewData {
  status: string
  message: string
  details: {
    month: string
    year: string
    records_processed: number
    total_basic_salary: number
    total_allowances: number
    total_net_salary: number
    batch_id: string
    salary_records: SalaryRecord[]
  }
}

interface DataPreviewProps {
  data: PreviewData
  selectedMonth: string
  selectedYear: string
  selectedDepartment: string
  onBack: () => void
}

export function DataPreview({ data, selectedMonth, selectedYear, selectedDepartment, onBack }: DataPreviewProps) {
  console.log("DataPreview received data:", data) // Debug log

  if (!data?.details) {
    console.log("No details found in data") // Debug log
    return null
  }

  const { details } = data
  
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
              {details.month || selectedMonth} {details.year || selectedYear}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {selectedDepartment}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {details.records_processed} Employees
            </Badge>
            {/* <Badge variant="outline" className="bg-primary/10 text-primary">
              Total Net Salary: ${details.total_net_salary.toLocaleString()}
            </Badge> */}
          </div>

          <Separator />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Position</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Allowances</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Deductions</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.salary_records.map((employee) => (
                  <TableRow key={employee.employee_id}>
                    <TableCell className="font-medium">{employee.employee_id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.position}</TableCell>
                    <TableCell className="text-right">${employee.basic_salary.toLocaleString()}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      ${employee.allowances.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      ${employee.deductions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">${employee.net_salary.toLocaleString()}</TableCell>
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

