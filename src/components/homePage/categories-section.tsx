import PenNibIcon from '@/components/icons/PenNibIcon'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const CategoriesSection = () => {
  return (
    <div className="w-full">
      <h3>Most Popular Category</h3>
      <p>
        Various versions have evolved over the years, sometimes by accident,
      </p>
      <div className="grid grid-cols-4 gap-y-4 gap-x-8 w-full">
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
        <Category icon={<PenNibIcon />} name="Design" href="/design" />
      </div>
    </div>
  )
}

export default CategoriesSection

type CategoryProps = {
  icon: JSX.Element
  name: string
  href: string
}

const Category = ({ icon, name, href }: CategoryProps) => {
  return (
    <Link
      href={href}
      className="flex justify-between px-4 py-2 group border-2 items-center rounded-md cursor-pointer gap-x-4"
    >
      <div className="flex gap-2 items-center">
        {icon}
        {name}
      </div>
      <ArrowUpRight
        size={18}
        className="ml-auto opacity-0 group-hover:opacity-100 transition-all"
      />
    </Link>
  )
}
