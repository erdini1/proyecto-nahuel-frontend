import axios from "../config/axios";

export const getAllSectors = async () => {
	try {
		const response = await axios.get('/sector');
		return response.data;
	} catch (error) {
		console.error('Failed to get sectors:', error);
		throw new Error('Failed to get sectors');
	}
}

export const getAllUserSectors = async () => {
	try {
		const response = await axios.get('/user-sector');
		return response.data;
	} catch (error) {
		console.error('Failed to get user sectors:', error);
		throw new Error('Failed to get user sectors');
	}
}