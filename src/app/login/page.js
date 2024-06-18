"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import axios from "@/config/axios.js";
import { decode } from '@/helpers/token.helper';

// TODO: Modificar un poco la estetica
export default function SignIn() {
	const [number, setNumber] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { login } = useAuthContext();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post('/auth/login', { number, password });
			const { token } = response.data;
			const decodedToken = decode(token);

			login(token);

			switch (decodedToken.role) {
				case 'admin':
					router.push("/admin/dashboard");
					break;
				case 'cashier':
					router.push("/");
					break;
				case 'employee':
					router.push("/employee/checklist");
					break;
				default:
					router.push("/unauthorized");
			}
		} catch (error) {
			console.error('Error during login:', error);
			alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
				<div className="flex justify-center">
					<div className="bg-blue-500 text-white rounded-full p-3">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v8m0-8H8m4 0h4m-4 0a4 4 0 004-4v4a4 4 0 00-4-4m0 0a4 4 0 00-4 4v4a4 4 0 004-4z"></path>
						</svg>
					</div>
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in
				</h2>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="number" className="sr-only">
								Numero de Empleado
							</label>
							<input
								id="number"
								name="number"
								type="text"
								value={number}
								onChange={(e) => setNumber(e.target.value)}
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Numero de Empleado"
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Sign In
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
