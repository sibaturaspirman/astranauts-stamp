// middleware.js
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('tokenAstranauts')?.value

  // Jika tidak ada token, redirect ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
    matcher: ['/home', '/home/:path*'],
}
