import axios from "../config/axios";

export const getTerminals = async () => {
	try {
		const response = await axios.get(`/terminal`);
		return response.data;
	} catch (error) {
		console.error('Failed to get cash movements:', error);
		throw new Error('Failed to get cash movements');
	}
};
