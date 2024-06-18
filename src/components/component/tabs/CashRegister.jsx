import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { createCashRegister } from "@/service/cashRegisterService";
import { getUsers } from '@/service/userService';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function CashRegister() {
	const [cashRegisterNumber, setCashRegisterNumber] = useState('');
	const [initialAmount, setInitialAmount] = useState('');
	const [changeAmount, setChangeAmount] = useState('');
	const [userId, setUserId] = useState("");
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [open, setOpen] = useState(false);
	const [disabledButtons, setDisabledButtons] = useState(false);

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				const employees = await getUsers();
				setEmployees(employees.filter((employee) => employee.role !== "admin" && employee.role !== "employee"));
			} catch (error) {
				console.log('Failed to fetch employees:', error);
			}
		};
		fetchEmployees();
	}, []);

	const handleCashRegisterNumberChange = (number) => {
		setCashRegisterNumber(number);
		setDisabledButtons(!disabledButtons);
	};

	const handleSelectEmployee = (employeeId) => {
		const employee = employees.find(emp => emp.id === employeeId);
		setSelectedEmployee(employee);
		setUserId(employeeId);
		setOpen(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = {
			cashRegisterNumber,
			initialAmount,
			changeAmount,
			userId
		};
		try {
			await createCashRegister(formData);
			alert('Caja creada correctamente');
		} catch (error) {
			console.error('Error al crear la caja:', error);
		}
	};

	return (
		<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 border">
			<h2 className="text-xl font-bold mb-4">Datos de la Caja</h2>
			<form className="grid gap-4" onSubmit={handleSubmit}>
				<div className="grid gap-2">
					<label className="text-sm font-medium" htmlFor='cashNumber'>Número de caja</label>
					<ToggleGroup type="single" className="justify-center">
						{[1, 2, 3, 4].map((num) => (
							<ToggleGroupItem
								key={num}
								value={num}
								id="cashNumber"
								variant="outline"
								className={`w-1/4 ${disabledButtons && cashRegisterNumber !== num ? 'opacity-50 ' : 'shadow'}`}
								onClick={() => handleCashRegisterNumberChange(num)}
								disabled={disabledButtons && cashRegisterNumber !== num}
								pressed={cashRegisterNumber === num}
							>
								Caja {num}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
				<div className="grid gap-2">
					<label className="text-sm font-medium" htmlFor='cashier'>Cajero</label>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								id="cashier"
								aria-expanded={open}
								className="justify-between"
							>
								{selectedEmployee
									? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
									: "Seleccione un empleado..."}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[500px] p-0">
							<Command>
								<CommandInput placeholder="Buscar empleado..." />
								<CommandList>
									<CommandEmpty>Empleado no encontrado</CommandEmpty>
									<CommandGroup>
										{employees.map((employee) => (
											<CommandItem
												key={employee.id}
												value={employee.id}
												onSelect={() => handleSelectEmployee(employee.id)}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														userId === employee.id ? "opacity-100" : "opacity-0"
													)}
												/>
												{`${employee.firstName} ${employee.lastName}`}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
				<div className="flex gap-1">
					<div className="grid gap-2 w-1/2">
						<label className="text-sm font-medium" htmlFor='initialAmount'>Monto inicial</label>
						<Input
							id="initialAmount"
							type="number"
							min="0"
							value={initialAmount}
							onChange={(e) => setInitialAmount(e.target.value)}
							className="p-2 border rounded"
						/>
					</div>
					<div className="grid gap-2 w-1/2">
						<label className="text-sm font-medium" htmlFor='changeAmount'>Ingreso de cambio</label>
						<Input
							id="changeAmount"
							type="number"
							min="0"
							value={changeAmount}
							onChange={(e) => setChangeAmount(e.target.value)}
							className="p-2 border rounded"
						/>
					</div>
				</div>
				<Button
					className="w-full"
					type="submit"
					disabled={cashRegisterNumber === '' || initialAmount === '' || changeAmount === '' || userId === ''}
				>Guardar Datos Iniciales</Button>
			</form>
		</div>
	);
}
