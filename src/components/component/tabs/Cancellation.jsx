import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function Cancellations() {
	return (
		<div className="w-1/2">
			<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
				<div className="flex-1">
					<h1 className="font-semibold text-lg">Anulaciones</h1>
				</div>
				<div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
					<Button
						// onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-1.5 align-middle"
					>
						<PlusIcon className="h-4 w-4 mr-2" />
						Cargar Anulación
					</Button>
				</div>
			</header>
			<div className="border shadow-sm rounded-lg" >
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>N° de Caja</TableHead>
							<TableHead>Cajero</TableHead>
							<TableHead>Fecha</TableHead>
							<TableHead>Monto</TableHead>
							<TableHead>Motivo</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">001</TableCell>
							<TableCell>Juan Pérez</TableCell>
							<TableCell>2023-06-01</TableCell>
							<TableCell>$500.00</TableCell>
							<TableCell>Error en registro</TableCell>
							<TableCell className="text-right">
								<Button variant="outline" size="icon">
									<EyeIcon className="h-4 w-4" />
									<span className="sr-only">Ver Detalles</span>
								</Button>
								<Button variant="outline" size="icon">
									<DownloadIcon className="h-4 w-4" />
									<span className="sr-only">Exportar</span>
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div >
		</div >
	)
}

function DownloadIcon(props) {
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
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" x2="12" y1="15" y2="3" />
		</svg>
	)
}


function EyeIcon(props) {
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
			<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	)
}

function PlusIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}