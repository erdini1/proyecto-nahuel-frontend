import axios from "../config/axios";

export const getProviders = async () => {
	try {
		const response = await axios.get(`/provider`);
		return response.data;
	} catch (error) {
		console.error('Failed to get providers:', error);
		throw new Error('Failed to get providers');
	}
};

export const createProvider = async (provider) => {
	try {
		const response = await axios.post(`/provider`, provider);
		return response.data;
	} catch (error) {
		console.error('Failed to create provider:', error);
		throw new Error('Failed to create provider');
	}
}

export const updateProvider = async (providerId, provider) => {
	try {
		const response = await axios.put(`/provider/${providerId}`, provider);
		return response.data;
	} catch (error) {
		console.error('Failed to update provider:', error);
		throw new Error('Failed to update provider');
	}
}

export const deleteProvider = async (providerId) => {
	try {
		const response = await axios.delete(`/provider/${providerId}`);
		return response.data;
	} catch (error) {
		console.error('Failed to delete provider:', error);
		throw new Error('Failed to delete provider');
	}
}

