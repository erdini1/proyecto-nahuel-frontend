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

export const updateCashMovement = async (id, data) => {
	try {
		const response = await axios.put(`/cash-movement/${id}`, data);
		return response.data;
	} catch (error) {
		console.error('Failed to update cash movement:', error);
		throw new Error('Failed to update cash movement');
	}
}

export const deleteCashMovement = async (id) => {
	try {
		const response = await axios.delete(`/cash-movement/${id}`);
		return response.data;
	} catch (error) {
		console.error('Failed to delete cash movement:', error);
		throw new Error('Failed to delete cash movement');
	}
}