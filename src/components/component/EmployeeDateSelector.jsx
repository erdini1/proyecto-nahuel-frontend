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
import { ChevronsUpDown } from "lucide-react";
import { CalendarDaysIcon, CheckIcon } from "@/components/icons/index";
import { useToast } from "@/components/ui/use-toast";

const EmployeeDateSelector = ({ onSelection }) => {
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [date, setDate] = useState({ from: null, to: null });
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	const { toast } = useToast();

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				const data = await getUsers();
				const filteredData = data.filter((employee) => employee.role !== ROLE.ADMIN);
				setEmployees(filteredData);
			} catch (error) {
				console.log("Failed to fetch employees:", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al mostrar los empleados",
				});
			}
		};
		fetchEmployees();
	}, []);

	const handleConfirmSelection = () => {
		if (selectedEmployee && date.from && date.to) {
			onSelection(selectedEmployee, date);
		}
	};

	const handleSelectEmployee = (employeeId) => {
		const employee = employees.find((emp) => emp.id === employeeId);
		setSelectedEmployee(employee);
		setValue(employeeId);
		setOpen(false);
	};

	const handleDateSelect = (newDate) => {
		setDate(newDate);
	};

	const today = new Date();
	const fourteenDaysAgo = new Date(today);
	fourteenDaysAgo.setDate(today.getDate() - 14);

	const isDateDisabled = (d) => {
		return d > today || d < fourteenDaysAgo;
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-[700px] mx-auto border">
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
											className="capitalize"
										>
											<CheckIcon
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
						<Button
							id="date"
							variant={"outline"}
							className={cn(
								"w-[300px] justify-start text-left font-normal",
								!date && "text-muted-foreground"
							)}
						>
							<CalendarDaysIcon className="mr-2 h-4 w-4" />
							{date?.from && date.to ? (
								`${new Date(date?.from).toLocaleDateString()} - ${new Date(date.to).toLocaleDateString()}`
							) : (
								<span>Seleccionar un rango de fechas</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							initialFocus
							mode="range"
							defaultMonth={date?.from}
							selected={date}
							onSelect={handleDateSelect}
							numberOfMonths={1}
							disabled={isDateDisabled}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<Button
				onClick={handleConfirmSelection}
				className="mt-4 w-36"
				disabled={!selectedEmployee || !date?.from || !date.to}
			>
				Confirmar
			</Button>
		</div>
	);
};

export default EmployeeDateSelector;
