import QUERY_KEYS from '@/constants/query-keys'
import { reportApiRequest } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

export const useReportSystem = (params: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REPORT_SYSTEM],
    queryFn: () => reportApiRequest.getSystem(params),
  })
}
