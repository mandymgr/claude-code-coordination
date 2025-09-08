import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@claude-coordination/api'
import superjson from 'superjson'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 8080}` // dev SSR should use localhost
}

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        const token = localStorage.getItem('auth-token')
        return {
          ...(token && { 'x-user-id': token })
        }
      },
    }),
  ],
})