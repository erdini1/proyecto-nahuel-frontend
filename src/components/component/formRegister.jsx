import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function FormRegister() {
	return (
		<div className="mx-auto max-w-md space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Crear nuevo usuario</h1>
				<p className="text-gray-500">Ingresa los datos del nuevo usuario</p>
			</div>
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="name">Nombre</Label>
						<Input id="name" placeholder="Ingresa tu nombre" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="lastName">Apellido</Label>
						<Input id="lastName" placeholder="Ingresa tu apellido" required />
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="number">Número</Label>
					<Input id="number" type="number" placeholder="Ingresa tu número" required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Contraseña</Label>
					<Input id="password" type="password" required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="role">Rol</Label>
					<Select id="role" defaultValue="employee">
						<SelectTrigger>
							<SelectValue placeholder="Selecciona un rol" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="cashier">Cajero</SelectItem>
							<SelectItem value="employee">Empleado</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button type="submit" className="w-full">
					Crear usuario
				</Button>
			</div>
		</div>
	)
}