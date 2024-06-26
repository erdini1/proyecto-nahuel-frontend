import Link from "next/link"
import { HomeIcon } from "@radix-ui/react-icons"
import { PowerIcon } from "@/components/icons"

export default function Navbar() {
	return (
		<header className="bg-gray-900 shadow">
			<div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
				<div>
					<Link href="/cashier" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 " prefetch={false}>
						<HomeIcon className="h-5 w-5 text-white" />
						<span className="text-xl font-bold text-white">INICIO</span>
					</Link>
				</div>
				<div className="flex items-center gap-14 ">
					<Link href="/logout" className="flex items-center gap-2 text-gray-700 hover:text-gray-900" prefetch={false}>
						<PowerIcon className="h-5 w-5 text-white" />
						<span className="font-medium text-white">Cerrar Sesión</span>
					</Link>
				</div>
			</div>
		</header>
	)
}

