import type { User } from '@/payload-types'

export const rest = async (
  url: string,
  args?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: RequestInit,
): Promise<null | undefined | User> => {
  const method = options?.method || 'POST'

  try {
    const res = await fetch(url, {
      method,
      ...(method === 'POST' ? { body: JSON.stringify(args) } : {}),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const data = await res.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    if (res.ok) {
      // Payload CMS can return different response structures:
      // - Login endpoints: { user } or { token, user }
      // - Create endpoints: { doc } or the document directly
      // - Other endpoints: { user } or document directly
      return data.user || data.doc || data
    }
  } catch (e: unknown) {
    throw new Error(e as string)
  }
}
