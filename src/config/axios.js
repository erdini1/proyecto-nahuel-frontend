import axios from 'axios';

// TODO: Poner variables de entorno
const axiosInstance = axios.create({
	baseURL: 'http://localhost:4000',
	headers: {
		'Content-Type': 'application/json',
	},
});

const authToken = localStorage.getItem('token');
if (authToken) {
	axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

export default axiosInstance;