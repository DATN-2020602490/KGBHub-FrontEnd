'use client'

import { cn } from '@/lib/utils'
import { userApiRequest } from '@/services/user.service'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useWindowSize } from 'usehooks-ts'

const Intro = () => {
  const { width } = useWindowSize()
  return (
    <div className="max-sm:flex-col flex justify-between w-full">
      <div className="flex flex-col sm:w-1/3 gap-y-8 max-sm:text-center">
        <h3 className="font-bold text-4xl leading-10">
          Learn a New Skill Everyday, Anytime, and Anywhere.
        </h3>
        {width <= 768 && <PosterWithAnimation />}

        <p>
          <b>1000+</b> Courses covering all tech domains for you to learn and
          explore new oppurtunities. Learn from Industry Experts and land your
          Dream Job.
        </p>
        <div className="flex flex-col sm:flex-row gap-y-4 gap-x-8 justify-around">
          <Button
            size="lg"
            color="primary"
            variant="solid"
            className="rounded-full px-10 text-lg"
            as={Link}
            href="/login"
          >
            Start Trial
          </Button>
          <Button
            size="lg"
            color="primary"
            variant="bordered"
            className="rounded-full px-10 text-lg"
            as={Link}
            href="/promotions"
          >
            Get promotions
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-12">
          <div className="flex flex-col items-center">
            <h3 className="w-full text-4xl font-semibold text-yellow-400 text-center">
              100+
            </h3>
            <p className="w-full font-semibold text-center">
              Courses to choose from
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="w-full text-4xl font-semibold text-blue-500 text-center">
              500+
            </h3>
            <p className="w-full font-semibold text-center">Students Trained</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <h3 className="w-full text-4xl font-semibold text-orange-500">
              200+
            </h3>
            <p className="w-full font-semibold text-center">
              Professional Trainers
            </p>
          </div>
        </div>
      </div>
      {width > 768 && <PosterWithAnimation />}
    </div>
  )
}

export default Intro

type RectangleRoundedProps = {
  color?: string
  size?: string | number
  className?: string
  withBorder?: boolean
}

const RectangleRounded = ({
  color = 'bg-blue-500',
  size = 40,
  className,
  withBorder = true,
}: RectangleRoundedProps) => {
  return (
    <div
      className={cn('absolute', className)}
      style={{ width: size, height: size }}
    >
      <div
        className={`${color} rounded-[67%_33%_71%_29%_/_31%_68%_32%_69%] relative w-full h-full`}
      >
        {withBorder && (
          <span className="absolute w-full h-full border dark:border-white border-black -top-[10%] -right-[10%] rounded-[67%_33%_71%_29%_/_31%_68%_32%_69%]"></span>
        )}
      </div>
    </div>
  )
}

const TypeWriter = ({ text, className }: { text: any; className: any }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [currentIndex, text])

  return <span className={className}>{displayedText}</span>
}

const getDynamicFontSize = (quoteLength: any) => {
  if (quoteLength <= 50) {
    return 'text-4xl md:text-5xl lg:text-6xl'
  } else if (quoteLength <= 100) {
    return 'text-3xl md:text-4xl lg:text-5xl'
  } else if (quoteLength <= 150) {
    return 'text-2xl md:text-3xl lg:text-4xl'
  } else {
    return 'text-xl md:text-2xl lg:text-3xl'
  }
}

const PosterWithAnimation = () => {
  const [quoteData, setQuoteData] = useState({
    quote:
      'Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.',
    author: 'Robert Frost',
  })
  const [alignment, setAlignment] = useState('text-left')
  const [fontSize, setFontSize] = useState('text-4xl')
  const updateFontSize = useCallback(() => {
    const newFontSize = getDynamicFontSize(quoteData.quote.length)
    setFontSize(newFontSize)
  }, [quoteData.quote])
  const fetchNewQuote = async () => {
    try {
      const response = await userApiRequest.randomQuote()
      const data = response.payload
      setQuoteData(data)
      setAlignment(Math.random() > 0.5 ? 'text-left' : 'text-right')
    } catch (error) {
      console.error('Error fetching quote:', error)
    }
  }
  useEffect(() => {
    updateFontSize()
  }, [quoteData, updateFontSize])

  useEffect(() => {
    fetchNewQuote()
    const intervalId = setInterval(fetchNewQuote, 15000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="sm:w-1/3">
      <div className="flex justify-center items-center relative">
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src="/images/work.jpg"
            alt="Work"
            width={736}
            height={920}
            className="max-md:w-96 md:w-full object-cover select-none rounded-2xl"
          />
          <div className="absolute inset-0 bg-card/50 flex flex-col justify-center p-8 rounded-2xl">
            <div
              className={`h-[40%] flex flex-col justify-center ${alignment} font-serif`}
            >
              <div className="max-w-[90%] mx-auto">
                <p
                  className={`text-white ${fontSize} md:text-4xl lg:text-5xl mb-6 leading-relaxed uppercase`}
                >
                  <TypeWriter
                    text={quoteData.quote}
                    className="transition-all duration-300"
                  />
                </p>
                <p className="text-white text-xl md:text-2xl lg:text-3xl italic uppercase">
                  -{' '}
                  <TypeWriter
                    text={quoteData.author}
                    className="transition-all duration-300"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
