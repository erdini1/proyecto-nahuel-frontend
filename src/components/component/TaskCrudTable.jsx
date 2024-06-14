import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function TaskCrudTable({ tasks, handleUpdateTask, handleDeleteTask }) {
	return (
		<div className="border shadow-sm rounded-lg">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[700px]">Descripción</TableHead>
						<TableHead className="w-[250px]">Sector</TableHead>
						<TableHead className="w-[200px]">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks.map((task) => (
						<TableRow key={task.id}>
							<TableCell>{task.description}</TableCell>
							<TableCell>{task.sector.charAt(0).toUpperCase() + task.sector.slice(1)}</TableCell>
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
									<Button
										variant="outline"
										size="icon"
										onClick={() => handleDeleteTask(task.id)}
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
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
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
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
			<path d="M10 11v6" />
			<path d="M14 11v6" />
			<path d="M5 6l1-2h12l1 2" />
		</svg>
	);
}