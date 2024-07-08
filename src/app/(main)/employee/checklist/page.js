"use client"
import React, { useState, useEffect } from 'react';
import { completeTask, getUserTaskByTaskSet } from '@/service/taskService';
import TaskTableComplete from '@/components/component/TaskTableComplete';
import AssignShift from '@/components/component/AssignShift';
import { UserIcon, CalendarDaysIcon, ClockIcon } from '@/components/icons/index';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Spinner from '@/components/component/Spinner';
import { getMyUser } from '@/service/userService';
import { getTaskSet, setShift, updateTaskSet } from '@/service/taskSetService';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function ChecklistPage() {
	const [userTasks, setUserTasks] = useState([]);
	const [taskSet, setTaskSet] = useState({});
	const [userName, setUserName] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [filterByStatus, setFilterByStatus] = useState('all');
	const [isLoading, setIsLoading] = useState(true);
	const [isShiftSelected, setIsShiftSelected] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { toast } = useToast();

	useEffect(() => {
		const fetchUserTasks = async () => {
			try {
				setIsLoading(true);
				const userTasks = await getUserTaskByTaskSet();
				setUserTasks(userTasks.filter(userTask => userTask.isActive));

				const user = await getMyUser();
				setUserName(`${user.firstName} ${user.lastName}`);

				const taskSet = await getTaskSet()
				setTaskSet(taskSet);

				const isShiftSet = taskSet.shift !== undefined && !taskSet.isClosed && taskSet.shift !== '';
				setIsShiftSelected(isShiftSet);
				setIsModalOpen(!isShiftSet);
			} catch (error) {
				toast({
					variant: "error",
					title: "Error",
					description: "Ocurrió un error al cargar las tareas",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserTasks();
	}, []);

	const handleCompleteUserTask = async (taskId) => {
		try {
			await completeTask(taskId);
			setUserTasks(userTasks.map(userTask =>
				userTask.Task.id === taskId ? { ...userTask, isCompleted: !userTask.isCompleted } : userTask
			));
		} catch (error) {
			toast({
				variant: "error",
				title: "Error",
				description: "Ocurrió un error al completar la tarea",
			});
		}
	};

	const filteredTasks = userTasks.filter(userTask => {
		const matchesDescription = userTask.Task.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = filterByStatus === 'all' ? true : userTask.isCompleted === filterByStatus;
		return matchesDescription && matchesStatus;
	});

	const handleShiftSelect = async (selectedShift) => {
		setIsShiftSelected(true);
		try {
			taskSet.shift === "" ? await updateTaskSet({ shift: selectedShift }) : await setShift({ shift: selectedShift });
			setTaskSet({ ...taskSet, shift: selectedShift });
			toast({
				variant: "error",
				title: "Error",
				description: "Turno seleccionado correctamente",
			});
		} catch (error) {
			toast({
				variant: "error",
				title: "Error",
				description: "Ocurrió un error al seleccionar el turno",
			});
		}
	};

	const handleCloseChecklist = async () => {
		try {
			await updateTaskSet({ isClosed: true });
			setTaskSet({ ...taskSet, isClosed: true });
			setIsShiftSelected(false);

		} catch (error) {
			console.error('Failed to close checklist:', error);
		}
	}

	return (
		<div className="w-full mx-auto">
			<header className="flex h-14 lg:h-[60px] items-center border-b bg-gray-100/40 px-6 mb-5">
				<div className="flex-1">
					<h1 className="font-semibold text-lg">Tareas</h1>
				</div>
				<div className="flex items-center justify-between bg-gray-100/40 px-6 py-4">
					<div className="flex items-center gap-4">
						{userName && (
							<div className="font-semibold flex items-center gap-2">
								<UserIcon className="h-4 w-4" />
								{userName}
							</div>
						)}
						<div className="text-gray-500 flex items-center gap-2">
							<CalendarDaysIcon className="h-4 w-4" />
							{new Date().toLocaleDateString()}
						</div>
						{taskSet.shift && (
							<div className="text-gray-500 flex items-center gap-2">
								<ClockIcon className="h-4 w-4" />
								{taskSet.shift}
							</div>
						)}
					</div>
				</div>
				<div className="px-3 flex items-center w-1/3">
					<div className="w-1/3 mb-2 my-2 shadow">
						<Select id="filterByStatus" value={filterByStatus} onValueChange={value => setFilterByStatus(value)}>
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
							onChange={e => setSearchTerm(e.target.value)}
							className="mb-2 mx-4 my-2 shadow"
						/>
					</div>
				</div>
			</header>
			<main className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
				<div className="border shadow-sm rounded-lg w-[1000px] mx-auto">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<>
							<AssignShift
								isOpen={isModalOpen}
								onClose={() => setIsModalOpen(false)}
								onShiftSelect={handleShiftSelect}
							/>
							<TaskTableComplete
								tasks={filteredTasks}
								handleCompleteUserTask={handleCompleteUserTask}
							/>
						</>
					)}
				</div>
				{filteredTasks.length !== 0 && (
					<Link href="/cashier">
						<Button
							onClick={handleCloseChecklist}
							className={`flex items-center rounded-md transition-colors duration-300 w-1/4 mx-auto`}
						>
							Cerrar Checklist
						</Button>
					</Link>
				)}
			</main>
		</div>
	);
}
