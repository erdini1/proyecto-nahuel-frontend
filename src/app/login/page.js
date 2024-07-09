"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/config/axios.js";
import { decode } from '@/helpers/token.helper';
import { useToast } from "@/components/ui/use-toast"

export default function SignIn() {
	const [number, setNumber] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { login } = useAuthContext();
	const { toast } = useToast();

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
					router.push("/cashier");
					break;
				case 'employee':
					router.push("/employee/checklist");
					break;
				default:
					router.push("/unauthorized");
			}
		} catch (error) {
			setPassword('');
			toast({
				variant: "destructive",
				title: "Error al iniciar sesión",
				description: "Por favor, verifica tus credenciales.",
			})
		}
	};

	return (
		<div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md space-y-8 shadow-lg rounded-2xl mx-4 sm:mx-0 p-6">
				<div>
					{/* <h3 className=' mx-auto text-center text-3xl font-extrabold text-gray-900'>Tintin</h3> */}
					<h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground">
						Inicia sesión
					</h2>
				</div>
				<form className="space-y-6 px-4 sm:px-0" onSubmit={handleSubmit}>
					<div>
						<Label htmlFor="number" className="block text-sm font-medium text-muted-foreground">
							Numero de Empleado
						</Label>
						<div className="mt-1">
							<Input
								id="number"
								name="number"
								type="text"
								value={number}
								onChange={(e) => setNumber(e.target.value)}
								required
								className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
								placeholder="Numero de Empleado"
							/>
						</div>
					</div>
					<div>
						<Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
							Contraseña
						</Label>
						<div className="mt-1">
							<Input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
								placeholder="••••••••"
							/>
						</div>
					</div>
					<div>
						<Button
							type="submit"
							className="w-full justify-center rounded-md py-2 px-4 text-sm "
						>
							Iniciar sesión
						</Button>
					</div>
				</form>
			</Card>
		</div>
	)
}
