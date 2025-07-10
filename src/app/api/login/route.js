import { cookies } from 'next/headers'

export async function POST(request) {
  const body = await request.formData()

  const response = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-app-id': process.env.API_APP_ID,
      'x-app-key': process.env.API_APP_KEY,
    },
    body: new URLSearchParams({
      project: body.get('project'),
      name: body.get('name'),
      password: body.get('password'),
    }),
  })

  const result = await response.json()

  // Simpan token ke cookie jika login berhasil
  if (response.ok && result.token) {
    cookies().set('tokenAstranauts', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      sameSite: 'lax',
    })
  }

  return new Response(JSON.stringify(result), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
