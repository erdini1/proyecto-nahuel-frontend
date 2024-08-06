"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	ClipboardListIcon,
	UserPlusIcon,
	InboxIcon,
	DollarSignIcon,
	PlusIcon,
	CalendarDaysIcon,
	MixerVertical,
	MixerHorizontal,
	MenuIcon,
	CrossIcon
} from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
	const pathname = usePathname();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="lg:relative lg:block">
			<Button
				variant="outline"
				className="fixed top-4 left-4 z-20 lg:hidden"
				onClick={toggleSidebar}
			>
				{isSidebarOpen ? <CrossIcon className="h-6 w-6 text-gray-900" /> : <MenuIcon className="h-6 w-6 text-gray-900" />}
			</Button>

			{/* Sidebar */}
			<div
				className={`fixed top-0 left-0 h-full w-64 bg-gray-100/90 border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:block z-10 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
					}`}
			>
				<div className="flex flex-col gap-2 py-14 lg:py-2">
					<div className="flex h-[60px] items-center px-6 gap-2 font-semibold">
						<ClipboardListIcon className="h-6 w-6" />
						<span className="">Admin Dashboard</span>
					</div>
					<div className="flex-1">
						<nav className="grid items-start px-4 text-sm font-medium">
							<div className="grid gap-1 mt-4">
								<div className="text-gray-500 px-3 py-2">General</div>
								<Link
									href="/admin/general"
									className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/general" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
									prefetch={false}
								>
									<MixerHorizontal className="h-4 w-4" />
									Sectores, Cajas
								</Link>
								<Link
									href="/admin/general-cash"
									className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/general-cash" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
									prefetch={false}
								>
									<MixerVertical className="h-4 w-4" />
									Proveedores, Terminales
								</Link>
							</div>
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
									className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/cash-register" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
									href="/admin/cash-register">
									<DollarSignIcon className="h-4 w-4" />
									Registro de Caja
								</Link>
							</div>
						</nav>
					</div>
				</div>
			</div>
		</div>
	);
}


// "use client";
// import Link from "next/link"
// import { usePathname } from "next/navigation";
// import { ClipboardListIcon, UserPlusIcon, InboxIcon, DollarSignIcon, PlusIcon, BarChartIcon, ReceiptIcon, CalendarDaysIcon, GearIcon, MixerVertical, MixerHorizontal } from "@/components/icons";

// export default function Sidebar() {

// 	const pathname = usePathname();

// 	return (
// 		<div className="hidden border-r bg-gray-100/40 lg:block">
// 			<div className="flex flex-col gap-2">
// 				<div className="flex h-[60px] items-center px-6">
// 					<Link className="flex items-center gap-2 font-semibold" href="/admin/dashboard">
// 						<ClipboardListIcon className="h-6 w-6" />
// 						<span className="">Admin Dashboard</span>
// 					</Link>
// 				</div>
// 				<div className="flex-1">
// 					<nav className="grid items-start px-4 text-sm font-medium">
// 						<div className="grid gap-1 mt-4">
// 							<div className="text-gray-500 px-3 py-2">General</div>
// 							<Link
// 								href="/admin/general"
// 								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/general" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
// 								prefetch={false}
// 							>
// 								<MixerHorizontal className="h-4 w-4" />
// 								Sectores, Cajas
// 							</Link>
// 							<Link
// 								href="/admin/general-cash"
// 								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/general-cash" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
// 								prefetch={false}
// 							>
// 								<MixerVertical className="h-4 w-4" />
// 								Proveedores, Terminales
// 							</Link>
// 						</div>
// 						{/* ---- Empleados ----- */}
// 						<div className="grid gap-1 mt-4">
// 							<div className="text-gray-500 px-3 py-2">Empleados</div>
// 							<Link
// 								href="/admin/employee/register"
// 								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/employee/register" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
// 								prefetch={false}
// 							>
// 								<UserPlusIcon className="h-4 w-4" />
// 								Gestionar usuarios
// 							</Link>
// 						</div>
// 						{/* ---- Tareas ----- */}
// 						<div className="grid gap-1 mt-4">
// 							<div className="text-gray-500 px-3 py-2 ">Tareas Checklist</div>
// 							<Link
// 								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/tasks" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
// 								href="/admin/tasks">
// 								<InboxIcon className="h-4 w-4" />
// 								Ver Tareas
// 							</Link>
// 							<Link
// 								className={`
// 									flex items-center gap-3 rounded-lg px-3 py-2 transition-all
// 									${pathname.startsWith("/admin/tasks/assign")
// 										? "bg-gray-900 text-gray-50"
// 										: "text-gray-500 hover:text-gray-900"}`}
// 								href="/admin/tasks/assign">
// 								<PlusIcon className="h-4 w-4" />
// 								Asignar Tareas
// 							</Link>
// 							<Link
// 								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname.startsWith("/admin/tasks/archived") ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
// 								href="/admin/tasks/archived">
// 								<CalendarDaysIcon className="h-4 w-4" />
// 								Historial de Tareas
// 							</Link>
// 						</div>
// 						{/* ---- Caja ----- */}
// 						<div className="grid gap-1 mt-4">
// 							<div className="text-gray-500 px-3 py-2">Caja</div>
// 							<Link
// 								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === "/admin/cash-register" ? "bg-gray-900 text-gray-50" : "text-gray-500 hover:text-gray-900"}`}
// 								href="/admin/cash-register">
// 								<DollarSignIcon className="h-4 w-4" />
// 								Registro de Caja
// 							</Link>
// 						</div>
// 					</nav>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }