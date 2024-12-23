import http from '@/lib/http'
import { Bookmark } from '@/models'

export const BookmarkApiRequest = {
  getList: () =>
    http.get<Bookmark[]>('-public/bookmarks', { cache: 'no-store' }),

  create: (body: any) => http.post('-public/bookmarks', body),

  delete: (bookmarkId: number) =>
    http.delete(`-public/bookmarks/${bookmarkId}`),
}
