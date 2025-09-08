import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@claude-coordination/api'

export const trpc = createTRPCReact<AppRouter>()