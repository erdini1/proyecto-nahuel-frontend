"use client"

export default function Dashboard() {
	return (
		<div>
			{/* <MainContent> */}
			<div className="stats-overview">
				<div className="stat">
					<h2>Tareas</h2>
					<p>Completadas: X | Pendientes: Y</p>
				</div>
				<div className="stat">
					<h2>Empleados</h2>
					<p>Activos: A | Inactivos: B</p>
				</div>
				<div className="stat">
					<h2>Caja</h2>
					<p>Ingresos: $X | Egresos: $Y</p>
				</div>
			</div>
			<div className="recent-activity">
				<h2>Actividad Reciente</h2>
				<ul>
					<li>Tarea X completada por Empleado Y</li>
					<li>Empleado Z inició sesión</li>
				</ul>
			</div>
			<div className="notifications">
				<h2>Notificaciones</h2>
				<ul>
					<li>Tarea A vencida</li>
					<li>Recordatorio: Revisión de caja a las 5 PM</li>
				</ul>
			</div>
			<div className="quick-links">
				<h2>Accesos Directos</h2>
				<button>Agregar Nuevo Empleado</button>
				<button>Crear Nueva Tarea</button>
				<button>Ver Reportes</button>
			</div>
			{/* </MainContent> */}

		</div>
	);
}

// pages/admin.js
// import { useState, useEffect } from 'react';

// const AdminPage = () => {
// 	const [users, setUsers] = useState([]);
// 	const [tasks, setTasks] = useState([]);

// 	useEffect(() => {
// 		// Aquí irían las llamadas para obtener los usuarios y las tareas
// 		fetchUsers().then(data => setUsers(data.users));
// 		fetchAllTasks().then(data => setTasks(data.tasks));
// 	}, []);

// 	return (
// 		<div className="container mx-auto p-4">
// 			<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
// 			<UserManagement users={users} />
// 			<TaskManagement tasks={tasks} />
// 		</div>
// 	);
// };

// const UserManagement = ({ users }) => {
// 	return (
// 		<div>
// 			<h2 className="text-xl font-bold mb-2">User Management</h2>
// 			<ul className="space-y-2">
// 				{users.map(user => (
// 					<li key={user.id} className="p-2 border rounded">
// 						{user.name}
// 					</li>
// 				))}
// 			</ul>
// 		</div>
// 	);
// };

// const TaskManagement = ({ tasks }) => {
// 	return (
// 		<div>
// 			<h2 className="text-xl font-bold mb-2">Task Management</h2>
// 			<ul className="space-y-2">
// 				{tasks.map(task => (
// 					<li key={task.id} className="p-2 border rounded">
// 						{task.title}
// 					</li>
// 				))}
// 			</ul>
// 		</div>
// 	);
// };

// export default AdminPage;

