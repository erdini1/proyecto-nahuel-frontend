"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CheckIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";

const TaskTableComplete = ({ tasks, handleCompleteUserTask }) => {

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-3/4">Descripción</TableHead>
					<TableHead className="w-1/4">Estado</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{tasks.length === 0 ? (
					<TableRow>
						<TableCell colSpan="2" className="text-center">No posee tareas asignadas</TableCell>
					</TableRow>
				) : (
					tasks.map((userTask) => (
						<TableRow key={userTask.id}>
							<TableCell>{userTask.Task.description}</TableCell>
							<TableCell>
								<Button
									onClick={() => handleCompleteUserTask(userTask.Task.id)}
									className={`flex items-center gap-1.5 ${userTask.isCompleted ? "text-green-500 bg-gray-100/30 " : ""}`}
									variant={userTask.isCompleted ? "outline" : ""}
								>
									{userTask.isCompleted ? "": <CheckIcon className="h-4 w-4 mr-2" />}
									{userTask.isCompleted ? "Completado" : "Pendiente"}
								</Button>

							</TableCell>
						</TableRow>
					)))}
			</TableBody>
		</Table>
	);
};

export default TaskTableComplete;
