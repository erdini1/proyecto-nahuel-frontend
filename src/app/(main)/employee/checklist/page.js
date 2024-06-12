"use client"
import React, { useEffect, useState } from 'react';
import { completeTask, getUserTasks } from '@/service/taskService';

const ChecklistPage = () => {
	const [userTasks, setUserTasks] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [userName, setUserName] = useState('Empleado');

	const date = new Date().toISOString().split('T')[0];

	useEffect(() => {
		const fetchUserTasks = async () => {
			try {
				const data = await getUserTasks(date);
				setUserTasks(data);
				setUserName(data[0]?.User.firstName + " " + data[0]?.User.lastName);
			} catch (error) {
				console.log('Failed to fetch tasks:', error);
			}
		};
		fetchUserTasks();
	}, [date]);

	const handleCompleteUserTask = async (taskId) => {
		try {
			await completeTask(taskId);
			setUserTasks(userTasks.map(userTask => userTask.Task.id === taskId ? { ...userTask, isCompleted: true } : userTask));
		} catch (error) {
			console.error('Failed to complete task:', error);
		}
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const filteredTasks = userTasks.filter(userTask =>
		userTask.Task.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-2xl font-bold text-center mb-6">Tareas Diarias</h1>
			<div className="flex justify-between items-center mb-4">
				<p className="text-lg"><strong>Turno:</strong> {userTasks[0]?.shift || 'N/A'}</p>
				<p className="text-lg"><strong>Fecha:</strong> {date}</p>
				<p className="text-lg"><strong>Responsable:</strong> {userName}</p>
			</div>
			<input
				type="text"
				className="w-full p-2 mb-4 border border-gray-300 rounded-md"
				placeholder="Buscar Tareas"
				value={searchQuery}
				onChange={handleSearchChange}
			/>
			{filteredTasks.length === 0 ? (
				<p className="text-center text-lg">No se encontraron tareas</p>
			) : (
				<table className="min-w-full bg-white">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b-2 border-gray-300 text-center">Descripción</th>
							<th className="py-2 px-4 border-b-2 border-gray-300 text-center">Estado</th>
						</tr>
					</thead>
					<tbody>
						{filteredTasks.map((userTask) => (
							<tr key={userTask.id}>
								<td className="py-2 px-4 border-b border-gray-300 text-center">{userTask.Task.description}</td>
								<td className="py-2 px-4 border-b border-gray-300 text-center">
									<button
										className={`py-2 px-4 rounded-md ${userTask.isCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
										onClick={() => handleCompleteUserTask(userTask.Task.id)}
										disabled={userTask.isCompleted}
									>
										{userTask.isCompleted ? 'Completado' : 'Completar'}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default ChecklistPage;
