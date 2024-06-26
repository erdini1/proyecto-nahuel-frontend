import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenIcon, TrashIcon } from "@/components/icons/index";

export default function EmployeeCrudTable({ employees, handleUpdateEmployee, handleDeleteEmployee }) {
	const roles = {
		admin: "Admin",
		employee: "Empleado",
		cashier: "Cajero"
	};

	const translateRole = (role) => {
		switch (role) {
			case "admin":
				return roles.admin;
			case "employee":
				return roles.employee;
			case "cashier":
				return roles.cashier;
			default:
				return role;
		}
	};

	return (
		<div className="border shadow-sm rounded-lg">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-1/4">Nombre y Apellido</TableHead>
						<TableHead className="w-1/4">Numero de ingreso</TableHead>
						<TableHead className="w-1/4">Rol</TableHead>
						<TableHead className="w-1/4">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employees.map((employee) => (
						<TableRow key={employee.id}>
							<TableCell className="w-1/4">{employee.firstName} {employee.lastName}</TableCell>
							<TableCell className="w-1/4">{employee.number}</TableCell>
							<TableCell className="w-1/4">{translateRole(employee.role)}</TableCell>
							<TableCell className="w-1/4">
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => handleUpdateEmployee(employee.id)}
									>
										<FilePenIcon className="h-4 w-4" />
										<span className="sr-only">Editar</span>
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => handleDeleteEmployee(employee.id)}
									>
										<TrashIcon className="h-4 w-4" />
										<span className="sr-only">Eliminar</span>
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

