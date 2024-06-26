import axios from "../config/axios";

export const getUsers = async () => {
	try {
		const response = await axios.get(`/user`);
		return response.data;
	} catch (error) {
		console.error('Failed to get users:', error);
		throw new Error('Failed to get users');
	}
};

export const getMyUser = async () => {
	try {
		const response = await axios.get(`/user/profile`);
		return response.data;
	} catch (error) {
		console.error('Failed to get my user:', error);
		throw new Error('Failed to get my user');
	}
}

export const createUser = async (data) => {
	try {
		const response = await axios.post(`/auth/register`, data);
		return response.data;
	} catch (error) {
		console.error('Failed to create user:', error);
		throw new Error('Failed to create user');
	}
};

export const updateUser = async (id, data) => {
	try {
		const response = await axios.put(`/auth/update?userId=${id}`, data);
		return response.data;
	} catch (error) {
		console.error('Failed to update user:', error);
		throw new Error('Failed to update user');
	}
};

export const deleteUser = async (id) => {
	try {
		const response = await axios.delete(`/auth/delete?userId=${id}`);
		return response.data;
	} catch (error) {
		console.error('Failed to delete user:', error);
		throw new Error('Failed to delete user');
	}
};