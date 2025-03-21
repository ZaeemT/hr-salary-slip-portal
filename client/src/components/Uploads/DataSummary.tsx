import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export function DataSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          <span>Data Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Employees</div>
            <div className="mt-1 text-2xl font-bold">{samplePreviewData.length}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Basic Salary</div>
            <div className="mt-1 text-2xl font-bold">
              ${samplePreviewData.reduce((sum, emp) => sum + emp.basicSalary, 0).toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Allowances</div>
            <div className="mt-1 text-2xl font-bold">
              ${samplePreviewData.reduce((sum, emp) => sum + emp.allowances, 0).toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Net Salary</div>
            <div className="mt-1 text-2xl font-bold">
              ${samplePreviewData.reduce((sum, emp) => sum + emp.netSalary, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

