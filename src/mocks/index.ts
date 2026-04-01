export async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server')
    server.listen({ onUnhandledRequest: 'bypass' })
    console.info('[MSW] Mock server started')
  }
}
