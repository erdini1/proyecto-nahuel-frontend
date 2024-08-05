import { jwtDecode } from 'jwt-decode';

const decode = (token) => {
	if (!token) {
		return null;
	}
	return jwtDecode(token);
}

export {
	decode
}