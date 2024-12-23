'use client'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { generateMediaLink } from '@/lib/utils'
import ButtonLogout from '@/components/logout-button'
import { useAccountContext } from '@/contexts/account'

export const UserDropdown = () => {
  const { user } = useAccountContext()
  const { push } = useRouter()
  return (
    <Dropdown placement="bottom-end">
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            isBordered
            size="sm"
            src={
              generateMediaLink(user?.avatarFileId ?? '') ||
              'https://i.pravatar.cc/150?u=a042581f4e29026704d'
            }
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p>{user?.email}</p>
        </DropdownItem>
        <DropdownItem
          key="settings"
          onClick={() => push(`/profile/${user?.id}`)}
        >
          My Profile
        </DropdownItem>
        <DropdownItem key="bookmarks" onClick={() => push(`/bookmarks`)}>
          Lessons bookmarked
        </DropdownItem>
        {/* <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem> */}
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem key="logout" color="danger">
          <ButtonLogout />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
