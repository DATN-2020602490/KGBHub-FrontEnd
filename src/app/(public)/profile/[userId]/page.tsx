'use client'
import ProfileHeader from '@/app/(public)/profile/_components/profile-header'
import ProfileTabs from '@/app/(public)/profile/_components/profile-tabs'
import { useUserQuery } from '@/queries/useUser'

type Props = {
  params: { userId: string }
}

const ProfilePage = ({ params }: Props) => {
  const { userId } = params
  const { data } = useUserQuery(userId)
  return (
    data?.payload && (
      <div>
        <ProfileHeader data={data?.payload} />
        <ProfileTabs data={data?.payload} />
      </div>
    )
  )
}

export default ProfilePage
