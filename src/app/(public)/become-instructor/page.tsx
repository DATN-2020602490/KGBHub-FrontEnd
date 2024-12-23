'use client'

import BecomeInstructorForm from '@/app/(public)/become-instructor/_components/become-instructor-form'
import StepsBecomeInstructor from '@/app/(public)/become-instructor/_components/steps-become-instructor'
import { useMyUpRoleRequest } from '@/queries/useUser'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'

const BecomeInstructorPage = () => {
  const { data } = useMyUpRoleRequest()

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="space-y-4">
          <h3 className="font-bold text-4xl">Become an Instuctor</h3>
          <p>
            Become an instructor & start teaching with 26k certified
            instructors. Create a success story with 67.1k Students — Grow
            yourself with 71 countries.
          </p>
          <Button color="primary" as={Link} href="#register-instructor">
            Get Started
          </Button>
        </div>
        <div className="w-1/3">
          <Image
            src="/images/model-2.png"
            alt=""
            width={500}
            height={500}
            className="object-cover"
          />
        </div>
      </div>

      <StepsBecomeInstructor />
      <div className="py-8">
        <div>
          <h3 className="font-bold text-4xl text-center">
            Become Instructor Form
          </h3>
        </div>
        <BecomeInstructorForm data={data ? data.payload[0] : undefined} />
      </div>
    </>
  )
}

export default BecomeInstructorPage
