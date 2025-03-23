import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


interface DataSummaryProps {
  data: any
}

export function DataSummary({ data }: DataSummaryProps) {
  const { details } = data

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
            <div className="mt-1 text-2xl font-bold">{details.records_processed}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Basic Salary</div>
            <div className="mt-1 text-2xl font-bold">
              ${details?.total_basic_salary.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Allowances</div>
            <div className="mt-1 text-2xl font-bold">
              ${details?.total_allowances}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Net Salary</div>
            <div className="mt-1 text-2xl font-bold">
              ${details?.total_net_salary}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

