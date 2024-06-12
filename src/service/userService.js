import axios from "../config/axios";

export const getUsers = async () => {
	try {
		const response = await axios.get(`/user`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
};

export const createUser = async (data) => {
	try {
		const response = await axios.post(`/auth/register`, data);
		return response.data;
	} catch (error) {
		console.error('Failed to create task:', error);
		throw new Error('Failed to create task');
	}
};

// export const updateUser = async (id, data) => {
// 	try {
// 		const response = await axios.put(`/user/${id}`, data);
// 		return response.data;
// 	} catch (error) {
// 		console.error('Failed to update task:', error);
// 		throw new Error('Failed to update task');
// 	}
// };

// export const deleteUser = async (id) => {
// 	try {
// 		const response = await axios.delete(`/user/${id}`);
// 		return response.data;
// 	} catch (error) {
// 		console.error('Failed to delete task:', error);
// 		throw new Error('Failed to delete task');
// 	}
// };