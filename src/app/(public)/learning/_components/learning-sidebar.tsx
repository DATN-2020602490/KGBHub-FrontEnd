'use client'
import ListPartsAccordion from '@/components/course/list-parts-accordion'
import { Part } from '@/models'

type Props = {
  data: Part[]
  isAuth?: boolean
}

const LearningSidebar = ({ data, isAuth = false }: Props) => {
  return (
    <div className="flex-1 sticky top-20 block h-full">
      <ListPartsAccordion
        data={data.sort((a, b) => a.partNumber - b.partNumber)}
      />
    </div>
  )
}

export default LearningSidebar
