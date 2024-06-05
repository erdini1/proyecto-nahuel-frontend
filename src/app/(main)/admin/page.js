// pages/admin.js
import { useState, useEffect } from 'react';

const AdminPage = () => {
	const [users, setUsers] = useState([]);
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		// Aquí irían las llamadas para obtener los usuarios y las tareas
		fetchUsers().then(data => setUsers(data.users));
		fetchAllTasks().then(data => setTasks(data.tasks));
	}, []);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
			<UserManagement users={users} />
			<TaskManagement tasks={tasks} />
		</div>
	);
};

const UserManagement = ({ users }) => {
	return (
		<div>
			<h2 className="text-xl font-bold mb-2">User Management</h2>
			<ul className="space-y-2">
				{users.map(user => (
					<li key={user.id} className="p-2 border rounded">
						{user.name}
					</li>
				))}
			</ul>
		</div>
	);
};

const TaskManagement = ({ tasks }) => {
	return (
		<div>
			<h2 className="text-xl font-bold mb-2">Task Management</h2>
			<ul className="space-y-2">
				{tasks.map(task => (
					<li key={task.id} className="p-2 border rounded">
						{task.title}
					</li>
				))}
			</ul>
		</div>
	);
};

export default AdminPage;
