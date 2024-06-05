import axios from "../config/axios";

export const getUserTasks = async (date) => {
	try {
		const response = await axios.get(`/api/checklist/date?date=${date}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
};

export const completeTask = async (taskId) => {
	try {
		const response = await axios.put(`/api/checklist/${taskId}/completed`);
		return response.data;
	} catch (error) {
		console.error('Failed to complete task:', error);
		throw new Error('Failed to get tasks');
	}
};
