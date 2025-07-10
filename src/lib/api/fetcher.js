// src/lib/api/fetcher.js
export async function apiFetcher(path, token, options = {}) {
    const headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-app-id': process.env.API_APP_ID,
      'x-app-key': process.env.API_APP_KEY,
    }
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}${path}`, {
      ...options,
      headers,
      cache: 'no-store',
    })
  
    if (!res.ok) {
      console.error(`[API ERROR] ${res.status} ${res.statusText}`)
    }
  
    return res.json()
  }
  