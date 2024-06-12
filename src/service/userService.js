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