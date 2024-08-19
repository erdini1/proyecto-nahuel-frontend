"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PowerIcon, TintinIcon } from "@/components/icons";
import { decode } from "@/helpers/token.helper";
import Cookies from "js-cookie";

export default function Navbar() {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = Cookies.get('token');
				if (token) {
					const decodedUser = decode(token);
					setUser(decodedUser);
				}
			} catch (error) {
				console.error('Failed to get token:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (isLoading) {
		return null;
	}

	const handleHome = () => {
		switch (user.role) {
			case 'admin':
				return '/admin/general';
			case 'cashier':
				return '/employee';
			case 'employee':
				return '/employee';
			default:
				return '/login';
		}
	};

	return (
		<header className="bg-gray-900 shadow z-30">
			<div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
				<div className={`${user.role === "admin" ? 'opacity-0 pointer-events-none lg:opacity-100' : 'block'}`}>
					<Link href={handleHome()} className="flex items-center gap-2 text-gray-700 hover:text-gray-900" prefetch={false}>
						<TintinIcon className="h-8 w-8 text-gray-300" />
						<span className="text-xl font-bold text-gray-300">INICIO</span>
					</Link>
				</div>
				<div className="flex items-center gap-14 text-gray-300">
					{user ? (
						<div className="flex items-center gap-2 ">
							<span className="text-lg font-medium">{user.firstName} {user.lastName}</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
							<span className="text-lg font-medium text-white">Invitado</span>
						</div>
					)}
					<Link href="/logout" className="flex items-center gap-2 text-gray-300 transition-colors bg-gray-600 hover:bg-gray-400 hover:text-black duration-300 ring-2 ring-gray-400 p-2 rounded" prefetch={false}>
						<PowerIcon className="h-5 w-5 " />
						<span className="font-medium ">Cerrar Sesión</span>
					</Link>
				</div>
			</div>
		</header>
	);
}