'use client'
import DiscountForm from '@/app/manage/campaigns/_components/discount-form'
import VoucherForm from '@/app/manage/campaigns/_components/voucher-form'
import { CampaignType } from '@/constants'
import { useCreateCampaignMutation } from '@/queries/useCampaigns'
import { Tab, Tabs } from '@nextui-org/react'
import { toast } from 'react-toastify'

export default function Page() {
  const createCampaignMutation = useCreateCampaignMutation()
  const createCampaignHandler = async (values: any) => {
    try {
      await createCampaignMutation.mutateAsync(values)
      toast.success('Created campaign successfully')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Tabs aria-label="Options">
      <Tab key="voucher" title="Voucher">
        <VoucherForm onSubmit={createCampaignHandler} />
      </Tab>
      <Tab key="discount" title="Discount">
        <DiscountForm onSubmit={createCampaignHandler} />
      </Tab>
    </Tabs>
  )
}
