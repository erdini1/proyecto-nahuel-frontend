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
import { Button } from "@/components/ui/button";

// TODO: Agregar un svg del signo de pesos en los inputs de dinero
export default function Page() {
	const [hasCashRegister, setHasCashRegister] = useState(false);
	const [selectedTab, setSelectedTab] = useState("cashRegister");
	const [terminals, setTerminals] = useState([]);
	const [cashRegister, setCashRegister] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cashRegisterExists = await checkIfCashRegisterExists();
				if (cashRegisterExists) {
					setHasCashRegister(true);
					setSelectedTab("movements");

					const cashRegister = await getLastCashRegister();
					setCashRegister(cashRegister);

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
		setCashRegister(cashRegister);
		const terminals = await getTerminals(cashRegister.id);
		setTerminals(terminals);
		setIsLoading(false);
	};

	// TODO: Agregar un desalizable para mostrar solo una cantidad movimientos y anulaciones
	// TODO: Revisar que si voy a crear cashregister me va a dejar hacerlo sin terminar de crear el anterior
	return (
		<div className="w-full p-4">
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
							</TabsList>
							{selectedTab === "movements" && (
								<div className="items-center flex gap-2">
									<ModalTerminals
										terminals={terminals}
										onTerminalsChange={setTerminals}
										cashRegisterId={cashRegister}
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
									cashRegister={cashRegister}
								/>
							</TabsContent>
							<TabsContent value="movements">
								<div className="p-4 flex flex-col gap-10">
									<Movements
										cashRegisterId={cashRegister.id}
									/>
									<Cancellations
										terminals={terminals}
										cashRegisterId={cashRegister.id}
									/>
								</div>
							</TabsContent>
							{selectedTab === "movements" && (
								<Link href="/cashier/cash-movement/report" className="">
									<Button
										className={`flex items-center rounded-md transition-colors duration-300 w-1/4 mx-auto ${!hasCashRegister ? 'hidden' : ''}`}
									>Cargar datos
									</Button>
								</Link>
							)}
						</>
					)}
				</Tabs>
			</div>
		</div>
	);
}