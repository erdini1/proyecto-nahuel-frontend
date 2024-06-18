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
