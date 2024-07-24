"use client"
import { getAllCashRegisters } from "@/service/cashRegisterService";
import { useState, useEffect, useMemo } from "react";
import CashRegisterAdminTable from "@/components/component/cashRegisterAdmin/CashRegisterAdminTable";
import Spinner from "@/components/component/Spinner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllCashMovements } from "@/service/cashMovementsService";
import { getAllCancellations } from "@/service/cancellationService";
import { getAllterminals } from "@/service/terminalService";
import { SearchIcon, CalendarDaysIcon } from "@/components/icons/index";
import { getCashBoxes } from "@/service/cashBoxService";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'

export default function CashRegisterAdmin() {
	const [cashRegisters, setCashRegisters] = useState([]);
	const [cashMovements, setCashMovements] = useState([]);
	const [cancellations, setCancellations] = useState([]);
	const [terminals, setTerminals] = useState([]);
	const [cashBoxes, setCashBoxes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [cashBoxFilter, setCashBoxFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)

				const cashRegistersData = await getAllCashRegisters();
				const cashMovementsData = await getAllCashMovements();
				const cancellationsData = await getAllCancellations();
				const terminalsData = await getAllterminals();
				const cashBoxesData = await getCashBoxes();
				setCashRegisters(cashRegistersData);
				setCashMovements(cashMovementsData);
				setCancellations(cancellationsData);
				setTerminals(terminalsData);
				setCashBoxes(cashBoxesData);

			} catch (error) {
				console.log('Failed to fetch all tasks:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredCashRegistersByCashierOrCashBox = useMemo(() => {
		return cashRegisters.filter((cashRegister) => {
			const matchesCashier = `${cashRegister.User.firstName} ${cashRegister.User.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCashBox = cashBoxFilter === 'all' ? true : cashRegister.CashBox.id === cashBoxFilter;
			const matchesDate = dateFilter === null ? true : (dateFilter ? cashRegister.date === format(dateFilter, 'yyyy-MM-dd') : true)
			return matchesCashier && matchesCashBox && matchesDate;
		});
	}, [cashRegisters, searchQuery, cashBoxFilter, dateFilter]);

	// TODO: Agregar para poder filtrar por terminales

	return (
		<div className="">
			<div className="flex flex-col">
				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
					<div className="flex-1">
						<h1 className="font-semibold text-lg">Registro de Caja</h1>
					</div>
					<div className="flex gap-2">
						<form className="ml-auto flex-1 sm:flex-initial">
							<div className="relative">
								<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
								<Input
									className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
									placeholder="Buscar Empleado..."
									type="search"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</form>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-[200px] justify-start text-left font-normal",
										!dateFilter && "text-muted-foreground"
									)}
								>
									<CalendarDaysIcon className="mr-2 h-4 w-4" />
									{dateFilter ? format(toZonedTime(dateFilter, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy') : <span className="overflow-hidden">Seleccione una fecha</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={dateFilter}
									onSelect={setDateFilter}
									initialFocus
								/>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => setDateFilter(null)}
								>
									Limpiar
								</Button>
							</PopoverContent>
						</Popover>

						<Select id="cashBoxFilter" value={cashBoxFilter} onValueChange={(value) => setCashBoxFilter(value)}>
							<SelectTrigger className="w-28">
								<SelectValue placeholder="Filtrar por caja" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">- Cajas -</SelectItem>
								{cashBoxes.map(cashBox => (
									<SelectItem key={cashBox.id} value={cashBox.id} className="capitalize">
										{cashBox.description}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<CashRegisterAdminTable
							cashRegisters={filteredCashRegistersByCashierOrCashBox}
							cashMovements={cashMovements}
							cancellations={cancellations}
							terminals={terminals}
						/>
					)}
				</main>
			</div>
		</div>
	);
}
// "use client"
// import { getAllCashRegisters } from "@/service/cashRegisterService";
// import { useState, useEffect } from "react";
// import CashRegisterAdminTable from "@/components/component/CashRegisterAdminTable";
// import Spinner from "@/components/component/Spinner";

// export default function CashRegisterAdmin() {
// 	const [cashRegisters, setCashRegisters] = useState([]);
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				setIsLoading(true)
// 				const cashRegisters = await getAllCashRegisters();
// 				setCashRegisters(cashRegisters);

// 			} catch (error) {
// 				console.log('Failed to fetch all tasks:', error);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};
// 		fetchData();
// 	}, []);

// 	return (
// 		<div className="min-h-screen">
// 			<div className="flex flex-col">
// 				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
// 					<div className="">
// 						<h1 className="font-semibold text-lg">Registro de Caja</h1>
// 					</div>
// 				</header>
// 				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
// 					{isLoading ? (
// 						<div className="flex justify-center items-center h-64">
// 							<Spinner />
// 						</div>
// 					) : (
// 						<CashRegisterAdminTable
// 							cashRegisters={cashRegisters}
// 						/>
// 					)}
// 				</main>
// 			</div>
// 		</div>
// 	);
// }
