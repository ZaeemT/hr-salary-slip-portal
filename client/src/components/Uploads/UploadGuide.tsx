"use client"

import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function UploadGuidelines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          <span>Upload Guidelines</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-4">
          <h3 className="font-semibold mb-2">File Requirements</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Use Excel files (.xlsx, .xls) or CSV files (.csv)</li>
            <li>Maximum file size: 10MB</li>
            <li>First row should contain column headers</li>
            <li>Required columns: Employee ID, Name, Department, Position, Basic Salary, Allowances, Deductions</li>
            <li>Ensure all employee IDs are unique</li>
            <li>Numeric values should not contain currency symbols</li>
          </ul>
        </div>

        <div className="rounded-md bg-muted p-4">
          <h3 className="font-semibold mb-2">Processing Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Salary slips will be generated for all employees in the uploaded file</li>
            <li>The system will calculate net salary based on basic salary, allowances, and deductions</li>
            <li>Processing time depends on the number of employees</li>
            <li>You will be able to preview the data before final confirmation</li>
          </ul>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Need help?</AlertTitle>
          <AlertDescription>
            Download our{" "}
            <Button variant="link" className="h-auto p-0">
              sample template
            </Button>{" "}
            to ensure your data is formatted correctly.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

