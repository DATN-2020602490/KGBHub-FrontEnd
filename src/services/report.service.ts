import http from '@/lib/http'
import { ReportTable } from '@/models'

export const reportApiRequest = {
  revenue: () =>
    http.get(
      '/reports/total?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-04T03:20:29.444Z&groupBy=month'
    ),

  topAuthors: (params?: string) =>
    http.get<ReportTable>(`/reports/author${params}`),

  topCourses: () => http.get('/reports/courses/stars'),

  getSystem: (params?: string) =>
    http.get<ReportTable>('/reports/system?' + params),
  getAuthor: (params?: string) =>
    http.get<ReportTable>(`/reports/author?${params}`),
}
