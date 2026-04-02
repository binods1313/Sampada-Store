import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  // Allow public access to non-admin routes
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  // Allow access to login page
  if (isLoginPage) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('admin-token')?.value

  // No token = redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    // Verify token
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'change-this-secret')
    )
    // Valid token = allow access
    return NextResponse.next()
  } catch {
    // Invalid token = clear cookie and redirect to login
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin-token')
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
