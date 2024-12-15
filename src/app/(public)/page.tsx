'use client'
import { Heading } from '@/components/common/heading'
import Intro from '@/components/homePage/intro'
import BestSellerSection from '@/components/homePage/best-seller-section'
import RecentCourseSection from '@/components/homePage/recent-course-section'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-10 sm:mt-[120px] space-y-8">
      <Intro />

      {/* <Link href="/promotions" className="w-full">
        <Image
          src="/images/get-promotion-banner-3.webp"
          alt=""
          classNames={{
            wrapper: '!max-w-full w-[680px] mx-auto animate-drip-expand',
          }}
          className="w-full aspect-[21/9] object-cover animate-drip-expand"
        />
      </Link> */}
      <div className="w-full space-y-4">
        <Heading title="Best selling courses" />
        <BestSellerSection />
      </div>
      <div className="space-y-4 w-full">
        <Heading title="Recent courses" />
        <RecentCourseSection />
      </div>
    </main>
  )
}
