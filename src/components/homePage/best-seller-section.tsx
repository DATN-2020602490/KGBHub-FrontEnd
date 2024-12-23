'use client'

import CourseCard, { CourseCardSkeleton } from '@/components/course/course-card'
import NavigationSwiper from '@/components/navigation-swiper'
import { useListCoursePublic } from '@/queries/useCourse'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const BestSellerSection = () => {
  const { data, isLoading } = useListCoursePublic('?isBestSeller=true&limit=8')
  const bestSellers = data?.payload
  console.log(data)
  return (
    <div className="slider-cards relative">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        grabCursor={true}
        spaceBetween={16}
        slidesPerView="auto"
      >
        {isLoading
          ? Array(5)
              .fill(null)
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <CourseCardSkeleton />
                </SwiperSlide>
              ))
          : bestSellers?.map((course: any) => (
              <SwiperSlide key={course.id}>
                <CourseCard data={course} />
              </SwiperSlide>
            ))}
        <NavigationSwiper />
      </Swiper>
    </div>
  )
}

export default BestSellerSection
