import { NextResponse } from 'next/server'

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const token = parseCookie(cookieHeader).tokenAstranauts

  const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/booth`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-app-id': process.env.API_APP_ID,
      'x-app-key': process.env.API_APP_KEY,
    },
    cache: 'no-store',
  })

  const result = await res.json()
  return NextResponse.json(result)
}

// helper untuk parse cookie
function parseCookie(cookieStr) {
  return Object.fromEntries(
    cookieStr.split('; ').map(c => {
      const [k, ...v] = c.split('=')
      return [k, decodeURIComponent(v.join('='))]
    })
  )
}
