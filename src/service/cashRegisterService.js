import axios from "../config/axios";

export const createCashRegister = async (cashRegisterData) => {
	try {
		console.log('cashRegisterData', cashRegisterData);
		const response = await axios.post(`/cash-register`, cashRegisterData);
		return response.data;
	} catch (error) {
		console.error('Failed to create cash register', error);
		throw new Error('Failed to create cash register');
	}
};

export const getAllCashRegisters = async () => {
	try {
		const response = await axios.get(`/cash-register`);
		return response.data;
	} catch (error) {
		console.error('Failed to get cash registers', error);
		throw new Error('Failed to get cash registers');
	}
}

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

export const exportToCSV = async () => {
	try {
		const response = await axios.get(`/cash-register/export-csv/download`, { responseType: 'blob' });
		return response.data;
	} catch (error) {
		console.error('Failed to export cash register to CSV', error);
		throw new Error('Failed to export cash register to CSV');
	}
}