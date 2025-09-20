import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const authRoutes = ["/preview/login", "/preview/register"];

  // Exclude API routes from redirect logic
  const isApiRoute = url.pathname.startsWith("/api");

  // Redirect unauthenticated users trying to access protected pages
  if (!user && !authRoutes.includes(url.pathname) && !isApiRoute) {
    url.pathname = "/preview/register";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/register
  if (user && authRoutes.includes(url.pathname) && !isApiRoute) {
    url.pathname = "/preview/dashboard";
    return NextResponse.redirect(url);
  }

  // No forced redirect for other pages or API routes
  return supabaseResponse;
}
