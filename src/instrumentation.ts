export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PUBLIC_MOCK_API === 'true' &&
    process.env.NODE_ENV !== 'production'
  ) {
    const { initMocks } = await import('./mocks')
    await initMocks()
  }
}
