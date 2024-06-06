
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



// ---------------------------

// import { NextResponse } from "next/server";
// import { decode } from "./helpers/token.helper";
// import { ROLE } from "./constants/role.constant";

// export function middleware(request) {
// 	const token = request.cookies.get("token")?.value;
// 	// if (!token) return NextResponse.redirect(new URL("/login", request.url));

// 	// const user = decode(token);

// 	if (request.nextUrl.pathname.startsWith("/admin") && !token) {
// 		const response = NextResponse.redirect(new URL("/login", request.url));
// 		response.cookies.delete("token");
// 		return response;
// 	}
// 	if (token && request.nextUrl.pathname.startsWith("/login")) {
// 		const response = NextResponse.redirect(new URL("/admin", request.url));
// 		return response;
// 	}
// }

// export const config = {
// 	matcher: ["/admin(.*)", "/login"],
// };

// --------------------------

// import { NextResponse } from "next/server";
// import { decode } from "./helpers/token.helper";
// import { ROLE } from "./constants/role.constant";

// export function middleware(request) {
// 	const token = request.cookies.get("token")?.value;
// 	if (!token) return NextResponse.redirect(new URL("/login", request.url));

// 	const user = decode(token);

// 	switch (user.role) {
// 		case ROLE.ADMIN:
// 			if (!request.nextUrl.pathname.startsWith("/admin")) {
// 				return NextResponse.redirect(new URL("/admin", request.url));
// 			}
// 			break;
// 		case ROLE.CASHIER:
// 			if (
// 				!request.nextUrl.pathname.startsWith("/cashier") &&
// 				!request.nextUrl.pathname.startsWith("/employee")
// 			) {
// 				return NextResponse.redirect(new URL("/", request.url));
// 			}
// 			break;
// 		case ROLE.EMPLOYEE:
// 			// Add the paths that the nurse can access here
// 			if (!request.nextUrl.pathname.startsWith("/employee")) {
// 				return NextResponse.redirect(new URL("/employee", request.url));
// 			}
// 			break;
// 		default:
// 			return NextResponse.redirect(new URL("/login", request.url));
// 	}
// }

// export const config = {
//   matcher: [
//     // Match all routes except the ones that start with /login and api and the static folder
//     "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
//   ],
// };

// -------------------------

// if (request.nextUrl.pathname.startsWith("/admin") && !token) {
// 	const response = NextResponse.redirect(new URL("/login", request.url));
// 	response.cookies.delete("token");
// 	return response;
// }
// if (token && request.nextUrl.pathname.startsWith("/login")) {
// 	const response = NextResponse.redirect(new URL("/admin", request.url));
// 	return response;
// }
// }

// See "Matching Paths" below to learn more
// export const config = {
// 	matcher: ["/admin(.*)", "/login"],
// };

// import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request) {
// 	const token = request.cookies.get("token")?.value;

// 	if (request.nextUrl.pathname.startsWith("/admin") && !token) {
// 		const response = NextResponse.redirect(new URL("/login", request.url));
// 		response.cookies.delete("token");
// 		return response;
// 	}
// 	if (token && request.nextUrl.pathname.startsWith("/login")) {
// 		const response = NextResponse.redirect(new URL("/admin", request.url));
// 		return response;
// 	}
// }

// // See "Matching Paths" below to learn more
// export const config = {
// 	matcher: ["/admin(.*)", "/login"],
// };
