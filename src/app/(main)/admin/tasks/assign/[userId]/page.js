"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AssignTaskDialog from "@/components/component/assign/AssignTaskDialog";
import AssignTaskTable from "@/components/component/assign/AssignTaskTable";
import { getAllTasks, assignTask, getUserTaskByTaskSet, disableUserTask } from "@/service/taskService";
import { Button } from "@/components/ui/button";
import ProgressChecklist from "@/components/component/progressChecklist";
import { PlusIcon, ArrowLeftIcon, UserIcon, CalendarDaysIcon, ClockIcon } from "@/components/icons/index";
import { useToast } from "@/components/ui/use-toast"
import { getUser } from "@/service/userService";
import Spinner from "@/components/component/Spinner";
import { getAllSectors } from "@/service/sectorService";
import ObservationChecklist from "@/components/component/ObservationChecklist";

export default function Page({ params }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [employee, setEmployee] = useState(params.userId);
	const [tasks, setTasks] = useState([]);
	const [userTasks, setUserTasks] = useState([]);
	const [sectors, setSectors] = useState([]);
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { toast } = useToast()

	useEffect(() => {
		const fetchUserTasks = async () => {
			try {

				const employee = await getUser(params.userId);
				setEmployee(employee);

				const [
					userTasks,
					tasks,
					sectors,
				] = await Promise.all([
					getUserTaskByTaskSet(employee.id),
					getAllTasks(),
					getAllSectors()
				]);

				setUserTasks(userTasks);
				setTasks(tasks)
				setSectors(sectors.filter(sector => sector.isActive) || []);

			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al mostrar las tareas",
				})
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserTasks();
	}, []);

	useEffect(() => {
		filterUnassignedTasks();
	}, [tasks, userTasks]);

	const handleOpenDialog = () => {
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	const filterUnassignedTasks = () => {
		const assignedTaskIds = userTasks.map(usertTask => usertTask.Task.id);
		const unassignedTasks = tasks.filter(task => !assignedTaskIds.includes(task.id));
		setFilteredTasks(unassignedTasks);
	};

	const handleDisableUserTask = async (userTaskId, isActive) => {
		try {
			await disableUserTask(userTaskId, isActive);
			const userTasks = await getUserTaskByTaskSet(employee.id);
			setUserTasks(userTasks);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al eliminar la tarea",
			})
		}
	};

	const handleAssignTasks = async (selectedTasks, periodicity) => {
		try {
			await assignTask(selectedTasks, employee.id, periodicity);
			toast({
				title: "Tareas Asignadas",
				description: "Tareas asignadas correctamente",
			})
			const userTasks = await getUserTaskByTaskSet(employee.id);
			setUserTasks(userTasks);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al asignar las tareas",
			})
		}
		handleCloseDialog();
	};

	return (
		<div className="min-h-screen">
			<div className="flex flex-col">
				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
					<div className="flex-1">
						<h1 className="font-semibold text-lg">Tareas</h1>
					</div>
					<div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
						<Link href="/admin/tasks/assign">
							<Button
								variant="outline"
								className="flex items-center gap-1.5"
							>
								<ArrowLeftIcon className="h-4 w-4" />
								Seleccionar otro empleado
							</Button>
						</Link>
						<Button
							onClick={handleOpenDialog}
							className="flex items-center gap-1.5"
						>
							<PlusIcon className="h-4 w-4 mr-2" />
							Asignar Tareas
						</Button>
					</div>
				</header>
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Spinner />
					</div>
				) : (
					<main className="flex gap-4 p-4 md:gap-8 md:p-6">
						<div className="border shadow-sm rounded-lg w-3/4">
							<div className="flex items-center justify-between bg-gray-100/40 px-6 py-4">
								<div className="flex items-center gap-4">
									<div className="font-semibold flex items-center gap-2 capitalize">
										<UserIcon className="h-4 w-4" />
										{`${employee.firstName} ${employee.lastName}`}
									</div>
									<div className="text-gray-500 flex items-center gap-2">
										<CalendarDaysIcon className="h-4 w-4" />
										{new Date().toLocaleDateString()}
									</div>
									{userTasks[0]?.TaskSet?.shift && (
										<div className="text-gray-500 flex items-center gap-2">
											<ClockIcon className="h-4 w-4" />
											{userTasks[0].TaskSet.shift}
										</div>
									)}
								</div>
							</div>
							<AssignTaskTable
								tasks={userTasks}
								handleDisableUserTask={handleDisableUserTask}
							/>
						</div>
						<div className="w-1/4 flex flex-col gap-4">
							<ProgressChecklist
								tasksCompleted={userTasks.filter(task => task.isCompleted).length}
								totalTasks={userTasks.filter(task => task.isActive).length}
							/>
							<ObservationChecklist
								observations={userTasks[0]?.TaskSet.observations}
							/>
						</div>
					</main>
				)}
				<AssignTaskDialog
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					tasks={filteredTasks}
					sectors={sectors}
					onAssignTasks={handleAssignTasks}
				/>
			</div>
		</div>
	);
}