import { cookies } from 'next/headers'

export async function POST() {
  const token = cookies().get('tokenAstranauts')?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/member/share-or-survey`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-app-id': process.env.API_APP_ID,
      'x-app-key': process.env.API_APP_KEY,
    }
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
