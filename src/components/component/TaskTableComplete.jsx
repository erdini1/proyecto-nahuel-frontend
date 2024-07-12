import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClockIcon, CircleCheckIcon } from "@/components/icons";

const TaskTableComplete = ({ tasks, handleCompleteUserTask }) => {
	const initializeKilosData = () => {
		return tasks.reduce((acc, task) => {
			acc[task.id] = task.kilos || "";
			return acc;
		}, {});
	};

	const [kilosData, setKilosData] = useState(initializeKilosData);

	const handleKilosChange = (taskId, value) => {
		setKilosData({
			...kilosData,
			[taskId]: value,
		});
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-5/6">Descripción</TableHead>
					<TableHead className="w-1/6">Estado</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{tasks.length === 0 ? (
					<TableRow>
						<TableCell colSpan="2" className="text-center">No hay tareas para mostrar</TableCell>
					</TableRow>
				) : (
					tasks.map((userTask) => (
						<TableRow key={userTask.id}>
							<TableCell colSpan={1} className="flex justify-between items-center">
								{userTask.Task.description}
								{userTask.Task.type === "elaboration" && (
									<Input
										id="kilos"
										placeholder="Kg"
										value={kilosData[userTask.id]}
										onChange={(e) => handleKilosChange(userTask.id, e.target.value)}
										disabled={userTask.isCompleted}
										className="w-[70px] text-center border shadow"
									/>
								)}
							</TableCell>
							<TableCell colSpan={1}>
								<Button
									onClick={() => handleCompleteUserTask(userTask.Task.id, kilosData[userTask.id])}
									className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 ${userTask.isCompleted
										? "text-white bg-green-500 hover:bg-green-600"
										: "text-white bg-yellow-500 hover:bg-yellow-600"
										}`}
									disabled={!kilosData[userTask.id] && !userTask.isCompleted && userTask.Task.type === "elaboration"}
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
					))
				)}
			</TableBody>
		</Table>
	);
};

export default TaskTableComplete;