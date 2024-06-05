import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	appBar: {
		marginBottom: theme.spacing(4),
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

const Navbar = ({ userName, onLogout }) => {
	const classes = useStyles();

	return (
		<AppBar position="static" className={classes.appBar}>
			<Toolbar>
				<Typography variant="h6" className={classes.menuButton}>
					Menu
				</Typography>
				<div className={classes.grow} />
				<Typography variant="h6" className={classes.userName}>
					{userName}
				</Typography>
				<Button color="inherit" onClick={onLogout}>
					Cerrar sesión
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
