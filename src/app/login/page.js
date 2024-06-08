"use client";
import React, { useState } from 'react';

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "@/config/axios.js"
import { decode } from '@/helpers/token.helper';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const classes = useStyles();
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
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} noValidate onSubmit={handleSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="number"
						label="Numero de Empleado"
						name="number"
						value={number}
						onChange={(e) => setNumber(e.target.value)}
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign In
					</Button>
				</form>
			</div>
		</Container>
	);
}