import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
						<TableHead>Nombre y Apellido</TableHead>
						<TableHead>Numero de ingreso</TableHead>
						<TableHead>Rol</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employees.map((employee) => (
						<TableRow key={employee.id}>
							<TableCell>{employee.firstName} {employee.lastName}</TableCell>
							<TableCell>{employee.number}</TableCell>
							<TableCell>{translateRole(employee.role)}</TableCell>
							<TableCell>
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

function FilePenIcon(props) {
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
			<path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
			<path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
		</svg>
	);
}

function TrashIcon(props) {
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
			<path d="M3 6h18" />
			<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
			<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
		</svg>
	);
}
