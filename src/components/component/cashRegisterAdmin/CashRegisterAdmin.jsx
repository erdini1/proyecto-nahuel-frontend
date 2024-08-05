"use client"
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CashRegisterAdminTable from "@/components/component/cashRegisterAdmin/CashRegisterAdminTable";
import Spinner from "@/components/component/Spinner";
import { SearchIcon, CalendarDaysIcon } from "@/components/icons/index";
import { getAllCashRegisters } from "@/service/cashRegisterService";
import { getAllCashMovements } from "@/service/cashMovementsService";
import { getAllCancellations } from "@/service/cancellationService";
import { getAllterminals } from "@/service/terminalService";
import { getCashBoxes } from "@/service/cashBoxService";
import DownloadExcel from "../DownloadExcel";
import { translateType } from "@/helpers/cancellation.helper";

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
	const [terminalFilter, setTerminalFilter] = useState("all");
	const [cashRegisterData, setCashRegisterData] = useState([]);
	const [cashMovementData, setCashMovementData] = useState([]);
	const [cancellationData, setCancellationData] = useState([]);

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
				setTerminals(terminalsData.filter(terminal => terminal.terminalNumber !== 'cash' && terminal.isActive) || []);
				setCashBoxes(cashBoxesData.filter(cashBox => cashBox.isActive) || []);

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
			const matchesTerminal = terminalFilter === 'all' ? true : cashRegister.Terminals.map(terminal => terminal.id).includes(terminalFilter);
			return matchesCashier && matchesCashBox && matchesDate && matchesTerminal;
		});
	}, [cashRegisters, searchQuery, cashBoxFilter, dateFilter, terminalFilter]);

	/*  */

	useEffect(() => {
		const calculateData = (cashRegister) => {
			const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
			const changeAmount = parseFloat(cashRegister.changeAmount) || 0;
			const incomeCash = initialAmount + changeAmount;

			const cashMovementsFiltered = cashMovements.filter(cashMovement => cashMovement.CashRegister.id === cashRegister.id);
			const cancellationsFiltered = cancellations.filter(cancellation => cancellation.CashRegister.id === cashRegister.id);

			const withdrawal = {
				Cash: calculateWithdrawal(cashMovementsFiltered, cancellationsFiltered, 'EFECTIVO'),
				Cards: calculateWithdrawal([], cancellationsFiltered, 'CLOVER'),
				MercadoPago: calculateWithdrawal([], cancellationsFiltered, 'MERCADO PAGO'),
				PointMaxiconsumo: calculateWithdrawal([], cancellationsFiltered, 'MAXI')
			};

			const toRenderSystem = {
				Cash: calculateToRenderSystem(+cashRegister.salesWithCash, incomeCash, withdrawal.Cash),
				Cards: calculateToRenderSystem(+cashRegister.salesWithCards, 0, withdrawal.Cards),
				MercadoPago: calculateToRenderSystem(+cashRegister.salesWithMercadoPago, 0, withdrawal.MercadoPago),
				PointMaxiconsumo: calculateToRenderSystem(+cashRegister.salesWithPointMaxiconsumo, 0, withdrawal.PointMaxiconsumo),
				Credit: +cashRegister.salesWithCredit
			};

			const diff = {
				Cash: calculateDiff(+cashRegister.cashToRenderWithCash, toRenderSystem.Cash),
				Cards: calculateDiff(+cashRegister.cashToRenderWithCards, toRenderSystem.Cards),
				MercadoPago: calculateDiff(+cashRegister.cashToRenderWithMercadoPago, toRenderSystem.MercadoPago),
				PointMaxiconsumo: calculateDiff(+cashRegister.cashToRenderWithPointMaxiconsumo, toRenderSystem.PointMaxiconsumo),
				Credit: calculateDiff(+cashRegister.cashToRenderWithCredit, toRenderSystem.Credit)
			};

			const totalPaymentMethods = Object.keys(cashRegister).filter(key => key.includes('salesWith')).reduce((sum, key) => sum + parseFloat(+cashRegister[key]), 0);

			return {
				id: cashRegister.id,
				cashier: `${cashRegister.User.firstName} ${cashRegister.User.lastName}`,
				date: format(toZonedTime(cashRegister.date, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy'),
				cashBoxNumber: cashRegister.CashBox.description,
				cashBoxHasCheckingAccount: cashRegister.CashBox.hasCheckingAccount,
				initialAmount,
				incomeChange: changeAmount,
				Terminals: cashRegister.Terminals,
				cashSales: +cashRegister.salesWithCash,
				cashIncome: incomeCash,
				cashWithdrawal: +withdrawal.Cash,
				cashToRenderSystem: +toRenderSystem.Cash,
				cashInHand: +cashRegister.cashToRenderWithCash,
				cashDiff: +diff.Cash,
				cardSales: +cashRegister.salesWithCards,
				cardWithdrawal: +withdrawal.Cards,
				cardToRenderSystem: +toRenderSystem.Cards,
				cardInHand: +cashRegister.cashToRenderWithCards,
				cardDiff: +diff.Cards,
				mercadoPagoSales: +cashRegister.salesWithMercadoPago,
				mercadoPagoWithdrawal: +withdrawal.MercadoPago,
				mercadoPagoToRenderSystem: +toRenderSystem.MercadoPago,
				mercadoPagoInHand: +cashRegister.cashToRenderWithMercadoPago,
				mercadoPagoDiff: +diff.MercadoPago,
				pointMaxiconsumoSales: +cashRegister.salesWithPointMaxiconsumo,
				pointMaxiconsumoWithdrawal: +withdrawal.PointMaxiconsumo,
				pointMaxiconsumoToRenderSystem: +toRenderSystem.PointMaxiconsumo,
				pointMaxiconsumoInHand: +cashRegister.cashToRenderWithPointMaxiconsumo,
				pointMaxiconsumoDiff: +diff.PointMaxiconsumo,
				batchNumber: cashRegister.batchNumber,
				creditSales: +cashRegister.salesWithCredit,
				creditToRenderSystem: +toRenderSystem.Credit,
				creditInHand: +cashRegister.cashToRenderWithCredit,
				creditDiff: +diff.Credit,
				observations: cashRegister.observations,
				isClosed: cashRegister.isClosed,
				totalPaymentMethods,
				totalDiff: +diff.Cash + +diff.Cards + +diff.MercadoPago + +diff.PointMaxiconsumo + +diff.Credit
			};
		};

		setCashRegisterData(filteredCashRegistersByCashierOrCashBox.map(calculateData));
	}, [filteredCashRegistersByCashierOrCashBox, cashMovements, cancellations]);


	useEffect(() => {
		const calculateCashMovementData = (cashMovement) => {
			const cashRegister = filteredCashRegistersByCashierOrCashBox.find(cr => cr.id === cashMovement.CashRegister.id);
			if (!cashRegister) return null;
			return {
				id: cashMovement.id,
				cashier: `${cashRegister?.User.firstName} ${cashRegister?.User.lastName}`,
				cashBoxNumber: cashRegister?.CashBox.description,
				date: format(toZonedTime(cashRegister.date, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy'),
				detail: cashMovement.Provider.name,
				type: cashMovement.type,
				time: cashMovement.time,
				amount: +cashMovement.amount,
				cashRegisterId: cashRegister.id
			};
		};

		setCashMovementData(cashMovements.map(calculateCashMovementData));
	}, [cashMovements, filteredCashRegistersByCashierOrCashBox]);

	useEffect(() => {
		const calculateCancellationData = (cancellation) => {
			const cashRegister = filteredCashRegistersByCashierOrCashBox.find(cr => cr.id === cancellation.CashRegister.id);
			if (!cashRegister) return null;
			return {
				id: cancellation.id,
				cashier: `${cashRegister?.User.firstName} ${cashRegister?.User.lastName}`,
				cashBoxNumber: cashRegister?.CashBox.description,
				date: format(toZonedTime(cashRegister.date, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy'),
				type: translateType(cancellation.type),
				method: cancellation.method,
				time: cancellation.time,
				amount: +cancellation.amount,
				cashRegisterId: cashRegister.id
			};
		};

		setCancellationData(cancellations.map(calculateCancellationData));
	}, [cancellations, filteredCashRegistersByCashierOrCashBox]);


	const calculateWithdrawal = (cashMovements, cancellations, method) => {
		return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0) +
			(cancellations.filter(cancellation => cancellation.method.includes(method)).reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));
	};

	const calculateToRenderSystem = (sales, income, withdrawal) => {
		return parseFloat(sales + income - withdrawal).toFixed(2);
	};

	const calculateDiff = (cashToRender, toRenderSystem) => {
		return (parseFloat(cashToRender || 0) - toRenderSystem).toFixed(2);
	};

	/*  */

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

						<Select id="terminalFilter" value={terminalFilter} onValueChange={(value) => setTerminalFilter(value)}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Filtrar por metodo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">- Metodos -</SelectItem>
								{terminals.map(terminal => (
									<SelectItem key={terminal.id} value={terminal.id} className="capitalize">
										{terminal.description}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<DownloadExcel
							cashRegisters={cashRegisterData}
							cashMovements={cashMovementData}
							cancellations={cancellationData}
							fileName="registro_de_caja"
						/>

					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<CashRegisterAdminTable
							cashRegisters={cashRegisterData}
							cashMovements={cashMovementData}
							cancellations={cancellationData}
						/>
					)}
				</main>
			</div>
		</div>
	);
}