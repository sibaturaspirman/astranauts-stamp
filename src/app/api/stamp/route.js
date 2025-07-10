import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('tokenAstranauts')?.value
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { boothId } = await request.json()

    if (!boothId) {
      return Response.json({ error: 'boothId is required' }, { status: 400 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/booth/${boothId}/stamp`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-id': process.env.API_APP_ID,
        'x-app-key': process.env.API_APP_KEY,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (err) {
    console.error('❌ Stamp error:', err)
    return Response.json({ error: 'Stamp request failed' }, { status: 500 })
  }
}
