"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClockIcon, CircleCheckIcon } from "@/components/icons";

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
									className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 ${userTask.isCompleted
										? "text-white bg-green-500 hover:bg-green-600"
										: "text-white bg-yellow-500 hover:bg-yellow-600"
										}`}
								>
									{userTask.isCompleted ? (
										<>
											<CircleCheckIcon className="h-5 w-5" />
											Completado
										</>
									) : (
										<>
											<ClockIcon className="h-5 w-5" />
											Pendiente
										</>
									)}
								</Button>
							</TableCell>
						</TableRow>
					)))}
			</TableBody>
		</Table>
	);
};

export default TaskTableComplete;
