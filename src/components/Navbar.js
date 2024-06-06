"use client"
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import { decode } from '@/helpers/token.helper';
import { useAuthContext } from '@/contexts/authContext';

const useStyles = makeStyles((theme) => ({
	appBar: {
		marginBottom: theme.spacing(2),
	},
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	userName: {
		marginRight: theme.spacing(2),
	},
}));

const Navbar = () => {
	const classes = useStyles();
	// TODO: Agregar logica para mostrar el nombre del usuario
	// const [userName, setUserName] = useState('Empleado');
	// const { getUserName } = useAuthContext();
	// const username = getUserName();
	// console.log(username)

	// const token = Cookies.get('token');
	// const decodedToken = decode(token);

	// setUserName(decodedToken?.firstName, decodedToken?.lastName);

	return (
		<AppBar position="static" className={classes.appBar}>
			<Toolbar>
				<Typography variant="h6" className={classes.menuButton}>
					Menu
				</Typography>
				<div className={classes.grow} />
				<Typography variant="h6" className={classes.userName}>
					{/* {username} */} Empleado
				</Typography>
				<Button color="inherit" href='/logout'>
					Cerrar sesión
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
