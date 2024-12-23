'use client'
import CartPopover from '@/components/cart/cart-popover'
import GoogleLogin from '@/components/google-login'
import ChatIcon from '@/components/icons/chat-icon'
import { GraduationCap } from '@/components/icons/graduation-cap'
import { UserDropdown } from '@/components/navbar/user-dropdown'
import SearchCourse from '@/components/search/search-course'
import { ThemeSwitcher } from '@/components/theme-swicher'
import { useAccountContext } from '@/contexts/account'
import { useChatContext } from '@/contexts/chat'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useWindowSize } from 'usehooks-ts'

const menuItems = [
  'Profile',
  'Dashboard',
  'Activity',
  'Analytics',
  'System',
  'Deployments',
  'My Settings',
  'Team Settings',
  'Help & Feedback',
  'Log Out',
]

const Header = ({ className }: { className?: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAccountContext()
  const { width } = useWindowSize()
  const { chatList } = useChatContext()
  const isManager = user?.roles
    ? user.roles.some(
        (role) => role.role.name === 'ADMIN' || role.role.name === 'AUTHOR'
      )
    : false
  const unreadMessageCount = chatList?.reduce(
    (total, current) => (total += current?.conversation?.unreadMessages || 0),
    0
  )
  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={cn('lg:[&>header]:max-w-full lg:[&>header]:px-40', className)}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent
        className="sm:hidden pr-3"
        justify="center"
      ></NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link
            href="/"
            className="flex gap-2 items-center p-2 border rounded-md"
          >
            <GraduationCap size={32} />
            <p className="font-bold text-inherit text-xl uppercase">KGB Hub</p>
          </Link>
          {/* <p className="font-bold text-inherit">ACME</p> */}
        </NavbarBrand>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={<ChevronDown size={18} />}
                radius="sm"
                variant="light"
              >
                Categories
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME categories"
            className="w-[340px]"
            itemClasses={{
              base: 'gap-4',
            }}
          >
            {CATEGORIES.map((category, index) => (
              <DropdownItem
                key={index}
                // description="ACME scales apps to meet user demand, automagically, based on load."
                as={Link}
                href={`${category.path}`}
                startContent={category.icon}
              >
                {category.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {/* <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem> */}
        {isManager && (
          <NavbarItem>
            <Link color="foreground" href="/manage/dashboard">
              Dashboard
            </Link>
          </NavbarItem>
        )}
        <NavbarItem>
          <SearchCourse />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {width > 640 && <ThemeSwitcher />}

        {/* {user && <ListChatsPopover />} */}
        {user && (
          <Badge
            color="danger"
            content={unreadMessageCount}
            isInvisible={!unreadMessageCount}
            shape="circle"
          >
            <Link href="/messages">
              <ChatIcon className="size-6" />
            </Link>
          </Badge>
        )}
        {user && <CartPopover />}
        {user ? (
          <NavbarItem>
            <UserDropdown />
          </NavbarItem>
        ) : (
          <GoogleLogin />
        )}
      </NavbarContent>

      <NavbarMenu className="flex flex-col items-center">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? 'warning'
                  : index === menuItems.length - 1
                  ? 'danger'
                  : 'foreground'
              }
              href="#"
              // size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
        {width <= 640 && <ThemeSwitcher />}
      </NavbarMenu>
    </Navbar>
  )
}

export default Header
