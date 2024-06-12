"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import axios from "@/config/axios.js";
import { decode } from '@/helpers/token.helper';

// TODO: Modificar un poco la estetica
export default function SignIn() {
	const [number, setNumber] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { login } = useAuthContext();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post('/auth/login', { number, password });
			const { token } = response.data;
			const decodedToken = decode(token);

			login(token);

			switch (decodedToken.role) {
				case 'admin':
					router.push("/admin/dashboard");
					break;
				case 'cashier':
					router.push("/");
					break;
				case 'employee':
					router.push("/employee/checklist");
					break;
				default:
					router.push("/unauthorized");
			}
		} catch (error) {
			console.error('Error during login:', error);
			alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
				<div className="flex justify-center">
					<div className="bg-blue-500 text-white rounded-full p-3">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v8m0-8H8m4 0h4m-4 0a4 4 0 004-4v4a4 4 0 00-4-4m0 0a4 4 0 00-4 4v4a4 4 0 004-4z"></path>
						</svg>
					</div>
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in
				</h2>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="number" className="sr-only">
								Numero de Empleado
							</label>
							<input
								id="number"
								name="number"
								type="text"
								value={number}
								onChange={(e) => setNumber(e.target.value)}
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Numero de Empleado"
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Sign In
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}


// "use client";
// import React, { useState } from 'react';

// import { useRouter } from "next/navigation";
// import { useAuthContext } from "@/contexts/authContext";
// import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
// import Container from '@material-ui/core/Container';
// import axios from "@/config/axios.js"
// import { decode } from '@/helpers/token.helper';

// const useStyles = makeStyles((theme) => ({
// 	paper: {
// 		marginTop: theme.spacing(8),
// 		display: 'flex',
// 		flexDirection: 'column',
// 		alignItems: 'center',
// 	},
// 	avatar: {
// 		margin: theme.spacing(1),
// 		backgroundColor: theme.palette.secondary.main,
// 	},
// 	form: {
// 		width: '100%', // Fix IE 11 issue.
// 		marginTop: theme.spacing(1),
// 	},
// 	submit: {
// 		margin: theme.spacing(3, 0, 2),
// 	},
// }));

// export default function SignIn() {
// 	const classes = useStyles();
// 	const [number, setNumber] = useState('');
// 	const [password, setPassword] = useState('');
// 	const router = useRouter();
// 	const { login } = useAuthContext();

// 	const handleSubmit = async (event) => {
// 		event.preventDefault();
// 		try {
// 			const response = await axios.post('/auth/login', { number, password });
// 			const { token } = response.data;
// 			const decodedToken = decode(token);

// 			login(token);

// 			switch (decodedToken.role) {
// 				case 'admin':
// 					router.push("/admin/dashboard");
// 					break;
// 				case 'cashier':
// 					router.push("/");
// 					break;
// 				case 'employee':
// 					router.push("/employee/checklist");
// 					break;
// 				default:
// 					router.push("/unauthorized");
// 			}
// 		} catch (error) {
// 			console.error('Error during login:', error);
// 			alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
// 		}
// 	};

// 	return (
// 		<Container component="main" maxWidth="xs">
// 			<CssBaseline />
// 			<div className={classes.paper}>
// 				<Avatar className={classes.avatar}>
// 					<LockOutlinedIcon />
// 				</Avatar>
// 				<Typography component="h1" variant="h5">
// 					Sign in
// 				</Typography>
// 				<form className={classes.form} noValidate onSubmit={handleSubmit}>
// 					<TextField
// 						variant="outlined"
// 						margin="normal"
// 						required
// 						fullWidth
// 						id="number"
// 						label="Numero de Empleado"
// 						name="number"
// 						value={number}
// 						onChange={(e) => setNumber(e.target.value)}
// 						autoFocus
// 					/>
// 					<TextField
// 						variant="outlined"
// 						margin="normal"
// 						required
// 						fullWidth
// 						name="password"
// 						label="Password"
// 						type="password"
// 						id="password"
// 						value={password}
// 						onChange={(e) => setPassword(e.target.value)}
// 						autoComplete="current-password"
// 					/>
// 					<Button
// 						type="submit"
// 						fullWidth
// 						variant="contained"
// 						color="primary"
// 						className={classes.submit}
// 					>
// 						Sign In
// 					</Button>
// 				</form>
// 			</div>
// 		</Container>
// 	);
// }