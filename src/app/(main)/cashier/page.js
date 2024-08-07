"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { decode } from "@/helpers/token.helper"
import Spinner from "@/components/component/Spinner";
import { ClipboardListIcon, DollarSignIcon } from "@/components/icons";

export default function Page() {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		try {
			const token = Cookies.get('token');
			if (token) {
				const user = decode(token);
				setUser(user);
			}
		} catch (error) {
			console.error('Failed to get token:', error);
		} finally {
			setIsLoading(false);
		}
	}, [])

	return (
		<main className="flex justify-center px-4 py-6 sm:px-6 lg:px-8 from-slate-200 to-slate-400 bg-gradient-to-b h-screen">
			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<Spinner />
				</div>
			) : (
				<div className="w-full max-w-md space-y-8">
					<div>
						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Bienvenido, <span className="capitalize">{user?.firstName} {user?.lastName}</span></h2>
						<p className="mt-2 text-center text-sm text-gray-600">Seleccione una opción</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Link
							href="/employee/checklist"
							className="flex flex-col items-center justify-center rounded-lg from-[#31304D] to-[#31304D]/70 bg-gradient-to-t p-6 shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 border"
							prefetch={false}
						>
							<ClipboardListIcon className="mb-4 h-12 w-12 text-[#F59E0B]" />
							<h3 className="text-lg font-medium text-gray-100">Checklist</h3>
							<p className="mt-2 text-sm text-gray-300">Gestionar tareas</p>
						</Link>
						<Link
							href="/cashier/cash-movement"
							className="flex flex-col items-center justify-center rounded-lg from-[#31304D] to-[#31304D]/70 bg-gradient-to-t p-6 shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 border"
							prefetch={false}
						>
							<DollarSignIcon className="mb-4 h-12 w-12 text-[#F59E0B]" />
							<h3 className="text-lg font-medium text-gray-100">Caja</h3>
							<p className="mt-2 text-sm text-gray-300">
								Gestionar datos de caja
							</p>
						</Link>
					</div>
				</div>
			)}
		</main>
	)
}
