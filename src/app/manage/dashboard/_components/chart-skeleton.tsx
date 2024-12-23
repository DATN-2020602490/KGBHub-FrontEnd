'use client'

import { Spinner } from '@nextui-org/react'

const ChartSkeleton = () => {
  return (
    <div className="h-[400px] w-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default ChartSkeleton
