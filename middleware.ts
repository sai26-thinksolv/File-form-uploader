import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAuth = !!token
        const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login")
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin") && !isAuthPage

        // If user is authenticated and trying to access login page, redirect to dashboard
        if (isAuthPage && isAuth) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }

        // If user is not authenticated and trying to access admin pages, redirect to login
        if (isAdminPage && !isAuth) {
            const loginUrl = new URL("/admin/login", req.url)
            loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // This callback is required by withAuth
                // Return true to allow the middleware function to run
                // We handle the actual authorization logic in the middleware function above
                return true
            },
        },
    }
)

// Specify which routes this middleware should run on
export const config = {
    matcher: ["/admin/:path*"]
}
