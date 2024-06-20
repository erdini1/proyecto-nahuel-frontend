import axios from "../config/axios";

// TODO: Revisar función para obtener cancelaciones por cashRegister
export const getCancellations = async () => {
	try {
		const response = await axios.get(`/cancellation/user`);
		return response.data;
	} catch (error) {
		console.error('Failed to get cash movements:', error);
		throw new Error('Failed to get cash movements');
	}
};

export const createCancellation = async (data) => {
	try {
		const response = await axios.post('/cancellation', data);
		return response.data;
	} catch (error) {
		console.error('Failed to create cash movement:', error);
		throw new Error('Failed to create cash movement');
	}
}

export const updateCancellation = async (id, data) => {
	try {
		const response = await axios.put(`/cancellation/${id}`, data);
		return response.data;
	} catch (error) {
		console.error('Failed to update cash movement:', error);
		throw new Error('Failed to update cash movement');
	}
}

export const deleteCancellation = async (id) => {
	try {
		const response = await axios.delete(`/cancellation/${id}`);
		return response.data;
	} catch (error) {
		console.error('Failed to delete cash movement:', error);
		throw new Error('Failed to delete cash movement');
	}
}
