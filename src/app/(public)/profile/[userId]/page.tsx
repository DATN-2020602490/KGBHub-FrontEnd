import ProfileHeader from '@/app/(public)/profile/_components/profile-header'
import ProfileTabs from '@/app/(public)/profile/_components/profile-tabs'
import { userApiRequest } from '@/services/user.service'
import { cookies } from 'next/headers'

type Props = {
  params: { userId: string }
}

const ProfilePage = async ({ params }: Props) => {
  const { userId } = params
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload: profile } = await userApiRequest.get(userId, accessToken)
  return (
    <div>
      <ProfileHeader data={profile} />
      <ProfileTabs data={profile} />
    </div>
  )
}

export default ProfilePage
