"use client"

import { useState } from "react"
import { Check, Loader2, UploadCloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet } from "lucide-react"

// Import custom components
import { UploadParameters } from "@/components/Uploads/UploadParameters"
import { FileUploadArea } from "@/components/Uploads/FileUploadArea"
import { FileList } from "@/components/Uploads/FileList"
import { UploadGuidelines } from "@/components/Uploads/UploadGuide"
import { DataPreview } from "@/components/Uploads/DataPreview"
import { DataSummary } from "@/components/Uploads/DataSummary"
import { UploadStatus } from "@/components/Uploads/UploadStatus"

// Import utility functions
import { isExcelFile } from "@/utils/fileCheck"

export function SalaryUploadForm() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString().padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments")
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  // Validate and add files
  const validateAndAddFiles = (newFiles: File[]) => {
    setErrorMessage(null)

    // Check if any files were selected
    if (newFiles.length === 0) {
      return
    }

    // Validate file type
    const invalidFiles = newFiles.filter((file) => !isExcelFile(file))
    if (invalidFiles.length > 0) {
      setErrorMessage(`Invalid file type. Please upload Excel files only (.xlsx, .xls, .csv).`)
      return
    }

    // Validate file size (max 10MB)
    const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setErrorMessage(`File size exceeds the 10MB limit.`)
      return
    }

    // Add valid files
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  // Remove a file
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  // Clear all files
  const clearFiles = () => {
    setFiles([])
    setErrorMessage(null)
    setUploadStatus("idle")
    setUploadProgress(0)
    setShowPreview(false)
  }

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setErrorMessage("Please select at least one file to upload.")
      return
    }

    setUploadStatus("uploading")
    setErrorMessage(null)

    try {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        setUploadProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          setShowPreview(true)
          setActiveTab("preview")
        }
      }, 200)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Failed to upload files. Please try again.")
      setShowPreview(false)
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "preview" && !showPreview) {
      return;
    }
    setActiveTab(value);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Upload Salary Data</h1>
        <p className="text-muted-foreground">
          Upload Excel files containing salary data for generating employee salary slips.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="preview" disabled={!showPreview || uploadStatus !== "success"}>
            Data Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                <span>Salary Data Upload</span>
              </CardTitle>
              <CardDescription>
                Upload Excel files containing employee salary information for the selected month.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload parameters */}
              <UploadParameters
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
              />

              {/* File upload area */}
              <FileUploadArea onFilesSelected={validateAndAddFiles} />

              {/* Upload status and errors */}
              <UploadStatus status={uploadStatus} progress={uploadProgress} errorMessage={errorMessage} />

              {/* File list */}
              <FileList files={files} onRemoveFile={removeFile} disabled={uploadStatus === "uploading"} />
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button
                variant="outline"
                onClick={clearFiles}
                disabled={files.length === 0 || uploadStatus === "uploading"}
              >
                Clear All
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || uploadStatus === "uploading" || uploadStatus === "success"}
                className="gap-2"
              >
                {uploadStatus === "uploading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : uploadStatus === "success" ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Uploaded</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Files</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Upload guidelines */}
          <UploadGuidelines />
        </TabsContent>

        <TabsContent value="preview" className="mt-4 space-y-6">
          {showPreview && uploadStatus === "success" && (
            <>
              <DataPreview
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedDepartment={selectedDepartment}
                onBack={() => setActiveTab("upload")}
              />
              <DataSummary />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

