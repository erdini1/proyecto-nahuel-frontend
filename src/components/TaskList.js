"use client"
import React from 'react';
import useTasks from '../hooks/useTasks';

const TaskList = ({ userId, date }) => {
	const tasks = useTasks(userId, date);

	return (
		<div className="task-list">
			{tasks.length === 0 ? (
				<p>No tasks found for the selected date.</p>
			) : (
				<ul>
					{tasks.map((task) => (
						<li key={task.id} className={`task ${task.is_completed ? 'completed' : ''}`}>
							<h3>{task.title}</h3>
							<p>{task.description}</p>
							<p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
							<p>Status: {task.is_completed ? 'Completed' : 'Pending'}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TaskList;
