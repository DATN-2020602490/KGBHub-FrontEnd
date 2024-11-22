'use client'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { createContext, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AccountProvider from '@/contexts/account'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
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
  const queryClient = new QueryClient()
  return (
    <RootContext.Provider
      value={{
        initializing,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}
            >
              <AccountProvider>
                <ToastContainer
                  theme="dark"
                  hideProgressBar
                  position="bottom-right"
                />
                {children}
              </AccountProvider>
            </GoogleOAuthProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </RootContext.Provider>
  )
}
