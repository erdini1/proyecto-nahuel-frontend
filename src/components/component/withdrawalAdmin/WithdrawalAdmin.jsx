"use client"
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/component/Spinner";
import { SearchIcon, CalendarDaysIcon } from "@/components/icons/index";
import MultiSelect from "@/components/component/MultiSelect";
import WithdrawalTable from "@/components/component/withdrawalAdmin/WithdrawalTable";
import { getAllWithdrawals, getWithdrawalsSummary } from "@/service/cashMovementsService";
import { getCashBoxes } from "@/service/cashBoxService";

export default function WithdrawalAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [cashMovements, setCashMovements] = useState([]);
	const [cashBoxes, setCashBoxes] = useState([]);
	const [summary, setSummary] = useState([]);
	const [totalItems, setTotalItems] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [cashBoxFilter, setCashBoxFilter] = useState([]);
	const [dateFilter, setDateFilter] = useState({ from: null, to: null });
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	const { toast } = useToast();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)

				const [
					{ rows, count },
					cashBoxesData,
					summary
				] = await Promise.all([
					getAllWithdrawals(currentPage),
					getCashBoxes(),
					getWithdrawalsSummary()
				]);

				setCashMovements(rows);
				setTotalItems(count);
				setSummary(summary);
				setCashBoxes(cashBoxesData.filter(cashBox => cashBox.isActive) || []);

			} catch (error) {
				console.error('Failed to get cash movements:', error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al mostar los datos",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [currentPage, itemsPerPage]);

	const filteredCashMovementsByProviderCashBoxOrDate = useMemo(() => {
		return cashMovements.filter((cashMovement) => {
			const matchesProvider = `${cashMovement.Provider.name}`.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCashBox = cashBoxFilter.length === 0 || cashBoxFilter.includes(cashMovement.CashRegister.CashBox.id);
			const matchesDate = dateFilter?.from && dateFilter.to ?
				(cashMovement.CashRegister.date >= format(dateFilter?.from, 'yyyy-MM-dd') && cashMovement.CashRegister.date <= format(dateFilter.to, 'yyyy-MM-dd')) : true;
			return matchesProvider && matchesCashBox && matchesDate;
		});
	}, [cashMovements, searchQuery, cashBoxFilter, dateFilter]);

	const handleNextPage = () => {
		if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
			setCurrentPage(prev => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(prev => prev - 1);
		}
	};

	return (
		<div className="">
			<div className="flex flex-col">
				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
					<div className="flex-1">
						<h1 className="font-semibold text-lg">Pagos de Proveedores</h1>
					</div>
					<div className="flex gap-2">
						<form className="ml-auto flex-1 sm:flex-initial">
							<div className="relative">
								<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
								<Input
									className="pl-8 w-full bg-white"
									placeholder="Buscar Proveedor..."
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
										"w-auto justify-start text-left font-normal",
										!dateFilter?.from && !dateFilter?.to && "text-muted-foreground"
									)}
								>
									<CalendarDaysIcon className="mr-2 h-4 w-4" />
									{dateFilter?.from && dateFilter?.to
										? `${format(toZonedTime(dateFilter?.from, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy')} - ${format(toZonedTime(dateFilter.to, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy')}`
										: <span className="overflow-hidden">Rango de fechas</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="range"
									selected={dateFilter}
									onSelect={setDateFilter}
									initialFocus
								/>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => setDateFilter({ from: null, to: null })}
								>
									Limpiar
								</Button>
							</PopoverContent>
						</Popover>

						<div className="w-auto min-w-[150px]">
							<MultiSelect
								name="caja"
								options={cashBoxes}
								selected={cashBoxFilter}
								onChange={setCashBoxFilter}
								displayValue="description"
								displayQuantity={1}
							/>
						</div>
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<>
							<WithdrawalTable
								cashMovements={filteredCashMovementsByProviderCashBoxOrDate}
								totalOfAllWithdrawals={summary}
							/>
							<div className="flex justify-between items-center">
								<button
									onClick={handlePreviousPage}
									disabled={currentPage === 1}
								>
									Anterior
								</button>
								<span>Página {currentPage}</span>
								<button
									onClick={handleNextPage}
									disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
								>
									Siguiente
								</button>
							</div>
						</>
					)}
				</main>
			</div>
		</div>
	);
}
// "use client"
// import { useState, useEffect, useMemo } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";
// import { format } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz'
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Spinner from "@/components/component/Spinner";
// import { SearchIcon, CalendarDaysIcon } from "@/components/icons/index";
// import MultiSelect from "@/components/component/MultiSelect";
// import WithdrawalTable from "@/components/component/withdrawalAdmin/WithdrawalTable";
// import { getAllWithdrawals } from "@/service/cashMovementsService";
// import { getCashBoxes } from "@/service/cashBoxService";

// export default function WithdrawalAdmin() {
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [cashMovements, setCashMovements] = useState([]);
// 	const [cashBoxes, setCashBoxes] = useState([]);
// 	const [searchQuery, setSearchQuery] = useState("");
// 	const [cashBoxFilter, setCashBoxFilter] = useState([]);
// 	const [dateFilter, setDateFilter] = useState({ from: null, to: null });
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [itemsPerPage] = useState(10);

