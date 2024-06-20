"use client"
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Movements from "@/components/component/tabs/Movements";
import Cancellations from "@/components/component/tabs/Cancellation";
import CashRegister from "@/components/component/tabs/CashRegister";
import { checkIfCashRegisterExists } from "@/service/cashRegisterService";

export default function Page() {
	const [hasCashRegister, setHasCashRegister] = useState(false);
	const [selectedTab, setSelectedTab] = useState("cashRegister");

	useEffect(() => {
		const checkCashRegister = async () => {
			const cashRegisterExists = await checkIfCashRegisterExists();
			if (cashRegisterExists) {
				setHasCashRegister(true);
				setSelectedTab("movements");
			}
		};
		checkCashRegister();
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

	// TODO: Agregar un cargando mientras se verifica si existe la caja	
	return (
		<div className="w-full p-4">
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>
				<Tabs value={selectedTab} onValueChange={handleTabChange}>
					<TabsList className="border-b">
						<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
						<TabsTrigger value="movements" disabled={!hasCashRegister}>Movimientos de Caja</TabsTrigger>
					</TabsList>
					<TabsContent value="cashRegister" className="p-4">
						<CashRegister onCreated={onCashRegisterCreated} />
					</TabsContent>
					<TabsContent value="movements" className="p-4 flex gap-2">
						<Movements />
						<Cancellations />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}


// "use client"
// import Link from "next/link"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import Movements from "@/components/component/tabs/Movements";
// import Cancellations from "@/components/component/tabs/Cancellation";
// import CashRegister from "@/components/component/tabs/CashRegister";
// import { useState } from "react";

// // TODO: cuando se completen los datos iniciales redirigir a la página de movimientos y en cashRegister deshabilitar los campos
// export default function Page() {
// 	return (
// 		<div className="w-full p-4">
// 			<div className="flex flex-col gap-6">
// 				<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>
// 				<Tabs defaultValue="cashRegister">
// 					<TabsList className="border-b">
// 						<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
// 						<TabsTrigger value="movements">Movimientos de Caja</TabsTrigger>
// 					</TabsList>
// 					<TabsContent value="cashRegister" className="p-4">
// 						<CashRegister />
// 					</TabsContent>
// 					<TabsContent value="movements" className="p-4 flex gap-2">
// 						<Movements />
// 						<Cancellations />
// 					</TabsContent>
// 				</Tabs>
// 			</div>
// 		</div >
// 	)
// }

// ----------------------------------

// "use client"
// import Link from "next/link"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import Movements from "@/components/component/tabs/Movements";
// import Cancellations from "@/components/component/tabs/Cancellation";
// import CashRegister from "@/components/component/tabs/CashRegister";
// import { useState } from "react";

// // TODO: cuando se completen los datos iniciales redirigir a la página de movimientos y en cashRegister deshabilitar los campos
// export default function Page() {
// 	const [cashRegisterId, setCashRegisterId] = useState(null);

// 	const handleCreateCashRegister = () => {
// 		setCashRegisterId(true);
// 	};

// 	return (
// 		<div className="w-full p-4">
// 			<div className="flex flex-col gap-6">
// 				<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>
// 				<Tabs
// 					defaultValue="cashRegister"
// 					// redirigir a la página de movimientos cuando se cree la caja
// 					value={cashRegisterId ? "movements" : "cashRegister"}
// 				>
// 					<TabsList className="border-b">
// 						<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
// 						<TabsTrigger value="movements">Movimientos de Caja</TabsTrigger>
// 						{/* <TabsTrigger value="cancellations">Anulaciones</TabsTrigger> */}
// 					</TabsList>
// 					<TabsContent value="cashRegister" className="p-4">
// 						<CashRegister
// 							handleCreateCashRegister={handleCreateCashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="movements" className="p-4 flex gap-2">
// 						<Movements />
// 						<Cancellations />
// 					</TabsContent>
// 					{/* <TabsContent value="cancellations" className="p-4">
// 						<Cancellations />
// 					</TabsContent> */}
// 				</Tabs>
// 			</div>
// 		</div>
// 	)
// }
