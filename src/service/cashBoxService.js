import axios from "../config/axios";

export const getCashBoxes = async () => {
	try {
		const response = await axios.get(`/cash-box`);
		return response.data;
	} catch (error) {
		throw new Error('Failed to get cash boxes');
	}
};

export const createCashBox = async (cashBox) => {
	try {
		const response = await axios.post(`/cash-box`, cashBox);
		return response.data;
	} catch (error) {
		throw new Error('Failed to create cash box');
	}
}

export const updateCashBox = async (cashBoxId, cashBox) => {
	try {
		const response = await axios.put(`/cash-box/${cashBoxId}`, cashBox);
		return response.data;
	} catch (error) {
		throw new Error('Failed to update cash box');
	}
}

export const deleteCashBox = async (cashBoxId) => {
	try {
		const response = await axios.delete(`/cash-box/${cashBoxId}`);
		return response.data;
	} catch (error) {
		throw new Error('Failed to delete cash box');
	}
}