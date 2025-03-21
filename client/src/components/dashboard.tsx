"use client"

import { useState } from "react"
import {
  ArrowDownToLine,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Upload,
  Users,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Mock data for salary slip uploads
const recentUploads = [
  {
    id: "SLU-001",
    date: "2025-03-15",
    month: "March 2025",
    employeeCount: 124,
    status: "Completed",
    downloadCount: 98,
  },
  {
    id: "SLU-002",
    date: "2025-02-15",
    month: "February 2025",
    employeeCount: 122,
    status: "Completed",
    downloadCount: 120,
  },
  {
    id: "SLU-003",
    date: "2025-01-15",
    month: "January 2025",
    employeeCount: 120,
    status: "Completed",
    downloadCount: 118,
  },
  {
    id: "SLU-004",
    date: "2024-12-15",
    month: "December 2024",
    employeeCount: 118,
    status: "Completed",
    downloadCount: 115,
  },
  {
    id: "SLU-005",
    date: "2024-11-15",
    month: "November 2024",
    employeeCount: 115,
    status: "Completed",
    downloadCount: 112,
  },
]

export function SalarySlipDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("all")

  // Filter uploads based on search term and month filter
  const filteredUploads = recentUploads.filter((upload) => {
    const matchesSearch =
      upload.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = monthFilter === "all" || upload.month.includes(monthFilter)
    return matchesSearch && matchesMonth
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">+12 from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,563</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+4 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Upload</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Apr 15</div>
            <p className="text-xs text-muted-foreground">In 25 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Recent Salary Slip Uploads</h3>
          <p className="text-sm text-muted-foreground">
            View and manage all salary slip uploads. Download generated slips for employees.
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Search by month or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-[300px]"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="January">January</SelectItem>
                  <SelectItem value="February">February</SelectItem>
                  <SelectItem value="March">March</SelectItem>
                  <SelectItem value="April">April</SelectItem>
                  <SelectItem value="May">May</SelectItem>
                  <SelectItem value="June">June</SelectItem>
                  <SelectItem value="July">July</SelectItem>
                  <SelectItem value="August">August</SelectItem>
                  <SelectItem value="September">September</SelectItem>
                  <SelectItem value="October">October</SelectItem>
                  <SelectItem value="November">November</SelectItem>
                  <SelectItem value="December">December</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-1">
                <FileText className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button className="gap-1">
                <Upload className="h-4 w-4" />
                <span>New Upload</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-t">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="hidden md:table-cell">Employees</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUploads.length > 0 ? (
                filteredUploads.map((upload) => (
                  <TableRow key={upload.id}>
                    <TableCell className="font-medium">{upload.id}</TableCell>
                    <TableCell>{new Date(upload.date).toLocaleDateString()}</TableCell>
                    <TableCell>{upload.month}</TableCell>
                    <TableCell className="hidden md:table-cell">{upload.employeeCount}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {upload.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{upload.downloadCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Download className="h-3 w-3" />
                          <span className="hidden sm:inline">Download All</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download Report</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Email to Employees</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete Upload</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredUploads.length}</strong> of <strong>{recentUploads.length}</strong> uploads
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the HR portal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">March 2025 Salary Slips Uploaded</p>
                  <p className="text-xs text-muted-foreground">124 employee slips generated successfully</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>2h ago</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Bulk Download - Finance Department</p>
                  <p className="text-xs text-muted-foreground">15 salary slips downloaded by Finance Manager</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>5h ago</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New Employee Added</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson added to Engineering department</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>1d ago</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Salary Structure Updated</p>
                  <p className="text-xs text-muted-foreground">Annual increment applied to all employees</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>2d ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for HR administrators</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="justify-start gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload New Salary Data</span>
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Download className="h-4 w-4" />
              <span>Download All March 2025 Slips</span>
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Users className="h-4 w-4" />
              <span>Manage Employee Directory</span>
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <FileText className="h-4 w-4" />
              <span>Generate Monthly Report</span>
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Settings className="h-4 w-4" />
              <span>Configure Salary Templates</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

