import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                if (req.nextUrl.pathname.startsWith("/admin")) {
                    return !!token;
                }
                // Define which routes require authentication
                const protectedRoutes = ["/profile","/collaborative-editor/*"];
                const pathname = req.nextUrl.pathname;

                

                // Check if the current path is a protected route
                const isProtectedRoute = protectedRoutes.some((route) =>
                    pathname.startsWith(route)
                );

                // If it's a protected route, require authentication
                if (isProtectedRoute) {
                    return !!token;
                }

                // Allow access to non-protected routes
                return true;
            },
        },
        pages: {
            signIn: "/signin",
        },
    }
);

// Configure which routes the middleware should run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)"],
};
