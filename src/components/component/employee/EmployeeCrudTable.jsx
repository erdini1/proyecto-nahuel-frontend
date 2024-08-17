import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenIcon, TrashIcon } from "@/components/icons/index";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";

export default function EmployeeCrudTable({ employees, handleUpdateEmployee, handleDeleteEmployee }) {

	return (
		<div className="border shadow-sm rounded-lg">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-1/6">Nombre y Apellido</TableHead>
						<TableHead className="w-1/6">Numero de ingreso</TableHead>
						<TableHead className="w-3/6">Sector</TableHead>
						<TableHead className="w-1/6">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employees.length === 0 ? (
						<TableRow>
							<TableCell colSpan="4" className="text-center">No hay usuarios registrados</TableCell>
						</TableRow>
					) : (
						employees.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell className="w-1/6 capitalize">{employee.firstName} {employee.lastName}</TableCell>
								<TableCell className="w-1/6">{employee.number}</TableCell>
								<TableCell className="w-3/6 uppercase mt-2 gap-2">
									<div className="flex flex-wrap gap-1">
										{employee.Sectors?.map((sector, index) => (
											<Badge
												className="bg-gray-600 flex-1 min-w-[25%] max-w-[30%] justify-center"
												key={sector.id}
											>
												{sector.name}
											</Badge>
										))}
									</div>
								</TableCell>
								<TableCell className="w-1/6">
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleUpdateEmployee(employee.id)}
										>
											<FilePenIcon className="h-4 w-4" />
											<span className="sr-only">Editar</span>
										</Button>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="outline"
													size="icon"
												>
													<TrashIcon className="h-4 w-4" />
													<span className="sr-only">Eliminar</span>
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Esta seguro que desea eliminar el usuario?</AlertDialogTitle>
													<AlertDialogDescription>
														Esta acción no se puede deshacer. Esto eliminará permanentemente su cuenta y removerá los datos de los servidores.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancelar</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleDeleteEmployee(employee.id)}
													>Continuar</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

