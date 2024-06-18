import axios from "../config/axios";

export const getProviders = async () => {
	try {
		const response = await axios.get(`/provider`);
		return response.data;
	} catch (error) {
		console.error('Failed to get providers:', error);
		throw new Error('Failed to get providers');
	}
};
