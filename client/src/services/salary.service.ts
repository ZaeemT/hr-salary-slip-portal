import { apiUrl } from "@/utils/constants"
import { DELETE, GET, POST } from "./api.service.wrapper"


export const GetBatchListing = async () => {
    const response = await GET(apiUrl.batchListing);
    return response;
}

export const ParseExcel = async (month: string, year: string, file: File) => {
    const config = {
        headers: {
            "content-type": "multipart/form-data",
        },
    };

    const formData = new FormData();
    formData.append('month', month);
    formData.append('year', year);
    formData.append('file', file);
    
    const response = await POST(apiUrl.excelUpload, formData, config);
    return response;
}

export const SendSlips = async (batch_id: string) => {
    const response = await POST(apiUrl.processSlips + '/' + batch_id);
    return response;
}

export const DeleteBatch = async (batch_id: string) => {
    const response = await DELETE(apiUrl.removeBatch, batch_id);
    return response;
}