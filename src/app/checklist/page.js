"use client"
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '@/components/Title';

import useToken from '@/hooks/user.hook';
import { completeTask, getUserTasks } from '@/service/taskService';
import { useState, useEffect } from 'react';

const ChecklistPage = () => {

	// Ver bien como usar el useToken
	useToken();
	const [userTasks, setUserTasks] = useState([]);
	const date = new Date().toISOString().split('T')[0];

	useEffect(() => {
		const fetchUserTasks = async () => {
			try {
				const data = await getUserTasks(date);
				console.log('Fetched tasks:', data);
				setUserTasks(data);
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

	return (
		<React.Fragment>
			<Title>Tareas</Title>
			{
				userTasks.length === 0 ? (
					<p>No tasks for today.</p>
				) : (
					<Table size="small">
						<TableHead>
							<TableRow className='justify-center'>
								<TableCell align='center'>Descripción</TableCell>
								<TableCell align='center'>Estado</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{userTasks.map((userTask) => (
								<TableRow key={userTask.id}>
									<TableCell align='center'>{userTask.Task.description}</TableCell>
									<TableCell align='center'>
										<button
											className="mt-2 p-2 bg-blue-500 text-white rounded"
											onClick={() => handleCompleteUserTask(userTask.Task.id)}
											disabled={userTask.isCompleted}
										>
											{userTask.isCompleted ? 'Completado' : 'Completar'}
										</button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)
			}
		</React.Fragment >
	);
};

export default ChecklistPage;



// "use client"
// import { completeTask, getUserTasks } from '@/service/taskService';
// import { useState, useEffect } from 'react';

// const ChecklistPage = () => {
// 	const [userTasks, setUserTasks] = useState([]);
// 	const userId = 3;
// 	const date = new Date().toISOString().split('T')[0];

// 	useEffect(() => {
// 		const fetchUserTasks = async () => {
// 			try {
// 				const data = await getUserTasks(userId, date);
// 				console.log('Fetched tasks:', data);
// 				setUserTasks(data);
// 			} catch (error) {
// 				console.log('Failed to fetch tasks:', error);
// 			}
// 		};
// 		fetchUserTasks();
// 	}, [userId, date]);

// 	const handleCompleteUserTask = async (taskId) => {
// 		try {
// 			console.log(taskId)
// 			await completeTask(userId, taskId);
// 			setUserTasks(userTasks.map(task => task.id === taskId ? { ...task, isCompleted: true } : task));
// 		} catch (error) {
// 			console.error('Failed to complete task:', error);
// 		}
// 	};

// 	return (
// 		<div className="container mx-auto p-4">
// 			<h1 className="text-2xl font-bold mb-4">Daily Checklist</h1>
// 			{userTasks.length === 0 ? (
// 				<p>No tasks for today.</p>
// 			) : (
// 				<ul className="space-y-4">
// 					{userTasks.map(userTask => (
// 						<li key={userTask.id} className={`p-4 border rounded ${userTask.isCompleted ? 'bg-green-100' : 'bg-yellow-100'}`}>
// 							<p>{userTask.Task.description}</p>
// 							<button
// 								className="mt-2 p-2 bg-blue-500 text-white rounded"
// 								onClick={() => handleCompleteUserTask(userTask.Task.id)}
// 								disabled={userTask.isCompleted}
// 							>
// 								{userTask.isCompleted ? 'Completed' : 'Complete'}
// 							</button>
// 						</li>
// 					))}
// 				</ul>
// 			)}
// 		</div>
// 	);
// };

// export default ChecklistPage;