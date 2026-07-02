import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET =
  process.env.JWT_SECRET || 'ebFXdBotIUWzmK9IFlc2GTfGY3iUAUbE05NPb1QIELk='

function getJwtSecretKey() {
  return new TextEncoder().encode(JWT_SECRET)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  // Allow public access to non-admin routes
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('admin-token')?.value

  // Login page: redirect to dashboard if already authenticated
  if (isLoginPage) {
    if (token) {
      try {
        await jwtVerify(token, getJwtSecretKey())
        return NextResponse.redirect(new URL('/admin', request.url))
      } catch {
        const response = NextResponse.next()
        response.cookies.delete('admin-token')
        return response
      }
    }
    return NextResponse.next()
  }

  // No token = redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(token, getJwtSecretKey())
    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin-token')
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
