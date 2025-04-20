import { axios } from "./axios"

interface FetchAiSuggestionPayload {
    startDate: string
    endDate: string
}
export const fetchAiSuggestion = async(payload: FetchAiSuggestionPayload) => {
    return await axios.post(`/ai/smart-suggestions`,payload)
}