'use client'

import FileUpload from '@/components/input/file-upload'
import { CampaignType } from '@/constants'
import {
  convertObjectToFormData,
  generateMediaLink,
  sanitizer,
} from '@/lib/utils'
import { useListCoursePublic } from '@/queries/useCourse'
import {
  DiscountBody,
  DiscountBodyType,
} from '@/schemaValidations/campaign.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
  Textarea,
  useDisclosure,
} from '@nextui-org/react'
import { CalendarDays, X, Check } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-date-picker'
import { Controller, useForm } from 'react-hook-form'

type Props = {
  data?: any
  onSubmit?: any
}

export default function DiscountForm({ data, onSubmit }: Props) {
  const [loading, setLoading] = useState(false)
  const form = useForm<DiscountBodyType>({
    resolver: zodResolver(DiscountBody),
    defaultValues: {
      cover: data?.coverFileId ?? '',
      startAt: data?.startAt ?? '',
      endAt: data?.endAt ?? '',
      requireJoined: data?.requireJoined ?? 'true',
    },
  })

  const submit = async (values: any) => {
    setLoading(true)
    values.type = CampaignType.DISCOUNT
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
      <Controller
        control={form.control}
        name="requireJoined"
        render={({ field }) => (
          <div className="space-y-2">
            <span className="relative text-foreground-500 after:text-danger after:ml-0.5 block">
              Require joined
            </span>
            <Switch
              isSelected={field.value}
              size="lg"
              color="primary"
              startContent={<X />}
              endContent={<Check />}
              {...field}
            />
          </div>
        )}
      />
      <DiscounSetting />
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

const DiscounSetting = () => {
  const { data } = useListCoursePublic()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const courses = data?.payload
  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                {courses?.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 border rounded-md flex gap-x-4 w-full"
                  >
                    <Image
                      src={generateMediaLink(course.thumbnailFileId)}
                      alt={course.courseName}
                      className="rounded-sm object-cover aspect-video !w-[120px] [div:has(>&)]:!w-[120px] [div:has(>&)]:shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {course.courseName}
                      </p>
                      <p
                        className="text-sm text-gray-400 line-clamp-2 !font-normal break-words whitespace-normal w-fit"
                        // Prevent XSS Attack recommen from React Docs
                        dangerouslySetInnerHTML={{
                          __html: course.descriptionMD
                            ? sanitizer(
                                course.descriptionMD.replace(/<\/?strong>/g, '')
                              )
                            : '',
                        }}
                      ></p>
                    </div>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
