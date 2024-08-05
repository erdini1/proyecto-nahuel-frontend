"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
} from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/config/axios";

export const AuthContext = createContext({
	login: (token) => { },
	logout: () => { },
});

export default function AuthContextProvider({ children }) {

	const login = useCallback(function (token) {
		Cookies.set("token", token);
		axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}, []);

	const logout = useCallback(function () {
		Cookies.remove("token");
	}, []);

	const value = useMemo(
		() => ({
			login,
			logout,
		}),
		[login, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	return useContext(AuthContext);
}
