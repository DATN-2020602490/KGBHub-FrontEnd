'use client'
import { Heading } from '@/components/common/heading'
import { generateMediaLink } from '@/lib/utils'
import { useCampaigns, useJoinCampaignMutation } from '@/queries/useCampaigns'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import { toast } from 'react-toastify'

export default function PromotionsPage() {
  const { data, isLoading } = useCampaigns()
  const joinCampaignMutation = useJoinCampaignMutation()
  const claimPromotion = async (campaignId: string) => {
    try {
      await joinCampaignMutation.mutateAsync(campaignId)
      toast.success('Claimed promotion successfully!')
    } catch (error) {
      console.log(error)
      toast.error('Could not claim promotion!')
    }
  }
  console.log(data)
  return (
    <>
      <Heading title="Promotions" className="mb-6" />
      <div className="mb-8 text-sm">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime autem
          eum, dolore impedit, ullam asperiores tempora distinctio non id eos
          quo cum ipsum quaerat quia sequi voluptates vitae voluptate, obcaecati
          esse veniam voluptatibus expedita laudantium! Quaerat optio temporibus
          unde voluptatibus possimus vero numquam atque! Ad rem reprehenderit
          nesciunt rerum iste?
        </p>
        <Image
          src="/images/get-promotion-banner-3.webp"
          alt="Promotion"
          width={768}
          height={500}
          className="aspect-[21/9] object-cover w-[768px] mx-auto rounded-md my-6"
        />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
          voluptatem veniam rerum atque ducimus provident magnam perferendis!
          Quasi aperiam vel rem voluptatibus ratione perspiciatis deleniti velit
          sunt! Laudantium obcaecati ipsam mollitia ex maxime, adipisci libero
          blanditiis sit cupiditate, saepe alias? Veritatis dolores, consectetur
          voluptates adipisci asperiores commodi dolore non harum obcaecati
          nostrum velit repudiandae perferendis quisquam pariatur unde,
          necessitatibus neque alias magni et. Doloremque mollitia laborum
          debitis tenetur eum ullam quidem unde adipisci dolor enim illum soluta
          assumenda neque rem expedita, fugit vero molestias blanditiis
          quibusdam eius, voluptatum exercitationem beatae pariatur recusandae.
          Quis ducimus repudiandae distinctio laudantium? Animi, numquam
          nostrum. Tempora officiis debitis similique modi neque iusto voluptate
          cupiditate nemo. Laboriosam reiciendis quisquam et harum architecto
          dignissimos dicta, nam facere ut vero fugiat cum a tenetur illum ea
          aut nisi ullam ducimus suscipit quia distinctio nemo. Quisquam
          repellat rem, consequatur repellendus fugiat obcaecati rerum esse
          quasi beatae facere, quas dolore recusandae sit enim delectus
          voluptatibus! Nemo autem eaque fuga corporis distinctio et ipsam
          exercitationem, velit sequi voluptates architecto ut reprehenderit vel
          vitae doloremque est unde eum temporibus repudiandae beatae tenetur?
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data?.payload.map((campaign) => (
            // <div key={campaign.id}>
            //   <Image
            //     src={generateMediaLink(campaign.coverFileId ?? '')}
            //     alt={campaign.name}
            //     className="object-cover rounded-md aspect-video"
            //   />
            //   <div>{campaign.name}</div>
            //   <Button
            //     onClick={() => claimPromotion(campaign.id)}
            //     color={campaign.isJoined ? 'default' : 'primary'}
            //     className="w-full"
            //     disabled={campaign.isJoined}
            //   >
            //     {campaign.isJoined ? 'Claimed' : 'Claim'}
            //   </Button>
            // </div>
            <div
              key={campaign.id}
              className="flex flex-col w-60  h-80 overflow-hidden mx-auto mt-8 rounded-lg"
            >
              <div className="bg-blue-300 rounded- h-2/3 relative border-b-2 border-gray-500 border-dashed flex items-center justify-center px-4">
                <div>
                  <Image
                    src={generateMediaLink(campaign.coverFileId ?? '')}
                    alt={campaign.name}
                    width={400}
                    height={300}
                    className="object-cover rounded-md aspect-video mb-2.5"
                  />
                  <div className="text-slate-800 font-semibold text-center">
                    {campaign.name}
                  </div>
                </div>

                <span className="absolute bg-background size-10 rounded-full bottom-0 translate-y-1/2 -translate-x-1/2 left-0"></span>
                <span className="absolute bg-background size-10 rounded-full bottom-0 translate-y-1/2 translate-x-1/2 right-0"></span>
              </div>
              <div className="flex-1 flex justify-center items-center bg-blue-300">
                <Button
                  onClick={() => claimPromotion(campaign.id)}
                  color={campaign.isJoined ? 'default' : 'primary'}
                  className="px-8 disabled:opacity-75"
                  disabled={campaign.isJoined}
                >
                  {campaign.isJoined ? 'Claimed' : 'Claim'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
