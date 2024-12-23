'use client'

import FileUpload from '@/components/input/file-upload'
import { CampaignType } from '@/constants'
import { convertObjectToFormData } from '@/lib/utils'
import {
  VoucherBody,
  VoucherBodyType,
} from '@/schemaValidations/campaign.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Spinner, Textarea } from '@nextui-org/react'
import { CalendarDays, X } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-date-picker'
import { Controller, useForm } from 'react-hook-form'

type Props = {
  data?: any
  onSubmit?: any
}

export default function VoucherForm({ data, onSubmit }: Props) {
  const [loading, setLoading] = useState(false)
  const form = useForm<VoucherBodyType>({
    resolver: zodResolver(VoucherBody),
    defaultValues: {
      cover: data?.coverFileId ?? '',
      totalFeeVoucher: data?.totalFeeVoucher ?? '',
      feeVoucherValue: data?.feeVoucherValue ?? '',
      totalProductVoucher: data?.totalProductVoucher ?? '',
      productVoucherValue: data?.productVoucherValue ?? '',
      startAt: data?.startAt ?? '',
      endAt: data?.endAt ?? '',
    },
  })

  const submit = async (values: any) => {
    setLoading(true)
    values.type = CampaignType.VOUCHERS
    const formData = convertObjectToFormData(values)
    await onSubmit(formData)
    setLoading(false)
  }
  const { errors } = form.formState
  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <div className="flex gap-x-8 items-end">
        <div className="w-full space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Input
                isRequired
                label="Name"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter name..."
                errorMessage={errors.name?.message}
                {...field}
              />
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <div className="space-y-2">
                  <span className="relative text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5">
                    Start at
                  </span>
                  <DatePicker
                    className="w-full"
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                    calendarIcon={!field.value ? <CalendarDays /> : null}
                    clearIcon={field.value ? <X /> : null}
                  />
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <div className="space-y-2">
                  <span className="relative text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5">
                    End at
                  </span>
                  <DatePicker
                    className="w-full"
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                    calendarIcon={!field.value ? <CalendarDays /> : null}
                    clearIcon={field.value ? <X /> : null}
                  />
                </div>
              )}
            />
          </div>
        </div>
        <div className="w-fit mx-auto">
          <FileUpload
            name="cover"
            form={form}
            placeholder="Upload thumbnail. "
          />
        </div>
      </div>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Textarea
            isRequired
            label="Description"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter description..."
            errorMessage={errors.description?.message}
            {...field}
          />
        )}
      />

      <div className="flex gap-x-4">
        <Controller
          name="feeVoucherValue"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              className="w-1/2"
              label="Fee voucher value"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter fee voucher value..."
              errorMessage={errors.feeVoucherValue?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="productVoucherValue"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              className="flex-1"
              label="Product voucher value"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter product voucher value..."
              errorMessage={errors.productVoucherValue?.message}
              {...field}
            />
          )}
        />
      </div>
      <div className="flex gap-x-4">
        <Controller
          name="totalFeeVoucher"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              className="w-1/2"
              label="Total fee voucher"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter total fee voucher..."
              errorMessage={errors.totalFeeVoucher?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="totalProductVoucher"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              className="flex-1"
              label="Total product voucher"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter total product voucher..."
              errorMessage={errors.totalProductVoucher?.message}
              {...field}
            />
          )}
        />
      </div>

      <Button
        className="flex items-center ml-auto"
        color="primary"
        type="submit"
        disabled={loading}
      >
        {loading ? <Spinner color="success" /> : 'Save'}
      </Button>
    </form>
  )
}
