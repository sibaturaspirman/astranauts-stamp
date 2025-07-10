import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('tokenAstranauts')?.value
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-app-id': process.env.API_APP_ID,
      'x-app-key': process.env.API_APP_KEY,
    },
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
