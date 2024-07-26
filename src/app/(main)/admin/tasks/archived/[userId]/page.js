"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AssignTaskTable from "@/components/component/assign/AssignTaskTable";
import { deleteUserTask, getUserTasksByTaskSetId } from "@/service/taskService";
import { Button } from "@/components/ui/button";
import ProgressChecklist from "@/components/component/progressChecklist";
import { ArrowLeftIcon, UserIcon, CalendarDaysIcon, ClockIcon } from "@/components/icons/index";
import { useToast } from "@/components/ui/use-toast"
import { getUser } from "@/service/userService";
import Spinner from "@/components/component/Spinner";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
import { useSearchParams } from 'next/navigation'
import ObservationChecklist from "@/components/component/ObservationChecklist";

export default function Page({ params }) {
	const [employee, setEmployee] = useState(params.userId);
	const [taskSetId, setTaskSetId] = useState();
	const [userTasks, setUserTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isArchived, setIsArchived] = useState(true);

	const { toast } = useToast()
	const searchParams = useSearchParams()

	useEffect(() => {
		const fetchUserTasks = async () => {
			const taskSetIdSearch = searchParams.get('taskSetId')

			try {
				const employee = await getUser(params.userId);
				setEmployee(employee);

				setTaskSetId(taskSetIdSearch)

				const userTasks = await getUserTasksByTaskSetId(taskSetIdSearch);
				setUserTasks(userTasks);

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

	const handleDeleteUserTask = async (userTaskId) => {
		try {
			await deleteUserTask(userTaskId);
			const userTasks = await getUserTasksByTaskSetId(taskSetId);
			setUserTasks(userTasks);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al eliminar la tarea",
			})
		}
	};

	return (
		<div className="min-h-screen">
			<div className="flex flex-col">
				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
					<div className="flex-1">
						<h1 className="font-semibold text-lg">Historial de Tareas</h1>
					</div>
					<div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
						<Link href="/admin/tasks/archived">
							<Button
								variant="outline"
								className="flex items-center gap-1.5"
							>
								<ArrowLeftIcon className="h-4 w-4" />
								Seleccionar otra fecha
							</Button>
						</Link>
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
										{`${employee?.firstName} ${employee?.lastName}`}
									</div>
									{userTasks[0]?.createdAt && (
										<div className="text-gray-500 flex items-center gap-2">
											<CalendarDaysIcon className="h-4 w-4" />
											{format(toZonedTime(userTasks[0].createdAt, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy')}
										</div>
									)}
									{userTasks[0]?.TaskSet.shift && (
										<div className="text-gray-500 flex items-center gap-2">
											<ClockIcon className="h-4 w-4" />
											{userTasks[0].TaskSet.shift}
										</div>
									)}
								</div>
							</div>
							<AssignTaskTable
								tasks={userTasks}
								handleDeleteUserTask={handleDeleteUserTask}
								isArchived={isArchived}
							/>
						</div>
						<div className="w-1/4 flex flex-col gap-4">
							<ProgressChecklist
								tasksCompleted={userTasks.filter(task => task.isCompleted).length}
								totalTasks={userTasks.length}
							/>
							<ObservationChecklist
								observations={userTasks[0]?.TaskSet.observations}
							/>
						</div>
					</main>
				)}
			</div>
		</div>
	);
}