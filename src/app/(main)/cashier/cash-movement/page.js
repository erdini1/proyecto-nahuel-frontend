"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Movements from "@/components/component/tabsCashRegister/Movements";
import Cancellations from "@/components/component/tabsCashRegister/Cancellation";
import CashRegister from "@/components/component/tabsCashRegister/CashRegister";
import { checkIfCashRegisterExists } from "@/service/cashRegisterService";
import ModalTerminals from "@/components/component/ModalTerminal";
import { TERMINALS } from "@/constants/terminals.constant";

export default function Page() {
	const [hasCashRegister, setHasCashRegister] = useState(false);
	const [selectedTab, setSelectedTab] = useState("cashRegister");
	const [terminals, setTerminals] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cashRegisterExists = await checkIfCashRegisterExists();
				if (cashRegisterExists) {
					setHasCashRegister(true);
					setSelectedTab("movements");
				}
			} catch (error) {
				console.error('Error fetching data:', error);
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

	const onCashRegisterCreated = () => {
		setHasCashRegister(true);
		setSelectedTab("movements");
	};

	return (
		<div className="w-full p-4">
			<div className="flex flex-col gap-6">
				<div className="flex justify-between px-2">
					<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>
					<button className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={() => setHasCashRegister(false)}>Cerrar Caja</button>
				</div>
				<Tabs value={selectedTab} onValueChange={handleTabChange}>
					<div className="flex justify-between">
						<TabsList className="border-b">
							<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
							<TabsTrigger value="movements" disabled={!hasCashRegister}>Movimientos de Caja</TabsTrigger>
						</TabsList>
						{selectedTab === "movements" && (
							<div>
								<ModalTerminals
								// options={terminalOptions}
								/>
							</div>
						)}
					</div>
					<TabsContent value="cashRegister" className="p-4">
						<CashRegister onCreated={onCashRegisterCreated} />
					</TabsContent>
					<TabsContent value="movements">
						<div className="p-4 flex gap-2">
							<Movements />
							<Cancellations />
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}


// "use client";
// import { useState, useEffect } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import Movements from "@/components/component/tabsCashRegister/Movements";
// import Cancellations from "@/components/component/tabsCashRegister/Cancellation";
// import CashRegister from "@/components/component/tabsCashRegister/CashRegister";
// import { checkIfCashRegisterExists } from "@/service/cashRegisterService";
// import ModalTerminals from "@/components/component/ModalTerminal";
// import { TERMINALS } from "@/constants/terminals.constant";

// export default function Page() {
// 	const [hasCashRegister, setHasCashRegister] = useState(false);
// 	const [selectedTab, setSelectedTab] = useState("cashRegister");

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				const cashRegisterExists = await checkIfCashRegisterExists();
// 				if (cashRegisterExists) {
// 					setHasCashRegister(true);
// 					setSelectedTab("movements");
// 				}
// 			} catch (error) {
// 				console.error('Error fetching data:', error);
// 			}
// 		};
// 		fetchData();
// 	}, []);

// 	const handleTabChange = (value) => {
// 		if (value === "movements" && !hasCashRegister) {
// 			return;
// 		}
// 		setSelectedTab(value);
// 	};

// 	const onCashRegisterCreated = () => {
// 		setHasCashRegister(true);
// 		setSelectedTab("movements");
// 	};

// 	const terminalOptions = TERMINALS;

// 	return (
// 		<div className="w-full p-4">
// 			<div className="flex flex-col gap-6">
// 				<div className="flex justify-between px-2">
// 					<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>
// 					<button className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={() => setHasCashRegister(false)}>Cerrar Caja</button>
// 				</div>
// 				<Tabs value={selectedTab} onValueChange={handleTabChange}>
// 					<div className="flex justify-between">
// 						<TabsList className="border-b">
// 							<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
// 							<TabsTrigger value="movements" disabled={!hasCashRegister}>Movimientos de Caja</TabsTrigger>
// 						</TabsList>
// 						{selectedTab === "movements" && (
// 							<div>
// 								<ModalTerminals
// 									options={terminalOptions}
// 								/>
// 							</div>
// 						)}
// 					</div>
// 					<TabsContent value="cashRegister" className="p-4">
// 						<CashRegister onCreated={onCashRegisterCreated} />
// 					</TabsContent>
// 					<TabsContent value="movements">
// 						<div className="p-4 flex gap-2">
// 							<Movements />
// 							<Cancellations />
// 						</div>
// 					</TabsContent>
// 				</Tabs>
// 			</div>
// 		</div>
// 	);
// }
