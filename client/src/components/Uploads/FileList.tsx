"use client"

import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FileListProps {
  files: File[]
  onRemoveFile: (index: number) => void
  disabled?: boolean
}

export function FileList({ files, onRemoveFile, disabled = false }: FileListProps) {
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <Label>Selected Files</Label>
      <div className="rounded-md border">
        <div className="divide-y">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemoveFile(index)} disabled={disabled}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

