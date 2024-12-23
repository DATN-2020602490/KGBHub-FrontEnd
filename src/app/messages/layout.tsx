'use client'
import ChatSidebar from '@/components/chat/chat-siderbar'
import Header from '@/components/layouts/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header className="lg:[&>header]:px-3" />
      <div className="lg:flex flex-1">
        <div className="hidden lg:block">
          <ChatSidebar />
        </div>
        {children}
      </div>
    </div>
  )
}
