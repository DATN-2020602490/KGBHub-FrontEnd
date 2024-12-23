import { Heading } from '@/components/common/heading'
import { GraduationCap } from '@/components/icons/graduation-cap'
import { Button } from '@nextui-org/react'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const categories = [
    'Development',
    'Language',
    'IT',
    'Health',
  ]

  const quickLinks = [
    'Courses',
    'Workshops',
    'Certifications',
    'Blog'
  ]

  const support = [
    { title: 'Help Center', href: '#' },
    { title: 'FAQs', href: '#' },
    { title: 'Terms & Conditions', href: '#' },
    { title: 'Privacy Policy', href: '#' }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'Youtube' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ]

  return (
    <footer className="mt-8 border-t w-full">
      <div className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Logo and Social Links */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Link
                  href="#"
                  className="flex items-center gap-2 p-2 border rounded-md w-fit hover:bg-gray-50 transition-colors"
                >
                  <GraduationCap className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  <span className="font-bold text-xl uppercase text-gray-900 dark:text-gray-100">KGB HUB</span>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Learn a New Skill Everyday, Anytime, and Anywhere.
                </p>
              </div>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    as="a"
                    href={social.href}
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    isIconOnly
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Heading title="CATEGORIES" className="text-base text-gray-900 dark:text-gray-100" />
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <Heading title="QUICK LINKS" className="text-base text-gray-900 dark:text-gray-100" />
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <Heading title="SUPPORT" className="text-base text-gray-900 dark:text-gray-100" />
              <ul className="space-y-2">
                {support.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} KGB Hub. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
