import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EyeOpenIcon, EyeClosedIcon, Pencil1Icon } from "@radix-ui/react-icons";

export default function EmployeeCrudModal({ isEditing, newEmployee, setNewEmployee, handleSaveEmployee, setShowCreateModal, employees }) {
	const [showPassword, setShowPassword] = useState(false);
	const [editPassword, setEditPassword] = useState(!isEditing);
	const [isNumberDuplicate, setIsNumberDuplicate] = useState(false);

	useEffect(() => {
		if (isEditing) {
			setEditPassword(false);
		}
	}, [isEditing]);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleEditPassword = () => {
		setEditPassword(!editPassword);
		setNewEmployee({ ...newEmployee, password: '' });
	};

	const validateEmployeeNumber = async () => {
		try {
			const isDuplicate = employees.some(emp => emp.number === +newEmployee.number && emp.id !== newEmployee.id);
			setIsNumberDuplicate(isDuplicate);
		} catch (error) {
			console.log('Failed to validate employee number:', error);
		}
	};

	const handleSave = async () => {
		await validateEmployeeNumber();
		if (!isNumberDuplicate) {
			handleSaveEmployee();
		}
	};

	return (
		<Dialog open={true} onOpenChange={setShowCreateModal}>
			<DialogContent className="sm:max-w-[550px] p-6 gap-6">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Modificar Empleado" : "Crear Empleado"}</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Modificar la información del empleado"
							: "Complete el formulario para crear un nuevo empleado"}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex gap-1">
						<div className="grid gap-3 w-1/2">
							<Label htmlFor="firstName">Nombre</Label>
							<Input
								id="firstName"
								type="text"
								placeholder="Ingrese el nombre"
								value={newEmployee.firstName}
								className="h-12 shadow"
								onChange={(e) =>
									setNewEmployee({ ...newEmployee, firstName: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-3 w-1/2">
							<Label htmlFor="lastName">Apellido</Label>
							<Input
								id="lastName"
								type="text"
								placeholder="Ingrese el apellido"
								value={newEmployee.lastName}
								className="h-12 shadow"
								onChange={(e) =>
									setNewEmployee({ ...newEmployee, lastName: e.target.value })
								}
							/>
						</div>
					</div>
					<div>
						<div className="flex gap-1">
							<div className="grid gap-3 w-2/3">
								<Label htmlFor="number">Numero de empleado</Label>
								<Input
									id="number"
									type="number"
									placeholder="Ingrese numero de empleado"
									value={newEmployee.number}
									onChange={(e) =>
										setNewEmployee({ ...newEmployee, number: e.target.value })
									}
									onBlur={validateEmployeeNumber}
									className={`h-12 ${!isEditing ? "shadow" : ""} ${isNumberDuplicate ? "border-red-500" : ""}`}
									disabled={isEditing}
								/>
							</div>
							<div className="grid gap-3 w-1/3">
								<Label htmlFor="role">Rol</Label>
								<Select
									id="role"
									value={newEmployee.role}
									onValueChange={(value) =>
										setNewEmployee({ ...newEmployee, role: value })
									}
								>
									<SelectTrigger className="w-full h-12 shadow">
										<SelectValue placeholder="Seleccionar rol" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="employee">Empleado</SelectItem>
										<SelectItem value="cashier">Cajero</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						{isNumberDuplicate && (
							<p className="text-red-500 text-sm">
								El número de empleado ya está en uso.
							</p>
						)}
					</div>
					<div className="relative">
						<Label htmlFor="password">Contraseña</Label>
						<div className="flex mt-2 gap-1">
							<div className={`relative ${isEditing ? "w-4/5" : "w-full"}`}>
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder={editPassword ? "Ingrese nueva contraseña" : "Ingrese la contraseña"}
									value={editPassword ? newEmployee.password : '•••••••••••••••••••'}
									onChange={(e) =>
										setNewEmployee({
											...newEmployee,
											password: e.target.value,
										})
									}
									className="h-12 shadow"
									disabled={!editPassword}
								/>
								{editPassword && (
									<button
										type="button"
										className="absolute inset-y-0 right-2 px-2 flex items-center"
										onClick={togglePasswordVisibility}
									>
										{showPassword ? <EyeClosedIcon className="h-5 w-5 text-gray-400" /> : <EyeOpenIcon className="h-5 w-5 text-gray-400" />}
									</button>
								)}
							</div>
							{isEditing && (
								<Button onClick={toggleEditPassword} variant="outline" className="px-2 w-1/5 h-12 shadow">
									<Pencil1Icon className="h-4 w-4 text-gray-400 mr-2 " />
									Editar
								</Button>
							)}
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={handleSave}
						disabled={
							!newEmployee.firstName ||
							!newEmployee.lastName ||
							!newEmployee.number ||
							!newEmployee.role ||
							!newEmployee.password ||
							isNumberDuplicate
						}
					>
						{isEditing ? "Actualizar" : "Crear"}
					</Button>
					<Button variant="outline" onClick={() => setShowCreateModal(false)}>
						Cancelar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
