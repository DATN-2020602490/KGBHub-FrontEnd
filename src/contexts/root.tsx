'use client'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { createContext, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AccountProvider from '@/contexts/account'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChatProvider } from '@/contexts/chat'
import { ToastContainer } from 'react-toastify'
interface IContext {
  initializing: boolean
}
export const RootContext = createContext<IContext>({
  initializing: false,
})

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })
  return (
    <RootContext.Provider
      value={{
        initializing,
      }}
    >
      <ToastContainer theme="dark" hideProgressBar position="bottom-right" />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}
            >
              <AccountProvider>
                <ChatProvider>{children}</ChatProvider>
              </AccountProvider>
            </GoogleOAuthProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </RootContext.Provider>
  )
}
