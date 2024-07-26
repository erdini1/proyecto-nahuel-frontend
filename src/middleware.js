
import { NextResponse } from "next/server";
import { decode } from "./helpers/token.helper";
import { ROLE } from "./constants/role.constant";

export function middleware(request) {
	const token = request.cookies.get("token")?.value;
	let user;

	if (token) {
		try {
			user = decode(token);
		} catch (error) {
			// Si el token no es válido, redirigir al login
			const response = NextResponse.redirect(new URL("/login", request.url));
			response.cookies.delete("token");
			return response;
		}
	}

	const { pathname } = request.nextUrl;

	if (!token) {
		// Si no hay token y se intenta acceder a rutas protegidas
		if (pathname.startsWith("/admin") || pathname.startsWith("/employee") || pathname.startsWith("/cashier")) {
			const response = NextResponse.redirect(new URL("/login", request.url));
			response.cookies.delete("token");
			return response;
		}
	} else {
		// Si hay token, verificar roles y redirigir según el caso
		if (pathname.startsWith("/admin") && user.role !== ROLE.ADMIN) {
			return NextResponse.redirect(new URL("/unauthorized", request.url)); // Página no autorizado
		}
		if (pathname.startsWith("/employee") && ![ROLE.ADMIN, ROLE.EMPLOYEE, ROLE.CASHIER].includes(user.role)) {
			return NextResponse.redirect(new URL("/unauthorized", request.url));
		}
		if (pathname.startsWith("/cashier") && ![ROLE.ADMIN, ROLE.CASHIER].includes(user.role)) {
			return NextResponse.redirect(new URL("/unauthorized", request.url));
		}
	}

	// Redirigir al admin a /admin si intenta acceder a /login
	if (token && pathname.startsWith("/login")) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}
}

export const config = {
	matcher: ["/admin(.*)", "/login", "/employee(.*)", "/cashier(.*)"],
};
