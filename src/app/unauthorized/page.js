import Link from "next/link"

export default function Unauthorized() {
	return (
		<div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-gray-100 px-4 ">
			<div className="max-w-md space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Acceso denegado</h1>
				<p className="text-gray-500">
					Lo sentimos, no tienes los permisos necesarios para acceder a esta página. Por favor, contacta con el
					administrador si crees que esto es un error.
				</p>
				<div className="flex justify-center">
					<Link
						href="/employee"
						className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 "
						prefetch={false}
					>
						Volver al inicio
					</Link>
				</div>
			</div>
		</div>
	)
}