import axios from "../config/axios";

export const getCashMovements = async () => {
	try {
		const response = await axios.get(`/cash-movement/user`);
		return response.data;
	} catch (error) {
		console.error('Failed to get cash movements:', error);
		throw new Error('Failed to get cash movements');
	}
};

export const createCashMovement = async (data) => {
	try {
		const response = await axios.post(`/cash-movement`, data);
		return response.data;
	} catch (error) {
		console.error('Failed to create cash movement:', error);
		throw new Error('Failed to create cash movement');
	}
};