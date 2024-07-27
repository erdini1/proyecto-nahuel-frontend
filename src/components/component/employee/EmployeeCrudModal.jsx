import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import MultiSelect from "@/components/component/MultiSelect";
import { getAllSectors } from "@/service/sectorService";
import { useToast } from "@/components/ui/use-toast"

export default function EmployeeCrudModal({
	isEditing,
	newEmployee,
	setNewEmployee,
	handleSaveEmployee,
	setShowCreateModal,
	employees
}) {
	const [showPassword, setShowPassword] = useState(false);
	const [editPassword, setEditPassword] = useState(!isEditing);
	const [isNumberDuplicate, setIsNumberDuplicate] = useState(false);
	const [sectors, setSectors] = useState([]);
	const [selectedSectors, setSelectedSectors] = useState([]);

	const { toast } = useToast()

	useEffect(() => {
		if (isEditing) {
			setEditPassword(false);
		}
	}, [isEditing]);

	useEffect(() => {
		const fetchSectors = async () => {
			try {
				const sectors = await getAllSectors();
				setSectors(sectors.filter(sector => sector.name !== "general" && sector.isActive) || []);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al mostrar los sectores",
				})
				setSectors([]);
			}
		};
		fetchSectors();
	}, []);

	useEffect(() => {
		if (newEmployee.Sectors) {
			const sectorIds = newEmployee.Sectors.map(sector => sector.id);
			setSelectedSectors(sectorIds);
		}
	}, [newEmployee]);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleEditPassword = () => {
		setEditPassword(!editPassword);
		setNewEmployee({ ...newEmployee, password: '' });
	};

	const handleSectorChange = (updatedSelectedSectors) => {
		setSelectedSectors(updatedSelectedSectors);
		const updatedSectors = sectors.filter(sector => updatedSelectedSectors.includes(sector.id));
		setNewEmployee({ ...newEmployee, Sectors: updatedSectors });
	};

	const validateEmployeeNumber = (number) => {
		const isDuplicate = employees.some(emp => emp.number === number && emp.id !== newEmployee.id);
		setIsNumberDuplicate(isDuplicate);
	};

	const handlePasswordChange = (e) => {
		const newNumber = e.target.value;
		setNewEmployee({ ...newEmployee, number: newNumber });
		validateEmployeeNumber(newNumber);
	};

	const handleSave = async () => {
		const updatedEmployee = { ...newEmployee, Sectors: sectors.filter(sector => selectedSectors.includes(sector.id)) };
		handleSaveEmployee(updatedEmployee);
	};

	return (
		<Dialog open={true} onOpenChange={setShowCreateModal}>
			<DialogContent className="sm:max-w-[600px] p-6 gap-6">
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
							<div className="grid gap-3 w-full">
								<Label htmlFor="sector">Sector</Label>
								<MultiSelect
									options={sectors}
									selected={selectedSectors}
									onChange={handleSectorChange}
									displayValue="name"
								/>
							</div>
						</div>
					</div>
					<div className="flex gap-1 items-center">
						<div className="grid gap-3 w-full">
							<Label htmlFor="number">Contraseña</Label>
							<div className="flex gap-1">
								<div className={`relative ${isEditing ? "w-4/5" : "w-full"}`}>
									<Input
										id="number"
										type={showPassword ? "text" : "password"}
										placeholder={editPassword ? "Ingrese nueva contraseña" : "Ingrese la contraseña"}
										value={editPassword ? newEmployee.number : '•••••••••••••••••••'}
										onChange={handlePasswordChange}
										className={`h-12 ${!isEditing ? "shadow" : ""} ${isNumberDuplicate ? "border-red-500" : ""}`}
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
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="outline" className="px-2 w-1/5 h-12 shadow">
												<Pencil1Icon className="h-4 w-4 text-gray-400 mr-2 " />
												Editar
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>¿Está seguro que desea cambiar la contraseña?</AlertDialogTitle>
												<AlertDialogDescription>
													La contraseña del empleado será modificada.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancelar</AlertDialogCancel>
												<AlertDialogAction
													onClick={toggleEditPassword}
												>Continuar</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								)}
							</div>
							{isNumberDuplicate && (
								<p className="text-red-500 text-sm">El número de empleado ya existe.</p>
							)}
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="submit"
						className="shadow"
						onClick={handleSave}
						disabled={
							!newEmployee.firstName ||
							!newEmployee.lastName ||
							!newEmployee.number ||
							!selectedSectors.length ||
							isNumberDuplicate
						}
					>
						{isEditing ? "Guardar Cambios" : "Crear Empleado"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
