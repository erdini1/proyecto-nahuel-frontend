import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClockIcon, CircleCheckIcon } from "@/components/icons";
import { BanIcon, CircleCheckBig, CircleMinus } from "lucide-react";

const TaskTableComplete = ({ tasks, handleCompleteUserTask, handleMarkTaskAsShouldDo }) => {
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
		<Table className="border border-gray-200 shadow-sm bg-[#31304D]/70">
			<TableHeader className="">
				<TableRow>
					<TableHead className="w-8/12 text-white">Descripción</TableHead>
					<TableHead className="w-2/12 text-white">Estado</TableHead>
					<TableHead className="w-2/12 text-white">Aplica</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className="divide-y-2">
				{tasks.length === 0 ? (
					<TableRow className="bg-[#e7e1e1]/70">
						<TableCell colSpan="3" className="text-center">No hay tareas para mostrar</TableCell>
					</TableRow>
				) : (
					tasks.map((userTask) => (
						<TableRow key={userTask.id} className="even:bg-[#e7e1e1]/70 odd:bg-[#e7e1e1]/80 hover:bg-[#e7e1e1]/90 transition-all">
							<TableCell colSpan={1} className={`flex justify-between items-center ${!userTask.shouldDo ? "text-gray-500 line-through" : ""}`}>
								{userTask.Task.description}
								{userTask.Task.type === "elaboration" && (
									<Input
										id="kilos"
										placeholder="Kg"
										value={kilosData[userTask.id]}
										onChange={(e) => handleKilosChange(userTask.id, e.target.value)}
										disabled={userTask.isCompleted || !userTask.shouldDo}
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
									disabled={!kilosData[userTask.id] && !userTask.isCompleted && userTask.Task.type === "elaboration" || !userTask.shouldDo}
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
							<TableCell colSpan={1}>
								{userTask.isOptional ? (
									<Button
										onClick={() => handleMarkTaskAsShouldDo(userTask.id)}
										className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 ${userTask.shouldDo
											? "text-white bg-slate-800 hover:bg-slate-600"
											: "text-white bg-red-500 hover:bg-red-600"
											}  ${userTask.isCompleted ? "hidden" : ""}`}
										disabled={userTask.isCompleted}
									>
										{userTask.shouldDo ? (
											<>
												<CircleCheckBig className="h-5 w-5" />
												Aplica
											</>
										) : (
											<>
												<BanIcon className="h-5 w-5" />
												No aplica
											</>
										)}
									</Button>
								) : ""}

							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
};

export default TaskTableComplete;