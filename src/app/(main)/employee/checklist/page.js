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
import { Textarea } from "@/components/ui/textarea"
import Spinner from '@/components/component/Spinner';
import { getMyUser } from '@/service/userService';
import { getTaskSet, setShift, updateTaskSet } from '@/service/taskSetService';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function ChecklistPage() {
	const [userTasks, setUserTasks] = useState([]);
	const [taskSet, setTaskSet] = useState({});
	const [userName, setUserName] = useState('');
	const [observations, setObservations] = useState('');
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

				const [
					userTasks,
					user,
					taskSet,
				] = await Promise.all([
					getUserTaskByTaskSet(),
					getMyUser(),
					getTaskSet()
				]);

				setUserTasks(userTasks.filter(userTask => userTask.isActive));
				setUserName(`${user.firstName} ${user.lastName}`);
				setTaskSet(taskSet);

				const isShiftSet = taskSet.shift !== undefined && !taskSet.isClosed && taskSet.shift !== '';
				setIsShiftSelected(isShiftSet);
				setIsModalOpen(!isShiftSet);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al cargar las tareas",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserTasks();
	}, []);

	const handleCompleteUserTask = async (taskId, kilos) => {
		try {
			await completeTask(taskId, kilos);
			setUserTasks(userTasks.map(userTask =>
				userTask.Task.id === taskId ? { ...userTask, isCompleted: !userTask.isCompleted, kilos } : userTask
			));
		} catch (error) {
			toast({
				variant: "destructive",
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
				title: "Turno seleccionado",
				description: "Turno seleccionado correctamente",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al seleccionar el turno",
			});
		}
	};

	const handleCloseChecklist = async () => {
		try {
			await updateTaskSet({
				observations,
				isClosed: true
			});
			setTaskSet({ ...taskSet, isClosed: true });
			setIsShiftSelected(false);
			toast({
				title: "Checklist cerrado",
				description: "Checklist cerrado correctamente",
			});

		} catch (error) {
			toast({
				variant: "error",
				title: "Error",
				description: "Ocurrió un error al cerrar el checklist",
			});
		}
	}

	return (
		<div className="w-full mx-auto from-slate-300 to-slate-400 bg-gradient-to-b h-auto min-h-screen">
			<header className="flex h-14 lg:h-[60px] items-center border-b bg-gray-100/70 backdrop-blur-md px-6 mb-5">
				<div className="flex-1 opacity-0 pointer-events-none">
					<h1 className="font-semibold text-lg">Tareas</h1>
				</div>
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-4">
						{userName && (
							<div className="font-semibold flex items-center gap-2 capitalize">
								<UserIcon className="h-4 w-4" />
								{userName}
							</div>
						)}
						<div className="text-gray-500 flex items-center gap-2">
							<CalendarDaysIcon className="h-4 w-4" />
							{new Date().toLocaleDateString()}
						</div>
						{taskSet?.shift && (
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
				<div className="border shadow-md rounded-lg w-3/4 mx-auto bg-slate-100/70 backdrop-blur-lg p-3">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<div className='flex flex-col gap-5 pb-4'>
							<AssignShift
								isOpen={isModalOpen}
								onClose={() => setIsModalOpen(false)}
								onShiftSelect={handleShiftSelect}
							/>
							<TaskTableComplete
								tasks={filteredTasks}
								handleCompleteUserTask={handleCompleteUserTask}
							/>
							{filteredTasks.length !== 0 && (
								<div className='flex flex-col gap-4 items-center'>
									<div className="w-full max-w-lg">
										<Label htmlFor="observations">Observaciones:</Label>
										<Textarea
											placeholder="Escribe tus observaciones..."
											id="observations"
											value={observations}
											onChange={(e) => setObservations(e.target.value)}
											className="border shadow"
										/>
									</div>
									<Link href="/cashier" className='w-full max-w-md'>
										<Button
											className='w-full shadow'
											onClick={handleCloseChecklist}
										>
											Cerrar Checklist
										</Button>
									</Link>
								</div>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}