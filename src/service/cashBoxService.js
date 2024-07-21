import axios from "../config/axios";

export const getCashBoxes = async () => {
	try {
		const response = await axios.get(`/cash-box`);
		return response.data;
	} catch (error) {
		console.log('Failed to get cash boxes:', error);
		throw new Error('Failed to get cash boxes');
	}
};