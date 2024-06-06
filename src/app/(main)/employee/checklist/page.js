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

	const classes = useStyles();
	const [userTasks, setUserTasks] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');

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

	return (
		<>
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