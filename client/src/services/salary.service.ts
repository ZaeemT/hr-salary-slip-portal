import { apiUrl } from "@/utils/constants"
import { DELETE, GET, POST } from "./api.service.wrapper"


export const GetBatchListing = async () => {
    const response = await GET(apiUrl.batchListing);
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