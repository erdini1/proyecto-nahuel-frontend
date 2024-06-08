import axios from 'axios';
import Cookies from "js-cookie";

// TODO: Poner variables de entorno
const axiosInstance = axios.create({
	baseURL: 'http://localhost:4000/api',
	headers: {
		'Content-Type': 'application/json',
	}
});
const token = Cookies.get('token');

if (token) {
	axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosInstance;