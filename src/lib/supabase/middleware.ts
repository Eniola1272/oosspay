import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single() as { data: { role: string } | null };

    const role = profile?.role ?? "user";

    // Role-based redirect when hitting the root /dashboard
    if (pathname === "/dashboard") {
      if (role === "super_admin") return NextResponse.redirect(new URL("/dashboard/super-admin", request.url));
      if (role === "admin") return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      // regular user: stay at /dashboard (handled by the page itself)
      return supabaseResponse;
    }

    // Protect /dashboard/admin/* — admin and super_admin only
    if (pathname.startsWith("/dashboard/admin")) {
      if (role !== "admin" && role !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Protect /dashboard/super-admin/* — super_admin only
    if (pathname.startsWith("/dashboard/super-admin")) {
      if (role !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Legacy /admin/* routes — redirect to new paths
  if (pathname.startsWith("/admin")) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single() as { data: { role: string } | null };

    const role = profile?.role ?? "user";
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect to new URL structure
    const newPath = pathname.replace(/^\/admin/, role === "super_admin" ? "/dashboard/super-admin" : "/dashboard/admin");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return supabaseResponse;
}
