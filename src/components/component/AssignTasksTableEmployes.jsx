import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ListTodoIcon } from "@/components/icons/index";
import Link from "next/link";

export default function AssignTasksTableEmpoyes({ employees, userTasks }) {

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{employees.map((employee) => {
				const tasksForEmployee = userTasks.filter(userTask => (userTask.User.id === employee.id));
				const completedTasks = tasksForEmployee.filter(userTask => userTask.isCompleted).length;
				const totalTasks = tasksForEmployee.length;
				const completionPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

				return (
					<div key={employee.id} className="bg-white rounded-lg shadow-md border p-4 flex flex-col">
						<div className="flex items-center justify-between mb-4">
							<div className="font-semibold text-lg">{employee.firstName} {employee.lastName}</div>
							<Link href={`/admin/tasks/assign/${employee.id}`}>
								<Button variant="outline" size="icon">
									<ListTodoIcon className="w-5 h-5" />
								</Button>
							</Link>
						</div>
						<div className="flex items-center justify-between mb-2">
							<div className="text-muted-foreground">
								{completedTasks} / {totalTasks} <span className="text-sm">tareas completadas</span>
							</div>
							<div
								className={`px-2 py-1 rounded-full text-xs font-medium ${completionPercentage === 100
									? "bg-green-500 text-green-50"
									: "bg-yellow-500 text-yellow-50"
									}`}
							>
								{Math.round(completionPercentage)}%
							</div>
						</div>
						<div className="flex-1 flex items-center justify-center">
							<div className="w-full bg-muted rounded-full h-2">
								<Progress
									className="border"
									value={Math.round(completionPercentage)}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}


// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { FilePenIcon, TrashIcon } from "@/components/icons/index";
// import { translateRole } from "@/helpers/role.helper";

// export default function AssignTasksTableEmployes({ employees/* , handleUpdateEmployee, handleDeleteEmployee */ }) {

// 	return (
// 		<div className="border shadow-sm rounded-lg">
// 			<Table>
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead className="w-1/3">Nombre y Apellido</TableHead>
// 						<TableHead className="w-1/3">Rol</TableHead>
// 						<TableHead className="w-1/3">Acciones</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					{employees.map((employee) => (
// 						<TableRow key={employee.id}>
// 							<TableCell className="w-1/3">{employee.firstName} {employee.lastName}</TableCell>
// 							<TableCell className="w-1/3">{translateRole(employee.role)}</TableCell>
// 							<TableCell className="w-1/3">
// 								<div className="flex items-center gap-2">
// 									<Button
// 										variant="outline"
// 										// size="icon"
// 										// onClick={() => handleUpdateEmployee(employee.id)}
// 									>
// 										<FilePenIcon className="h-4 w-4" />
// 										<span /* className="sr-only" */>Ver Checklist</span>
// 									</Button>
// 								</div>
// 							</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }

