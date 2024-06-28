"use client";
import { useState, useEffect, useMemo } from "react";
import { getUserTasks, completeTask } from "@/service/taskService";
import TaskTableComplete from "@/components/component/TaskTableComplete";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Spinner from "@/components/component/Spinner";
import { getMyUser } from "@/service/userService";
import { UserIcon, CalendarDaysIcon, ClockIcon } from "@/components/icons/index";

export default function ChecklistPage() {
	const [userTasks, setUserTasks] = useState([]);
	const [userName, setUserName] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [filterByStatus, setFilterByStatus] = useState('all');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserTasks = async () => {
			try {
				setIsLoading(true);
				const userTasks = await getUserTasks(new Date().toLocaleDateString('en-CA'));
				setUserTasks(userTasks);

				const user = await getMyUser()
				setUserName(user.firstName + " " + user.lastName);
			} catch (error) {
				console.log('Failed to fetch tasks:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserTasks();
	}, []);

	const handleCompleteUserTask = async (taskId) => {
		try {
			await completeTask(taskId);
			setUserTasks(userTasks.map(userTask => userTask.Task.id === taskId ? { ...userTask, isCompleted: !userTask.isCompleted } : userTask));
		} catch (error) {
			console.error('Failed to complete task:', error);
		}
	};

	const filteredTasks = useMemo(() => {
		return userTasks.filter((userTask) => {
			const matchesDescription = userTask.Task.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = filterByStatus === 'all' ? true : userTask.isCompleted === filterByStatus;
			return matchesDescription && matchesStatus;
		});
	}, [userTasks, searchTerm, filterByStatus]);

	return (
		<div className="w-full mx-auto">
			<header className="flex h-14 lg:h-[60px] items-center border-b bg-gray-100/40 px-6 mb-5">
				<div className="flex-1">
					<h1 className="font-semibold text-lg">Tareas</h1>
				</div>
				<div className="px-3 flex items-center w-1/3">
					<div className="w-1/3 mb-2 my-2 shadow">
						<Select id="filterByStatus" value={filterByStatus} onValueChange={(value) => setFilterByStatus(value)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Filtrar por sector" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">- Estado -</SelectItem>
								<SelectItem value={true}>Completados</SelectItem>
								<SelectItem value={false}>Pendientes</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="w-2/3">
						<Label htmlFor="search" className="sr-only">Buscar tareas</Label>
						<Input
							id="search"
							placeholder="Buscar tareas..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="mb-2 mx-4 my-2 shadow"
						/>
					</div>
				</div>
			</header>
			<main className="flex gap-4 p-4 md:gap-8 md:p-6">
				<div className="border shadow-sm rounded-lg w-[1000px] mx-auto">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<>
							<div className="flex items-center justify-between bg-gray-100/40 px-6 py-4">
								<div className="flex items-center gap-4">
									<div className="font-semibold flex items-center gap-2">
										<UserIcon className="h-4 w-4" />
										{`${userName}`}
									</div>
									<div className="text-gray-500 flex items-center gap-2">
										<CalendarDaysIcon className="h-4 w-4" />
										{new Date().toLocaleDateString()}
									</div>
									{userTasks[0]?.shift && (
										<div className="text-gray-500 flex items-center gap-2">
											<ClockIcon className="h-4 w-4" />
											{userTasks[0]?.shift}
										</div>
									)}
								</div>
							</div>
							<TaskTableComplete
								tasks={filteredTasks}
								handleCompleteUserTask={handleCompleteUserTask}
							/>
						</>
					)}
				</div>
			</main>
		</div>
	);
}