// 	const { toast } = useToast();

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				setIsLoading(true)

// 				const [
// 					cashMovementData,
// 					cashBoxesData
// 				] = await Promise.all([
// 					getAllWithdrawals(),
// 					getCashBoxes()
// 				]);

// 				setCashMovements(cashMovementData);
// 				setCashBoxes(cashBoxesData.filter(cashBox => cashBox.isActive) || []);

// 			} catch (error) {
// 				toast({
// 					variant: "destructive",
// 					title: "Error",
// 					description: "Ocurrió un error al mostar los datos",
// 				});
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};
// 		fetchData();
// 	}, []);

// 	const filteredCashMovementsByProviderCashBoxOrDate = useMemo(() => {
// 		return cashMovements.filter((cashMovement) => {
// 			const matchesProvider = `${cashMovement.Provider.name}`.toLowerCase().includes(searchQuery.toLowerCase());
// 			const matchesCashBox = cashBoxFilter.length === 0 || cashBoxFilter.includes(cashMovement.CashRegister.CashBox.id);
// 			const matchesDate = dateFilter?.from && dateFilter.to ?
// 				(cashMovement.CashRegister.date >= format(dateFilter?.from, 'yyyy-MM-dd') && cashMovement.CashRegister.date <= format(dateFilter.to, 'yyyy-MM-dd')) : true;
// 			return matchesProvider && matchesCashBox && matchesDate;
// 		});
// 	}, [cashMovements, searchQuery, cashBoxFilter, dateFilter]);

// 	const paginatedCashMovements = useMemo(() => {
// 		const startIndex = (currentPage - 1) * itemsPerPage;
// 		const endIndex = startIndex + itemsPerPage;
// 		return filteredCashMovementsByProviderCashBoxOrDate.slice(startIndex, endIndex);
// 	}, [filteredCashMovementsByProviderCashBoxOrDate, currentPage, itemsPerPage]);

// 	const totalWithdrawals = () => {
// 		return filteredCashMovementsByProviderCashBoxOrDate.reduce((acc, cashMovement) => {
// 			return acc + (+cashMovement.amount);
// 		}, 0)
// 	}

// 	return (
// 		<div className="">
// 			<div className="flex flex-col">
// 				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
// 					<div className="flex-1">
// 						<h1 className="font-semibold text-lg">Pagos de Proveedores</h1>
// 					</div>
// 					<div className="flex gap-2">
// 						<form className="ml-auto flex-1 sm:flex-initial">
// 							<div className="relative">
// 								<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
// 								<Input
// 									className="pl-8 w-full bg-white"
// 									placeholder="Buscar Proveedor..."
// 									type="search"
// 									value={searchQuery}
// 									onChange={(e) => setSearchQuery(e.target.value)}
// 								/>
// 							</div>
// 						</form>

// 						<Popover>
// 							<PopoverTrigger asChild>
// 								<Button
// 									variant={"outline"}
// 									className={cn(
// 										"w-auto justify-start text-left font-normal",
// 										!dateFilter?.from && !dateFilter?.to && "text-muted-foreground"
// 									)}
// 								>
// 									<CalendarDaysIcon className="mr-2 h-4 w-4" />
// 									{dateFilter?.from && dateFilter?.to
// 										? `${format(toZonedTime(dateFilter?.from, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy')} - ${format(toZonedTime(dateFilter.to, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy')}`
// 										: <span className="overflow-hidden">Rango de fechas</span>}
// 								</Button>
// 							</PopoverTrigger>
// 							<PopoverContent className="w-auto p-0">
// 								<Calendar
// 									mode="range"
// 									selected={dateFilter}
// 									onSelect={setDateFilter}
// 									initialFocus
// 								/>
// 								<Button
// 									variant="outline"
// 									className="w-full"
// 									onClick={() => setDateFilter({ from: null, to: null })}
// 								>
// 									Limpiar
// 								</Button>
// 							</PopoverContent>
// 						</Popover>

// 						<div className="w-auto min-w-[150px]">
// 							<MultiSelect
// 								name="caja"
// 								options={cashBoxes}
// 								selected={cashBoxFilter}
// 								onChange={setCashBoxFilter}
// 								displayValue="description"
// 								displayQuantity={1}
// 							/>
// 						</div>
// 					</div>
// 				</header>
// 				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
// 					{isLoading ? (
// 						<div className="flex justify-center items-center h-64">
// 							<Spinner />
// 						</div>
// 					) : (
// 						<>
// 							<WithdrawalTable
// 								cashMovements={paginatedCashMovements}
// 								totalOfAllWithdrawals={totalWithdrawals()}
// 							/>
// 							<div className="flex justify-between items-center">
// 								<button
// 									onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// 									disabled={currentPage === 1}
// 								>
// 									Anterior
// 								</button>
// 								<span>Página {currentPage}</span>
// 								<button
// 									onClick={() => setCurrentPage(prev => prev + 1)}
// 									disabled={currentPage === Math.ceil(filteredCashMovementsByProviderCashBoxOrDate.length / itemsPerPage)}
// 								>
// 									Siguiente
// 								</button>
// 							</div>
// 						</>
// 					)}
// 				</main>
// 			</div>
// 		</div>
// 	);
// }