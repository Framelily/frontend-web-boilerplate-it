import { QueryClient } from '@tanstack/react-query'

let queryClient: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 60 * 1000,
        },
        mutations: {
          retry: false,
        },
      },
    })
  }

  // Browser: reuse the same QueryClient
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 60 * 1000,
        },
        mutations: {
          retry: false,
        },
      },
    })
  }

  return queryClient
}
