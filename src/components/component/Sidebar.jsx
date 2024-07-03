"use client";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { ClipboardListIcon, UserPlusIcon, InboxIcon, DollarSignIcon, PlusIcon, BarChartIcon, ReceiptIcon, CalendarDaysIcon } from "@/components/icons";

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
						</div>
						{/* ---- Tareas ----- */}
						<div className="grid gap-1 mt-4">
							<div className="text-gray-500 px-3 py-2 ">Tareas Checklist</div>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/tasks" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="/admin/tasks">
								<InboxIcon className="h-4 w-4" />
								Ver Tareas
							</Link>
							<Link
								className={`
									flex items-center gap-3 rounded-lg px-3 py-2 transition-all 
									${pathname.startsWith("/admin/tasks/assign")
										? "bg-gray-900 text-gray-50"
										: "text-gray-500 hover:text-gray-900"}`}
								href="/admin/tasks/assign">
								<PlusIcon className="h-4 w-4" />
								Asignar Tareas
							</Link>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname.startsWith("/admin/tasks/archived") ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="/admin/tasks/archived">
								<CalendarDaysIcon className="h-4 w-4" />
								Historial de Tareas
							</Link>
						</div>
						{/* ---- Caja ----- */}
						<div className="grid gap-1 mt-4">
							<div className="text-gray-500 px-3 py-2">Caja</div>
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<DollarSignIcon className="h-4 w-4" />
								Registro de Caja
							</Link>
							{/* <Link
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/-" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
								href="#">
								<ReceiptIcon className="h-4 w-4" />
								Anulaciones
							</Link> */}
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