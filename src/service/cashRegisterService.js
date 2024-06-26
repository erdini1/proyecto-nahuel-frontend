import axios from "../config/axios";

export const createCashRegister = async (cashRegisterData) => {
	try {
		const response = await axios.post(`/cash-register`, cashRegisterData);
		return response.data;
	} catch (error) {
		console.error('Failed to create cash register', error);
		throw new Error('Failed to create cash register');
	}
};

export const checkIfCashRegisterExists = async () => {
	try {
		const response = await axios.get(`/cash-register/check`);
		return response.data;
	} catch (error) {
		console.error('Failed to get cash register', error);
		throw new Error('Failed to get cash register');
	}
}

export const getLastCashRegister = async () => {
	try {
		const response = await axios.get(`/cash-register/user`);
		return response.data;
	} catch (error) {
		console.error('Failed to get cash register', error);
		throw new Error('Failed to get cash register');
	}
}

export const updateCashRegister = async (cashRegisterId, cashRegisterData) => {
	try {
		const response = await axios.put(`/cash-register/${cashRegisterId}`, cashRegisterData);
		return response.data;
	} catch (error) {
		console.error('Failed to update cash register', error);
		throw new Error('Failed to update cash register');
	}
}