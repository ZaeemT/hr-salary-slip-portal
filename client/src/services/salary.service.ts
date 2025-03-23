import { apiUrl } from "@/utils/constants"
import { GET } from "./api.service.wrapper"


export const GetBatchListing = async () => {
    const response = await GET(apiUrl.batchListing);
    return response;
}