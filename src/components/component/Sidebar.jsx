"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Sidebar() {

	const pathname = usePathname();

	return (
		<div className="hidden border-r bg-gray-100/40 lg:block">
			<div className="flex flex-col gap-2">
				<div className="flex h-[60px] items-center px-6">
					<Link className="flex items-center gap-2 font-semibold" href="/admin/dashboard">
						<ClipboardListIcon className="h-6 w-6" />
						<span className="">Admin Dashboard</span>
					</Link>
				</div>
				<div className="flex-1">
					<nav className="grid items-start px-4 text-sm font-medium">

						{/* ---- Empleados ----- */}

						<div className="grid gap-1 mt-4">
							<div className="text-gray-500 px-3 py-2">Empleados</div>
							<Link
								href="/admin/employee/register"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/employee/register" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								prefetch={false}
							>
								<UserPlusIcon className="h-4 w-4" />
								Gestionar usuarios
							</Link>
							{/* <Link
								href="#"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								prefetch={false}
							>
								<UserCheckIcon className="h-4 w-4" />
								Modificar usuario
							</Link>
							<Link
								href="#"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								prefetch={false}
							>
								<UserXIcon className="h-4 w-4" />
								Delete User
							</Link> */}
						</div>

						{/* ---- Tareas ----- */}

						<div className="grid gap-1 mt-4">
							<div className="text-gray-500 px-3 py-2 ">Tareas</div>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/tasks" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="/admin/tasks">
								<InboxIcon className="h-4 w-4" />
								Ver Tareas
							</Link>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/tasks/assign" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="/admin/tasks/assign">
								<PlusIcon className="h-4 w-4" />
								Asignar Tareas
							</Link>
							{/* <Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<UsersIcon className="h-4 w-4" />
								Tareas en varios usuarios
							</Link>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<UserIcon className="h-4 w-4" />
								Tareas sin asignar
							</Link> */}
						</div>

						{/* ---- Caja ----- */}

						<div className="grid gap-1 mt-4">
							<div className="text-gray-500 px-3 py-2">Caja</div>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<DollarSignIcon className="h-4 w-4" />
								Movimientos de Caja
							</Link>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<ReceiptIcon className="h-4 w-4" />
								Anulaciones
							</Link>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<BarChartIcon className="h-4 w-4" />
								Terminales
							</Link>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<BarChartIcon className="h-4 w-4" />
								Proveedores
							</Link>
						</div>
					</nav>
				</div>
			</div>
		</div>
	)
}

function BarChartIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<line x1="12" x2="12" y1="20" y2="10" />
			<line x1="18" x2="18" y1="20" y2="4" />
			<line x1="6" x2="6" y1="20" y2="16" />
		</svg>)
	);
}


function ClipboardListIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
			<path
				d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
			<path d="M12 11h4" />
			<path d="M12 16h4" />
			<path d="M8 11h.01" />
			<path d="M8 16h.01" />
		</svg>)
	);
}


function DollarSignIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<line x1="12" x2="12" y1="2" y2="22" />
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
		</svg>)
	);
}



function InboxIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path
				d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		</svg>)
	);
}

function PlusIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>)
	);
}


function ReceiptIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path
				d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
			<path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
			<path d="M12 17.5v-11" />
		</svg>)
	);
}

function UserIcon(props) {
	return (
		(<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>)
	);
}


function UserPlusIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<line x1="19" x2="19" y1="8" y2="14" />
			<line x1="22" x2="16" y1="11" y2="11" />
		</svg>
	)
}


function UsersIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	)
}