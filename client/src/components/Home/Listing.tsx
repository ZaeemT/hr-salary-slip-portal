import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Download, MoreHorizontal, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

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

export function Listing() {
    const [searchTerm, setSearchTerm] = useState("")
    const [monthFilter] = useState("all")
  
    // Filter uploads based on search term and month filter
    const filteredUploads = recentUploads.filter((upload) => {
      const matchesSearch =
        upload.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMonth = monthFilter === "all" || upload.month.includes(monthFilter)
      return matchesSearch && matchesMonth
    })
  
    return (
        <div className="rounded-lg border bg-card gap-6 py-3">
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
                        {/* <Select value={monthFilter} onValueChange={setMonthFilter}>
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
                        </Select> */}
                        {/* <Button variant="outline" className="gap-1">
                            <FileText className="h-4 w-4" />
                            <span>Export</span>
                        </Button> */}
                        <Link to="/upload">
                            <Button className="gap-2">
                                <Upload className="h-4 w-4" />
                                <span>New Upload</span>
                            </Button>
                        </Link>
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
    )
}