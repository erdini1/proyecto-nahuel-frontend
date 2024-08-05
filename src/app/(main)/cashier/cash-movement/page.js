"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Movements from "@/components/component/cash-movement/tabsCashRegister/Movements";
import Cancellations from "@/components/component/cash-movement/tabsCashRegister/Cancellation";
import CashRegister from "@/components/component/cash-movement/tabsCashRegister/CashRegister";
import ModalTerminals from "@/components/component/ModalTerminal";
import { checkIfCashRegisterExists, getLastCashRegister } from "@/service/cashRegisterService";
import { getTerminals } from "@/service/terminalService";
import { getCashBoxes } from "@/service/cashBoxService";
import Spinner from "@/components/component/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CashRegisterReport from "@/components/component/CashRegisterReport";
import { getCashMovements } from "@/service/cashMovementsService";
import { getCancellations } from "@/service/cancellationService";

export default function Page() {
	const [hasCashRegister, setHasCashRegister] = useState(false);
	const [selectedTab, setSelectedTab] = useState("cashRegister");
	const [cashBoxes, setCashBoxes] = useState([]);
	const [cashRegister, setCashRegister] = useState(null);
	const [cashMovements, setCashMovements] = useState([]);
	const [cancellations, setCancellations] = useState([]);
	const [terminals, setTerminals] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cashRegisterExists = await checkIfCashRegisterExists();

				const cashBoxes = await getCashBoxes()
				setCashBoxes(cashBoxes);

				if (cashRegisterExists) {
					setHasCashRegister(true);
					setSelectedTab("movements");

					const cashRegisterData = await getLastCashRegister();
					const cashMovementsData = await getCashMovements();
					const cancellationsData = await getCancellations();
					const terminals = await getTerminals(cashRegisterData.id);

					setCashRegister(cashRegisterData);
					setCashMovements(cashMovementsData);
					setCancellations(cancellationsData);
					setTerminals(terminals);

				}
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleTabChange = (value) => {
		if (value === "movements" && !hasCashRegister) {
			return;
		}
		setSelectedTab(value);
	};

	const onCashRegisterCreated = async () => {
		setIsLoading(true);
		setHasCashRegister(true);
		setSelectedTab("movements");
		const cashRegister = await getLastCashRegister();
		setCashRegister(cashRegister);
		const terminals = await getTerminals(cashRegister.id);
		setTerminals(terminals);
		setIsLoading(false);
	};

	const onCashRegisterUpdated = async () => {
		setIsLoading(true);
		setSelectedTab("movements");
		const cashRegister = await getLastCashRegister();
		setCashRegister(cashRegister);
		setIsLoading(false);
	};

	const handleUpdateCashMovements = (cashMovements) => {
		setCashMovements(cashMovements);
	}

	const refreshCashMovements = async () => {
		try {
			const cashMovementsData = await getCashMovements();
			setCashMovements(cashMovementsData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	const handleUpdateCancellations = (cancellations) => {
		setCancellations(cancellations);
	}

	const refreshCancellations = async () => {
		try {
			const cancellationsData = await getCancellations();
			setCancellations(cancellationsData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	// TODO: Agregar un desalizable para mostrar solo una cantidad movimientos y anulaciones
	return (
		<div className="w-full p-4 bg-gray-100 h-screen">
			<div className="flex flex-col gap-6">
				<Tabs value={selectedTab} onValueChange={handleTabChange}>
					<div className="flex gap-3 items-center">
						<div className="flex justify-between px-2">
							<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>
						</div>
						<div className="flex gap-10 items-center">
							<TabsList className="border-b">
								<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
								<TabsTrigger value="movements" disabled={!hasCashRegister}>Movimientos de Caja</TabsTrigger>
								<TabsTrigger value="reports" disabled={!hasCashRegister}>Cierre de caja</TabsTrigger>
							</TabsList>
							{selectedTab === "movements" && (
								<div className="items-center flex gap-2">
									<ModalTerminals
										terminals={terminals}
										onTerminalsChange={setTerminals}
										cashRegisterId={cashRegister?.id}
									/>
								</div>
							)}
						</div>
					</div>
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<>
							<TabsContent value="cashRegister" className="p-4">
								<CashRegister
									onCreated={onCashRegisterCreated}
									onUpdated={onCashRegisterUpdated}
									cashRegister={cashRegister}
									cashBoxes={cashBoxes.filter((cashBox) => cashBox.isActive)}
								/>
							</TabsContent>
							<TabsContent value="movements" className="p-4">
								<Card className="p-4 flex flex-col gap-10">
									<Movements
										cashRegisterId={cashRegister?.id}
										cashMovements={cashMovements}
										handleUpdateCashMovements={handleUpdateCashMovements}
										refreshCashMovements={refreshCashMovements}
									/>
									<Cancellations
										cashRegisterId={cashRegister?.id}
										cancellations={cancellations}
										handleUpdateCancellations={handleUpdateCancellations}
										refreshCancellations={refreshCancellations}
										terminals={terminals}
									/>
									<Button
										onClick={() => setSelectedTab("reports")}
										className={`flex items-center rounded-md transition-colors duration-300 w-1/3 mx-auto`}
									>
										Cargar datos
									</Button>
								</Card>
							</TabsContent>
							<TabsContent value="reports" className="p-4">
								<CashRegisterReport
									cashRegister={cashRegister}
									cashMovements={cashMovements}
									cancellations={cancellations}
									terminals={terminals}
								/>
							</TabsContent>
						</>
					)}
				</Tabs>
			</div>
		</div>
	);
}