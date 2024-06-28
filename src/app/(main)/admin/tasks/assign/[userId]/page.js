"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
import AssignTaskDialog from "@/components/component/AssignTaskDialog";
import AssignTaskTable from "@/components/component/AssignTaskTable";
import { getUserTasks, getAllTasks, assignTask, deleteUserTask } from "@/service/taskService";
import { Button } from "@/components/ui/button";
import ProgressChecklist from "@/components/component/progressChecklist";
import { ClipboardListIcon, PlusIcon, ArrowLeftIcon, UserIcon, CalendarDaysIcon, ClockIcon } from "@/components/icons/index";
import { useToast } from "@/components/ui/use-toast"
import { getUser } from "@/service/userService";
import Spinner from "@/components/component/Spinner";

export default function Page({ params }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [employee, setEmployee] = useState(params.userId);
	const [date, setDate] = useState(new Date());
	const [tasks, setTasks] = useState([]);
	const [userTasks, setUserTasks] = useState([]);
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { toast } = useToast()

	useEffect(() => {
		const fetchUserTasks = async () => {
			try {
				const employee = await getUser(params.userId);
				setEmployee(employee);

				setDate(date.toLocaleDateString('en-CA'))
				const userTasks = await getUserTasks(date, employee.id);
				setUserTasks(userTasks);

				const tasks = await getAllTasks();
				setTasks(tasks)

			} catch (error) {
				console.log('Failed to fetch all tasks:', error);
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

	const handleDeleteUserTask = async (userTaskId) => {
		try {
			await deleteUserTask(userTaskId);
			const userTasks = await getUserTasks(date, employee.id);
			setUserTasks(userTasks);
		} catch (error) {
			console.log('Failed to delete task:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al eliminar la tarea",
			})
		}
	};

	const handleAssignTasks = async (selectedTasks) => {
		try {
			await assignTask(selectedTasks, employee.id);
			toast({
				title: "Tareas Asignadas",
				description: "Tareas asignadas correctamente",
			})
			const userTasks = await getUserTasks(date, employee.id);
			setUserTasks(userTasks);
		} catch (error) {
			console.log('Failed to assign tasks:', error);
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
									<div className="font-semibold flex items-center gap-2">
										<UserIcon className="h-4 w-4" />
										{`${employee.firstName} ${employee.lastName}`}
									</div>
									<div className="text-gray-500 flex items-center gap-2">
										<CalendarDaysIcon className="h-4 w-4" />
										{new Date().toLocaleDateString()}
									</div>
									<div className="text-gray-500 flex items-center gap-2">
										<ClockIcon className="h-4 w-4" />
										{userTasks[0]?.shift}
									</div>
								</div>
							</div>
							<AssignTaskTable
								tasks={userTasks}
								handleDeleteUserTask={handleDeleteUserTask}
							/>
						</div>
						<div className="w-1/4">
							<ProgressChecklist
								tasksCompleted={userTasks.filter(task => task.isCompleted).length}
								totalTasks={userTasks.length}
							/>
						</div>
					</main>
				)}
				<AssignTaskDialog
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					tasks={filteredTasks}
					onAssignTasks={handleAssignTasks}
				/>
			</div>
		</div>
	);
}