"use client";
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Navbar from '@/components/Navbar'; // Importar el componente de barra de navegación

import useToken from '@/hooks/user.hook';
import { completeTask, getUserTasks } from '@/service/taskService';

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: theme.spacing(4),
		padding: theme.spacing(4),
	},
	table: {
		minWidth: 650,
	},
	button: {
		margin: theme.spacing(1),
	},
	header: {
		marginBottom: theme.spacing(4),
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerItem: {
		marginRight: theme.spacing(3),
	},
	title: {
		marginBottom: theme.spacing(2),
		textAlign: 'center',
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	search: {
		marginBottom: theme.spacing(2),
		width: '100%',
	},
}));

const ChecklistPage = () => {

	useToken();
	const classes = useStyles();
	const [userTasks, setUserTasks] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');

	// Para el navbar
	const [userName, setUserName] = useState('Empleado');

	const date = new Date().toISOString().split('T')[0];

	useEffect(() => {
		const fetchUserTasks = async () => {
			try {
				const data = await getUserTasks(date);
				console.log('Fetched tasks:', data);
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

	// Para el navbar
	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/login';
	};

	return (
		<>
			{/* Para el navbar */}
			<Navbar userName={userName} onLogout={handleLogout} />

			<Container className={classes.container} component={Paper} elevation={3}>
				<Typography variant="h4" className={classes.title}>
					Tareas Diarias
				</Typography>
				<Box className={classes.header}>
					<Typography variant="h6" className={classes.headerItem}>
						Turno: {userTasks[0]?.shift || 'N/A'}
					</Typography>
					<Typography variant="h6" className={classes.headerItem}>
						Fecha: {date}
					</Typography>
					<Typography variant="h6" className={classes.headerItem}>
						Responsable: {userName}
					</Typography>
				</Box>
				<TextField
					className={classes.search}
					variant="outlined"
					label="Buscar Tareas"
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				{filteredTasks.length === 0 ? (
					<Typography variant="h6" align="center">No tasks found.</Typography>
				) : (
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell align="center">
									<Typography variant="subtitle1" className="font-bold text-lg uppercase">Descripción</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="subtitle1" className="font-bold text-lg uppercase">Estado</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredTasks.map((userTask) => (
								<TableRow key={userTask.id}>
									<TableCell align="center">{userTask.Task.description}</TableCell>
									<TableCell align="center">
										<Button
											variant="contained"
											color={userTask.isCompleted ? "default" : "primary"}
											className={classes.button}
											onClick={() => handleCompleteUserTask(userTask.Task.id)}
											disabled={userTask.isCompleted}
										>
											{userTask.isCompleted ? 'Completado' : 'Completar'}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</Container>
		</>
	);
};

export default ChecklistPage;





// checklist 2

// "use client";
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Container from '@material-ui/core/Container';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';

// import useToken from '@/hooks/user.hook';
// import { completeTask, getUserTasks } from '@/service/taskService';
// import { useState, useEffect } from 'react';

// const useStyles = makeStyles((theme) => ({
// 	container: {
// 		marginTop: theme.spacing(4),
// 	},
// 	table: {
// 		minWidth: 650,
// 	},
// 	button: {
// 		margin: theme.spacing(1),
// 	},
// 	header: {
// 		marginBottom: theme.spacing(4),
// 	},
// 	headerItem: {
// 		marginRight: theme.spacing(3),
// 	},
// }));

// const ChecklistPage = () => {
// 	useToken();
// 	const classes = useStyles();
// 	const [userTasks, setUserTasks] = useState([]);
// 	const date = new Date().toISOString().split('T')[0];

// 	useEffect(() => {
// 		const fetchUserTasks = async () => {
// 			try {
// 				const data = await getUserTasks(date);
// 				console.log('Fetched tasks:', data);
// 				setUserTasks(data);
// 			} catch (error) {
// 				console.log('Failed to fetch tasks:', error);
// 			}
// 		};
// 		fetchUserTasks();
// 	}, [date]);

// 	const handleCompleteUserTask = async (taskId) => {
// 		try {
// 			await completeTask(taskId);
// 			setUserTasks(userTasks.map(userTask => userTask.Task.id === taskId ? { ...userTask, isCompleted: true } : userTask));
// 		} catch (error) {
// 			console.error('Failed to complete task:', error);
// 		}
// 	};

// 	return (
// 		<Container className={classes.container} component={Paper} elevation={3}>
// 			<Box display="flex" justifyContent="space-between" alignItems="center" className={classes.header}>
// 				<Typography variant="h6" className={classes.headerItem}>
// 					Turno: {userTasks[0]?.shift || 'N/A'}
// 				</Typography>
// 				<Typography variant="h6" className={classes.headerItem}>
// 					Fecha: {date}
// 				</Typography>
// 				<Typography variant="h6" className={classes.headerItem}>
// 					Empleado: {userTasks[0]?.User.firstName} {userTasks[0]?.User.lastName}
// 				</Typography>
// 			</Box>
// 			{userTasks.length === 0 ? (
// 				<Typography variant="h6" align="center">No tasks for today.</Typography>
// 			) : (
// 				<Table className={classes.table}>
// 					<TableHead>
// 						<TableRow>
// 							<TableCell align="center">
// 								<Typography variant="subtitle1" className="font-bold text-lg uppercase">Descripción</Typography>
// 							</TableCell>
// 							<TableCell align="center">
// 								<Typography variant="subtitle1" className="font-bold text-lg uppercase">Estado</Typography>
// 							</TableCell>
// 						</TableRow>
// 					</TableHead>
// 					<TableBody>
// 						{userTasks.map((userTask) => (
// 							<TableRow key={userTask.id}>
// 								<TableCell align="center">{userTask.Task.description}</TableCell>
// 								<TableCell align="center">
// 									<Button
// 										variant="contained"
// 										color={userTask.isCompleted ? "default" : "primary"}
// 										className={classes.button}
// 										onClick={() => handleCompleteUserTask(userTask.Task.id)}
// 										disabled={userTask.isCompleted}
// 									>
// 										{userTask.isCompleted ? 'Completado' : 'Completar'}
// 									</Button>
// 								</TableCell>
// 							</TableRow>
// 						))}
// 					</TableBody>
// 				</Table>
// 			)}
// 		</Container>
// 	);
// };

// export default ChecklistPage;



// checklist 1

// "use client"
// import React from 'react';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

// import useToken from '@/hooks/user.hook';
// import { completeTask, getUserTasks } from '@/service/taskService';
// import { useState, useEffect } from 'react';

// const ChecklistPage = () => {

// 	// Ver bien como usar el useToken
// 	useToken();
// 	const [userTasks, setUserTasks] = useState([]);
// 	const date = new Date().toISOString().split('T')[0];

// 	useEffect(() => {
// 		const fetchUserTasks = async () => {
// 			try {
// 				const data = await getUserTasks(date);
// 				console.log('Fetched tasks:', data);
// 				setUserTasks(data);
// 			} catch (error) {
// 				console.log('Failed to fetch tasks:', error);
// 			}
// 		};
// 		fetchUserTasks();
// 	}, [date]);

// 	const handleCompleteUserTask = async (taskId) => {
// 		try {
// 			await completeTask(taskId);
// 			setUserTasks(userTasks.map(userTask => userTask.Task.id === taskId ? { ...userTask, isCompleted: true } : userTask));
// 		} catch (error) {
// 			console.error('Failed to complete task:', error);
// 		}
// 	};

// 	return (
// 		<React.Fragment>
// 			<div className="container p-10">
// 				<div className='flex items-center pb-10'>
// 					<div className='flex row-span-3 justify-between items-center gap-10'>
// 						<div>
// 							<span className='font-bold text-lg'>Turno: </span>
// 							<span className='text-lg'>{userTasks[0]?.shift}</span>
// 						</div>
// 						<div className=''>
// 							<span className='font-bold text-lg'>Fecha: </span>
// 							<span className='text-lg'>{date}</span>
// 						</div>
// 						<div>
// 							<span className='font-bold text-lg'>Empleado: </span>
// 							<span className='text-lg'>{userTasks[0]?.User.firstName} {userTasks[0]?.User.lastName}</span>
// 						</div>
// 					</div>
// 				</div>

// 				{
// 					userTasks.length === 0 ? (
// 						<p>No tasks for today.</p>
// 					) : (
// 						<Table size="small">
// 							<TableHead>
// 								<TableRow className='justify-center'>
// 									<TableCell align='center'><span className='font-bold text-lg uppercase'>Descripción</span></TableCell>
// 									<TableCell align='center'><span className='font-bold text-lg uppercase'>Estado</span></TableCell>
// 								</TableRow>
// 							</TableHead>
// 							<TableBody>
// 								{userTasks.map((userTask) => (
// 									<TableRow key={userTask.id}>
// 										<TableCell align='center'>{userTask.Task.description}</TableCell>
// 										<TableCell align='center'>
// 											<button
// 												className={`mt-2 p-2 text-white rounded ${userTask.isCompleted ? 'bg-gray-500' : 'bg-blue-500'}`}
// 												onClick={() => handleCompleteUserTask(userTask.Task.id)}
// 												disabled={userTask.isCompleted}
// 											>
// 												{userTask.isCompleted ? 'Completado' : 'Completar'}
// 											</button>
// 										</TableCell>
// 									</TableRow>
// 								))}
// 							</TableBody>
// 						</Table>
// 					)
// 				}
// 			</div>
// 		</React.Fragment >
// 	);
// };

// export default ChecklistPage;