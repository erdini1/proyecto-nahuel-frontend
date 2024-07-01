"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Movements from "@/components/component/cash-movement/tabsCashRegister/Movements";
import Cancellations from "@/components/component/cash-movement/tabsCashRegister/Cancellation";
import CashRegister from "@/components/component/cash-movement/tabsCashRegister/CashRegister";
import { checkIfCashRegisterExists, getLastCashRegister } from "@/service/cashRegisterService";
import ModalTerminals from "@/components/component/ModalTerminal";
import { getTerminals } from "@/service/terminalService";
import Link from "next/link";
import Spinner from "@/components/component/Spinner";

export default function Page() {
	const [hasCashRegister, setHasCashRegister] = useState(false);
	const [selectedTab, setSelectedTab] = useState("cashRegister");
	const [terminals, setTerminals] = useState([]);
	const [cashRegisterId, setCashRegisterId] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cashRegisterExists = await checkIfCashRegisterExists();
				if (cashRegisterExists) {
					setHasCashRegister(true);
					setSelectedTab("movements");
				}

				const cashRegister = await getLastCashRegister();
				setCashRegisterId(cashRegister.id);

				if (cashRegister.id) {
					const terminals = await getTerminals(cashRegister.id);
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
		setCashRegisterId(cashRegister.id);
		const terminals = await getTerminals(cashRegister.id);
		setTerminals(terminals);
		setIsLoading(false);
	};

	// TODO: Agregar un desalizable para mostrar solo una cantidad movimientos y anulaciones
	return (
		<div className="w-full p-4">
			<div className="flex flex-col gap-6">
				<div className="flex justify-between px-2">
					<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>

				</div>
				<Tabs value={selectedTab} onValueChange={handleTabChange}>
					<div className="flex gap-3 justify-between items-center">
						<div className="flex gap-10 items-center">

							<TabsList className="border-b">
								<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
								<TabsTrigger value="movements" disabled={!hasCashRegister}>Movimientos de Caja</TabsTrigger>
							</TabsList>
							{selectedTab === "movements" && (
								<div className="items-center flex gap-2">
									<ModalTerminals
										terminals={terminals}
										onTerminalsChange={setTerminals}
										cashRegisterId={cashRegisterId}
									/>
								</div>
							)}
						</div>
						<Link href="/cashier/cash-movement/report">
							<button
								className={`px-4 py-2.5 text-md font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 ${!hasCashRegister ? 'hidden' : ''}`}
							>Cargar datos
							</button>
						</Link>
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
								/>
							</TabsContent>
							<TabsContent value="movements">
								<div className="p-4 flex gap-2">
									<Movements
										cashRegisterId={cashRegisterId}
									/>
									<Cancellations
										terminals={terminals}
										cashRegisterId={cashRegisterId}
									/>
								</div>
							</TabsContent>
						</>
					)}
				</Tabs>
			</div>
		</div>
	);
}