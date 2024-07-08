import axios from "../config/axios";

export const setShift = async (taskSetData) => {
	try {
		const response = await axios.post(`/task-set`, { shift: taskSetData });
		return response.data;
	} catch (error) {
		console.error('Failed to assign shift:', error);
		throw new Error('Failed to assign shift');
	}
};

export const getTaskSet = async () => {
	try {
		const response = await axios.get(`/task-set/last`);
		return response.data;
	} catch (error) {
		console.error('Failed to get shift:', error);
		throw new Error('Failed to get shift');
	}
}

export const updateTaskSet = async (taskSetData) => {
	try {
		const response = await axios.put(`/task-set`, taskSetData);
		return response.data;
	} catch (error) {
		console.error('Failed to update shift:', error);
		throw new Error('Failed to update shift');
	}
}