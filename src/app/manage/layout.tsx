'use client'
import { SidebarContext } from '@/components/layouts/layout-manager-context'
import { NavbarWrapper } from '@/components/navbar/navbar'
import { SidebarWrapper } from '@/components/sidebar/sidebar'
import { useLockedBody } from '@/hooks/useBodyLock'
import { useState } from 'react'

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [_, setLocked] = useLockedBody(false)
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    setLocked(!sidebarOpen)
  }
  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <section className="flex">
        <SidebarWrapper />
        <NavbarWrapper>
          <section className="p-6">{children}</section>
        </NavbarWrapper>
      </section>
    </SidebarContext.Provider>
  )
}
