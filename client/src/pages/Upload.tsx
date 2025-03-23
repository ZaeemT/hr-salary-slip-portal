import { useState } from "react"
import { Check, Loader2, UploadCloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
import { getCurrentMonth } from "@/utils/getMonth"
import { ParseExcel, SendSlips } from "@/services/salary.service"
import { useToast } from "@/hooks/use-toast"

export function SalaryUploadForm() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments")
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [previewData, setPreviewData] = useState<any>(null)
  const { toast } = useToast()
  const [processingSlips, setProcessingSlips] = useState(false)
  const navigate = useNavigate()

  // Validate and add files
  const validateAndAddFiles = (newFiles: File[]) => {
    setErrorMessage(null)
    
    // Only take the first file
    const file = newFiles[0]
    
    if (!file) return
    
    if (!isExcelFile(file)) {
      setErrorMessage(`Invalid file type. Please upload Excel files only (.xlsx, .xls, .csv).`)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`File size exceeds the 10MB limit.`)
      return
    }

    // Replace existing files with new file
    setFiles([file])
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
    setShowPreview(false)
  }

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setErrorMessage("Please select a file to upload.")
      return
    }

    setUploadStatus("uploading")
    setErrorMessage(null)

    try {
      const file = files[0]
      const response = await ParseExcel(selectedMonth, selectedYear, file)
      
      setPreviewData(response)
      setUploadStatus("success")
      setShowPreview(true)
      setActiveTab("preview")
    } catch (error: any) {
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to upload file. Please try again.")
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

  const handleGenerateSlips = async (batchId: string) => {
    setProcessingSlips(true)
    try {
      const response: any = await SendSlips(batchId)
      if (response.status === 'success') {
        toast({
          title: "Success",
          description: "Salary slips have been generated and sent to employees.",
        })

        navigate('/home')
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to generate salary slips",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate salary slips",
        variant: "destructive",
      })
    } finally {
      setProcessingSlips(false)
    }
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
              
              {/* Render upload status */}
              <UploadStatus status={uploadStatus} errorMessage={errorMessage} />

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
          {showPreview && uploadStatus === "success" && previewData && (
            <>
              <DataPreview
                data={previewData}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedDepartment={selectedDepartment}
                onBack={() => setActiveTab("upload")}
                onGenerateSlips={handleGenerateSlips}
                processing={processingSlips}
              />
              <DataSummary data={previewData}/>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

