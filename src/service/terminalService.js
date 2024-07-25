import axios from "../config/axios";

export const getTerminals = async (cashRegisterId) => {
	try {
		const response = await axios.get(`/terminal/cashRegister/${cashRegisterId}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get terminals:', error);
		throw new Error('Failed to get terminals');
	}
};

export const createTerminal = async (terminalsData) => {
	try {
		const response = await axios.post(`/terminal`, terminalsData);
		return response.data;
	} catch (error) {
		console.error('Failed to create terminals:', error);
		throw new Error('Failed to create terminals');
	}
};

export const deleteTerminal = async (terminalId) => {
	try {
		const response = await axios.delete(`/terminal/${terminalId}`);
		return response.data;
	} catch (error) {
		console.error('Failed to delete terminal:', error);
		throw new Error('Failed to delete terminal');
	}
}

export const updateTerminal = async (terminalId, terminalsData) => {
	try {
		const response = await axios.put(`/terminal/${terminalId}`, terminalsData);
		return response.data;
	} catch (error) {
		console.error('Failed to update terminal:', error);
		throw new Error('Failed to update terminal');
	}
}

export const getAllterminals = async () => {
	try {
		const response = await axios.get(`/terminal`);
		return response.data;
	} catch (error) {
		console.error('Failed to get terminals:', error);
		throw new Error('Failed to get terminals');
	}
}

export const createAssociation = async (terminalId, cashRegisterId) => {
	try {
		const response = await axios.post(`/cash-register-terminals`, { terminalId, cashRegisterId });
		return response.data;
	} catch (error) {
		console.error('Failed to create association:', error);
		throw new Error('Failed to create association');
	}
}

export const deleteAssociation = async (terminalId, cashRegisterId) => {
	try {
		const response = await axios.post(`/cash-register-terminals/delete`, { terminalId, cashRegisterId });
		return response.data;
	} catch (error) {
		console.error('Failed to delete association:', error);
		throw new Error('Failed to delete association');
	}
}

export const getAllTerminalAssociations = async () => {
	try {
		const response = await axios.get(`/cash-register-terminals`);
		return response.data;
	} catch (error) {
		console.error('Failed to get terminal associations:', error);
		throw new Error('Failed to get terminal associations');
	}
}