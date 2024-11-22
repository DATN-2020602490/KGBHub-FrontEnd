'use client'
import Foooter from '@/components/layouts/Foooter'
import Header from '@/components/layouts/Header'
import { BookmarksProvider } from '@/contexts/bookmarks'
import { CartProvider } from '@/contexts/cart'
import { CourseProvider } from '@/contexts/course'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <CourseProvider>
      <CartProvider>
        <BookmarksProvider>
          <Header />
          <div className="container mx-auto">{children}</div>
          <Foooter />
        </BookmarksProvider>
      </CartProvider>
    </CourseProvider>
  )
}
