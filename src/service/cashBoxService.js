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

export const createCashBox = async (cashBox) => {
	try {
		const response = await axios.post(`/cash-box`, cashBox);
		return response.data;
	} catch (error) {
		console.log('Failed to create cash box:', error);
		throw new Error('Failed to create cash box');
	}
}

export const updateCashBox = async (cashBoxId, cashBox) => {
	try {
		const response = await axios.put(`/cash-box/${cashBoxId}`, cashBox);
		return response.data;
	} catch (error) {
		console.log('Failed to update cash box:', error);
		throw new Error('Failed to update cash box');
	}
}

export const deleteCashBox = async (cashBoxId) => {
	try {
		const response = await axios.delete(`/cash-box/${cashBoxId}`);
		return response.data;
	} catch (error) {
		console.log('Failed to delete cash box:', error);
		throw new Error('Failed to delete cash box');
	}
}