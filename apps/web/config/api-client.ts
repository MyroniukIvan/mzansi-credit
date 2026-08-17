const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    throw new ApiError(response.status, await response.text())
  }
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}
