import axios from "../config/axios";

export const getAllSectors = async () => {
	try {
		const response = await axios.get('/sector');
		return response.data;
	} catch (error) {
		console.error('Failed to get sectors:', error);
		throw new Error('Failed to get sectors');
	}
}

export const getAllUserSectors = async () => {
	try {
		const response = await axios.get('/user-sector');
		return response.data;
	} catch (error) {
		console.error('Failed to get user sectors:', error);
		throw new Error('Failed to get user sectors');
	}
}

export const createSector = async (sector) => {
	try {
		const response = await axios.post('/sector', sector);
		return response.data;
	} catch (error) {
		console.error('Failed to create sector:', error);
		throw new Error('Failed to create sector');
	}
}

export const updateSector = async (sectorId, sector) => {
	try {
		const response = await axios.put(`/sector/${sectorId}`, sector);
		return response.data;
	} catch (error) {
		console.error('Failed to update sector:', error);
		throw new Error('Failed to update sector');
	}
}

export const deleteSector = async (sectorId) => {
	try {
		const response = await axios.delete(`/sector/${sectorId}`);
		return response.data;
	} catch (error) {
		console.error('Failed to delete sector:', error);
		throw new Error('Failed to delete sector');
	}
}