"use client";
import { useState, useEffect } from "react";
import { getUsers } from "@/service/userService";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ROLE } from "@/constants/role.constant";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, CalendarDaysIcon } from "lucide-react";

const EmployeeDateSelector = ({ onSelection }) => {
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [date, setDate] = useState(new Date());
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				const data = await getUsers();
				const filteredData = data.filter(employee => employee.role !== ROLE.ADMIN);
				setEmployees(filteredData);
			} catch (error) {
				console.log('Failed to fetch employees:', error);
			}
		};
		fetchEmployees();
	}, []);

	const handleConfirmSelection = () => {
		if (selectedEmployee && date) {
			onSelection(selectedEmployee, date);
		}
	};

	const handleSelectEmployee = (employeeId) => {
		const employee = employees.find(emp => emp.id === employeeId);
		setSelectedEmployee(employee);
		setValue(employeeId);
		setOpen(false);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-[700px] mx-auto">
			<div className="flex gap-2 align-middle items-center w-full">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-2/3 justify-between"
						>
							{selectedEmployee
								? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
								: "Seleccione un empleado..."}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[450px] p-0">
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
													value === employee.id ? "opacity-100" : "opacity-0"
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
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" className="gap-2 w-1/3">
							<CalendarDaysIcon className="h-4 w-4" />
							{date ? <span className="font-normal">{date.toLocaleDateString()}</span> : "Seleccionar fecha"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="p-0 max-w-[276px]">
						<Calendar
							mode="single"
							selected={date}
							onSelect={(newDate) => setDate(new Date(newDate.setHours(0, 0, 0, 0)))}
							disabled={(date) =>
								date > new Date() || date < new Date("1900-01-01")
							}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
			<Button
				onClick={handleConfirmSelection}
				className="mt-4 w-36"
				disabled={!selectedEmployee || !date}
			>
				Confirmar
			</Button>
		</div>
	);
};

export default EmployeeDateSelector;
