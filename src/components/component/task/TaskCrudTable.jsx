import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { FilePenIcon, TrashIcon } from "@/components/icons/index";
import { translateTypeTask } from "@/helpers/task.helper";

export default function TaskCrudTable({ tasks, handleUpdateTask, handleDeleteTask }) {
	return (
		<div className="border shadow-sm rounded-lg">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-9/12">Descripción</TableHead>
						<TableHead className="w-1/12">Sector</TableHead>
						<TableHead className="w-1/12">Tipo</TableHead>
						<TableHead className="w-1/12">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks.length === 0 ? (
						<TableRow>
							<TableCell colSpan="4" className="text-center">No hay tareas registradas</TableCell>
						</TableRow>
					) : (
						tasks.map((task) => (
							<TableRow key={task.id}>
								<TableCell>{task.description}</TableCell>
								<TableCell>{task.Sector.name}</TableCell>
								<TableCell>{translateTypeTask(task.type)}</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleUpdateTask(task.id)}
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
													<AlertDialogTitle>Esta seguro que desea eliminar la tarea?</AlertDialogTitle>
													<AlertDialogDescription>
														Esta acción no se puede deshacer. Esta seguro que desea eliminar la tarea?
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancelar</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleDeleteTask(task.id)}
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