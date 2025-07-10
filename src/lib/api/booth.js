// src/lib/api/booth.js
import { cookies } from 'next/headers'

export async function fetchBoothList() {
  const token = cookies().get('tokenAstranauts')?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/booth`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-app-id': process.env.API_APP_ID,
      'x-app-key': process.env.API_APP_KEY,
    },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Gagal fetch booth')

  return res.json()
}
