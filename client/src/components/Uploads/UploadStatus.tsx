"use client"

import { AlertCircle, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UploadStatusProps {
  status: "idle" | "uploading" | "success" | "error"
  progress: number
  errorMessage: string | null
}

export function UploadStatus({ status, progress, errorMessage }: UploadStatusProps) {
  return (
    <div className="space-y-4">
      {/* Error message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Upload progress */}
      {status === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Uploading...</Label>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Upload success message */}
      {status === "success" && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Files uploaded successfully. You can now preview the data.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

