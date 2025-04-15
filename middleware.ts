import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import storage from './utils/storage'


// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('finTrac_token')
    // const token = storage.getToken()
    // console.log(token, "token")
    const { pathname } = request.nextUrl

    // Allow access to public routes without authentication
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next()
    }

    // If no token is present and trying to access protected route, redirect to login
    if (!token) {
        const loginUrl = new URL('/login', request.url)
        // Store the attempted URL to redirect back after login
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}