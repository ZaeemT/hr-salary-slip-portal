import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MoreHorizontal, Upload, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface BatchData {
  batch_id: string;
  file_name: string;
  upload_time: { $date: string };
  record_count: number;
  month: string;
  year: string;
  status: 'pending' | 'completed' | 'failed' | 'processing';
}

interface ListingProps {
  batches: BatchData[];
  loading: boolean;
  onDeleteBatch: (batchId: string) => Promise<void>;
  onSendSlips: (batchId: string) => Promise<void>;
}

export function Listing({ batches, loading, onDeleteBatch, onSendSlips }: ListingProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [batchToDelete, setBatchToDelete] = useState<string | null>(null)

    const handleDelete = async (batchId: string) => {
        setBatchToDelete(batchId);
    };

    const confirmDelete = async () => {
        if (batchToDelete) {
            await onDeleteBatch(batchToDelete);
            setBatchToDelete(null);
        }
    };

    // const [monthFilter] = useState("all")
  
    // Filter batches based on search term
    const filteredBatches = batches.filter((batch) => {
      const searchString = `${batch.month} ${batch.year} ${batch.batch_id}`.toLowerCase()
      return searchString.includes(searchTerm.toLowerCase())
    })

    const                                                                               renderDropdownContent = (batch: BatchData) => (
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                onClick={() => onSendSlips(batch.batch_id)}
                disabled={batch.status !== 'pending'}
            >
                Email to Employees
            </DropdownMenuItem>
            <DropdownMenuItem 
                onClick={() => handleDelete(batch.batch_id)}
                className="text-destructive"
                disabled={batch.status === 'processing'}
            >
                Delete Batch
            </DropdownMenuItem>
        </DropdownMenuContent>
    );

    return (
        <div className="rounded-lg border bg-card gap-6 py-3">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Recent Salary Slip Uploads</h3>
                <p className="text-sm text-muted-foreground">
                    View and manage all salary slip uploads.
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
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Upload Date</TableHead>
                            <TableHead>Month/Year</TableHead>
                            <TableHead className="hidden md:table-cell">Employee Counts</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Loading batches...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredBatches.length > 0 ? (
                            filteredBatches.map((batch) => (
                                <TableRow key={batch.batch_id}>
                                    <TableCell className="font-medium">
                                        {batch.batch_id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        {new Date(batch.upload_time.$date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{`${batch.month} ${batch.year}`}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {batch.record_count}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "bg-yellow-50 text-yellow-700",
                                                batch.status === 'processing' && "bg-blue-50 text-blue-700",
                                                batch.status === 'completed' && "bg-green-50 text-green-700",
                                                batch.status === 'failed' && "bg-red-50 text-red-700"
                                            )}
                                        >
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 gap-1"
                                                disabled={batch.status === 'pending'}
                                            >
                                                <Download className="h-3 w-3" />
                                                <span className="hidden sm:inline">Download All</span>
                                            </Button> */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">More options</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                {renderDropdownContent(batch)}
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No batches found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing <strong>{filteredBatches.length}</strong> of <strong>{batches.length}</strong> batches
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
            <AlertDialog open={!!batchToDelete} onOpenChange={() => setBatchToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            batch and all its associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}