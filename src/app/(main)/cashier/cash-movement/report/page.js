"use client"
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PaymentType from "@/components/component/tabsCashRegisterForm/PaymentType";
import { getLastCashRegister, updateCashRegister } from "@/service/cashRegisterService";

// TODO: Terminar de ver cash-movement/report, paymentType
export default function Page() {
	const [currentTab, setCurrentTab] = useState("efectivo");
	const [cashRegister, setCashRegister] = useState(null);
	const [formData, setFormData] = useState({
		cash: { sales: 0, incomes: 0, withdrawals: 0, toRender: 0 },
		checkingAccount: { sales: 0, withdrawals: 0, toRender: 0 },
		cards: { sales: 0, withdrawals: 0, toRender: 0 },
		mercadoPago: { sales: 0, withdrawals: 0, toRender: 0 },
		pointMaxiconsumo: { sales: 0, withdrawals: 0, toRender: 0 },
	});

	useEffect(() => {
		const fetchData = async () => {
			const cashRegisterData = await getLastCashRegister();
			setCashRegister(cashRegisterData);
		};
		fetchData();
	}, []);

	const handleInputChange = (paymentType, detail, value) => {
		setFormData(prevData => ({
			...prevData,
			[paymentType]: {
				...prevData[paymentType],
				[detail]: value,
			},
		}));
	};

	const handleSave = async () => {
		const cashRegisterData = {
			totalCashInSystem: parseFloat(formData.efectivo.sales || 0) + parseFloat(formData.efectivo.incomes || 0) - parseFloat(formData.efectivo.withdrawals || 0),
			salesWithCash: parseFloat(formData.efectivo.sales || 0),
		};

		try {
			await updateCashRegister(cashRegister.id, cashRegisterData);
			console.log("Cash register updated successfully");
		} catch (error) {
			console.error("Failed to update cash register", error);
		}

		// Cambiar a la siguiente pestaña
		const tabOrder = ["efectivo", "cuentaCorriente", "tarjetas", "mercadoPago", "pointMaxiconsumo", "resumen"];
		const nextTab = tabOrder[(tabOrder.indexOf(currentTab) + 1) % tabOrder.length];
		setCurrentTab(nextTab);
	};

	return (
		<Card className="w-full max-w-5xl mx-auto mt-4">
			<CardHeader>
				<div className="flex justify-between">
					<div>
						<CardTitle>Gestión de Caja</CardTitle>
						<CardDescription>Complete los detalles de los diferentes tipos de cobros.</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Tabs value={currentTab} onValueChange={setCurrentTab}>
					<div className="flex justify-between">
						<div>
							<TabsList className="border-b">
								<TabsTrigger value="efectivo">Efectivo</TabsTrigger>
								<TabsTrigger value="cuentaCorriente">Cuenta Corriente</TabsTrigger>
								<TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
								<TabsTrigger value="mercadoPago">Mercado Pago</TabsTrigger>
								<TabsTrigger value="pointMaxiconsumo">Point Maxiconsumo</TabsTrigger>
								<TabsTrigger value="resumen">Resumen</TabsTrigger>
							</TabsList>
						</div>
					</div>
					<TabsContent value="efectivo" className="p-4">
						<PaymentType
							name="efectivo"
							description=""
							details={["Ventas", "Ingresos", "Retiros", "A rendir"]}
							data={formData.cash}
							onChange={handleInputChange}
							onSave={handleSave}
						/>
					</TabsContent>
					<TabsContent value="cuentaCorriente" className="p-4">
						<PaymentType
							name="cuenta Corriente"
							description=""
							details={["Ventas", "Retiros", "A rendir"]}
							data={formData.checkingAccount}
							onChange={handleInputChange}
							onSave={handleSave}
						/>
					</TabsContent>
					<TabsContent value="tarjetas" className="p-4">
						<PaymentType
							name="tarjetas"
							description="Clover / QR - TDF - La red"
							details={["Ventas", "Retiros", "A rendir"]}
							data={formData.cards}
							onChange={handleInputChange}
							onSave={handleSave}
						/>
					</TabsContent>
					<TabsContent value="mercadoPago" className="p-4">
						<PaymentType
							name="mercadoPago"
							description="QR - Link - Tarjeta debito y credito"
							details={["Ventas", "Retiros", "A rendir"]}
							data={formData.mercadoPago}
							onChange={handleInputChange}
							onSave={handleSave}
						/>
					</TabsContent>
					<TabsContent value="pointMaxiconsumo" className="p-4">
						<PaymentType
							name="pointMaxiconsumo"
							description="Tarjeta debito y credito"
							details={["Ventas", "Retiros", "A rendir"]}
							data={formData.pointMaxiconsumo}
							onChange={handleInputChange}
							onSave={handleSave}
						/>
					</TabsContent>
					<TabsContent value="resumen" className="p-4">
						<h1>Resumen</h1>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

// --------------------------------

// "use client"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import PaymentType from "@/components/component/tabsCashRegisterForm/PaymentType";

// export default function Page() {
// 	return (
// 		<Card className="w-full max-w-5xl mx-auto mt-4">
// 			<CardHeader>
// 				<div className="flex justify-between">
// 					<div>
// 						<CardTitle>Gestión de Caja</CardTitle>
// 						<CardDescription>Complete los detalles de los diferentes tipos de cobros.</CardDescription>
// 					</div>
// 				</div>
// 			</CardHeader>
// 			<CardContent>

// 				<Tabs defaultValue="efectivo">
// 					<div className="flex justify-between">
// 						<div>
// 							<TabsList className="border-b">
// 								<TabsTrigger value="efectivo">Efectivo</TabsTrigger>
// 								<TabsTrigger value="cuentaCorriente">Cuenta Corriente</TabsTrigger>
// 								<TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
// 								<TabsTrigger value="mercadoPago">Mercado Pago</TabsTrigger>
// 								<TabsTrigger value="pointMaxiconsumo">Point Maxiconsumo</TabsTrigger>
// 								<TabsTrigger value="resumen">Resumen</TabsTrigger>
// 							</TabsList>
// 						</div>
// 					</div>
// 					<TabsContent value="efectivo" className="p-4">
// 						<PaymentType
// 							name="efectivo"
// 							description=""
// 							details={["Ventas", "Ingresos", "Retiros", "A rendir"]}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="cuentaCorriente" className="p-4">
// 						<PaymentType
// 							name="cuenta corriente"
// 							description=""
// 							details={["Ventas", "Retiros", "A rendir"]}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="tarjetas" className="p-4">
// 						<PaymentType
// 							name="tarjetas"
// 							description="Clover / QR - TDF - La red"
// 							details={["Ventas", "Retiros", "A rendir"]}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="mercadoPago" className="p-4">
// 						<PaymentType
// 							name="mercado pago"
// 							description="QR - Link - Tarjeta debito y credito"
// 							details={["Ventas", "Retiros", "A rendir"]}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="pointMaxiconsumo" className="p-4">
// 						<PaymentType
// 							name="point maxiconsumo"
// 							description="Tarjeta debito y credito"
// 							details={["Ventas", "Retiros", "A rendir"]}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="resumen" className="p-4">
// 						<h1>Resumen</h1>
// 					</TabsContent>
// 				</Tabs>
// 			</CardContent>
// 		</Card>
// 	);
// }