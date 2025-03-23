import { apiUrl } from "@/utils/constants"
import { DELETE, GET } from "./api.service.wrapper"


export const GetBatchListing = async () => {
    const response = await GET(apiUrl.batchListing);
    return response;
}

export const DeleteBatch = async (batch_id: string) => {
    const response = await DELETE(apiUrl.removeBatch, batch_id);
    return response;
}