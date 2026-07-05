import { NextResponse } from "next/server";

export default function proxy(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    if (!token && pathname === '/') {
        return NextResponse.redirect(new URL("/user/login", request.url));
    }
    
    if (token && (pathname === "/user/login" || pathname === "/user/register")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    
    const hasUserIdCookie = request.cookies.has("userId");
    
    if (token && !hasUserIdCookie) {
        try {
            const base64Url = token.split('.')[1];
            if (base64Url) {
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                
                const payload = JSON.parse(atob(base64)); 
                const userId = payload.id || payload._id;

                if (userId) {
                    response.cookies.set("userId", userId, { 
                        path: "/", 
                        httpOnly: false, 
                        maxAge: 60 * 60 * 24 * 7 
                    });
                }
            }
        } catch (err) {
            console.error("Proxy token decode error:", err.message);
        }
    }
    
    return response;
}

export const config = {
    matcher: [
        "/",
        "/user/:path*",
        "/food-partner/:path*"
    ]
};