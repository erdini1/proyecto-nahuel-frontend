import axios from "../config/axios";

export const getUserTasks = async (date, userId) => {
	try {
		const response = await axios.get(`/checklist/date?date=${date}${userId ? `&userId=${userId}` : ''}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
};

export const completeTask = async (taskId) => {
	try {
		const response = await axios.put(`/checklist/${taskId}/completed`);
		return response.data;
	} catch (error) {
		console.error('Failed to complete task:', error);
		throw new Error('Failed to get tasks');
	}
};

export const createTask = async (task) => {
	try {
		const response = await axios.post('/task', task);
		return response.data;
	} catch (error) {
		console.error('Failed to create task:', error);
		throw new Error('Failed to create task');
	}
}

export const getAllTasks = async () => {
	try {
		const response = await axios.get('/task');
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
}

// TODO: Ver como cargar el turno
export const assignTask = async (taskIds, userId) => {
	try {
		const response = await axios.post('/checklist', {
			taskIds,
			userId,
			shift: 'morning'
		});
		return response.data;
	} catch (error) {
		console.error('Failed to assign task:', error);
		throw new Error('Failed to assign task');
	}
}