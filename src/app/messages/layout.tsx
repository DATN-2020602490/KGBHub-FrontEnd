'use client'

import ChatSidebar from '@/components/chat/chat-siderbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full lg:flex">
      <div className="hidden lg:block">
        <ChatSidebar />
      </div>
      {children}
    </div>
  )
}
