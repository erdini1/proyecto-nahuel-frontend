"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PaymentTypeCash from "@/components/component/tabsCashRegisterForm/PaymentTypeCash";
import { useToast } from "@/components/ui/use-toast";
import { getLastCashRegister, updateCashRegister } from "@/service/cashRegisterService";
import { getCashMovements } from "@/service/cashMovementsService";
import { getCancellations } from "@/service/cancellationService";
import PaymentTypeCheckingAccount from '@/components/component/tabsCashRegisterForm/PaymentTypeCheckingAccount';
import Spinner from '@/components/component/Spinner';
import PaymentTypeCard from '@/components/component/tabsCashRegisterForm/PaymentTypeCard';

export default function Page() {
	const [currentTab, setCurrentTab] = useState("efectivo");
	const [cashRegister, setCashRegister] = useState(null);
	const [cashMovements, setCashMovements] = useState([]);
	const [cancellations, setCancellations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { toast } = useToast();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const cashRegisterData = await getLastCashRegister();
				const cashMovementsData = await getCashMovements();
				const cancellationsData = await getCancellations();
				setCashRegister(cashRegisterData);
				setCashMovements(cashMovementsData);
				setCancellations(cancellationsData);
			} catch (error) {
				console.error("Error al obtener los datos", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al obtener los datos",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [toast]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const lastTab = localStorage.getItem("lastOpenedTab") || "efectivo";
			setCurrentTab(lastTab);
		}
	}, []);

	const handleTabChange = (tab) => {
		setCurrentTab(tab);
		if (typeof window !== 'undefined') {
			localStorage.setItem("lastOpenedTab", tab);
		}
	};

	const handleUpdateCashRegister = async (updatedData) => {
		try {
			console.log("Actualización del registro de efectivo:", cashRegister.id, updatedData);
			await updateCashRegister(cashRegister.id, updatedData);
			toast({
				variant: "success",
				title: "Actualizado",
				description: "Los datos del registro de caja se actualizaron correctamente",
			});
		} catch (error) {
			console.error("Error al actualizar el registro de caja", error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al actualizar el registro de caja",
			});
		}
	};

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Registro de Caja</CardTitle>
					<CardDescription>Rellena los campos a continuación para actualizar el registro de caja.</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<Tabs value={currentTab} onValueChange={handleTabChange}>
							<TabsList>
								<TabsTrigger value="efectivo">Efectivo</TabsTrigger>
								<TabsTrigger value="ctaCorriente">Cuenta Corriente</TabsTrigger>
								<TabsTrigger value="tarjeta">Cuenta Corriente</TabsTrigger>
							</TabsList>
							<TabsContent value="efectivo">
								<PaymentTypeCash
									cashMovements={cashMovements}
									cancellations={cancellations}
									cashRegister={cashRegister}
									updateCashRegister={handleUpdateCashRegister}
									onNextTab={() => handleTabChange("ctaCorriente")}
								/>
							</TabsContent>
							<TabsContent value="ctaCorriente">
								<PaymentTypeCheckingAccount
									cashMovements={cashMovements}
									cancellations={cancellations}
									cashRegister={cashRegister}
									updateCashRegister={handleUpdateCashRegister}
								/>
							</TabsContent>
							<TabsContent value="tarjeta">
								<PaymentTypeCard
									cashMovements={cashMovements}
									cancellations={cancellations}
									cashRegister={cashRegister}
									updateCashRegister={handleUpdateCashRegister}
								/>
							</TabsContent>
						</Tabs>
					)}
				</CardContent>
			</Card>
		</div>
	);
}



// "use client"
// import { useEffect, useState } from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import PaymentTypeCash from "@/components/component/tabsCashRegisterForm/PaymentTypeCash";
// import { useToast } from "@/components/ui/use-toast"

// import { getLastCashRegister, updateCashRegister } from "@/service/cashRegisterService";
// import { getCashMovements } from "@/service/cashMovementsService";
// import { getCancellations } from "@/service/cancellationService";
// import PaymentTypeCheckingAccount from '@/components/component/tabsCashRegisterForm/PaymentTypeCheckingAccount';

// export default function Page() {
// 	const [currentTab, setCurrentTab] = useState("efectivo");
// 	const [cashRegister, setCashRegister] = useState(null);
// 	const [cashMovements, setCashMovements] = useState([]);
// 	const [cancellations, setCancellations] = useState([]);
// 	const [isLoading, setIsLoading] = useState(true);

// 	const { toast } = useToast();

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				setIsLoading(true);
// 				const cashRegisterData = await getLastCashRegister();
// 				const cashMovementsData = await getCashMovements();
// 				const cancellationsData = await getCancellations();
// 				setCashRegister(cashRegisterData);
// 				setCashMovements(cashMovementsData);
// 				setCancellations(cancellationsData);
// 			} catch (error) {
// 				console.error("Error al obtener los datos", error);
// 				toast({
// 					variant: "destructive",
// 					title: "Error",
// 					description: "Ocurrió un error al obtener los datos",
// 				});
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};
// 		fetchData();
// 	}, []);

// 	const handleUpdateCashRegister = async (newData) => {
// 		try {
// 			console.log("Actualización del registro de efectivo:", cashRegister.id, newData);
// 			await updateCashRegister(cashRegister.id, newData);
// 		} catch (error) {
// 			console.error("Error al actualizar el registro de efectivo", error);
// 		}
// 	};

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
// 				<Tabs value={currentTab} onValueChange={setCurrentTab}>
// 					<div className="flex justify-between">
// 						<div>
// 							<TabsList>
// 								<TabsTrigger value="efectivo">Efectivo</TabsTrigger>
// 								<TabsTrigger value="cuentaCorriente">Cta. Corriente</TabsTrigger>
// 								<TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
// 								<TabsTrigger value="mercadoPago">Mercado Pago</TabsTrigger>
// 								<TabsTrigger value="pointMaxiconsumo">Point Maxiconsumo</TabsTrigger>
// 								<TabsTrigger value="resumen">Resumen</TabsTrigger>
// 							</TabsList>
// 						</div>
// 					</div>
// 					<TabsContent value="efectivo">
// 						<PaymentTypeCash
// 							cashMovements={cashMovements}
// 							cancellations={cancellations}
// 							cashRegister={cashRegister}
// 							updateCashRegister={handleUpdateCashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="cuentaCorriente">
// 						<PaymentTypeCheckingAccount
// 							cashMovements={cashMovements}
// 							cancellations={cancellations}
// 							cashRegister={cashRegister}
// 							updateCashRegister={handleUpdateCashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="tarjetas">
// 					</TabsContent>
// 					<TabsContent value="mercadoPago">
// 					</TabsContent>
// 					<TabsContent value="pointMaxiconsumo">
// 					</TabsContent>
// 					<TabsContent value="resumen">
// 						<div>Resumen de todas las gestiones de cobro</div>
// 					</TabsContent>
// 				</Tabs>
// 			</CardContent>
// 		</Card>
// 	);
// }
// -------------------

// "use client";
// import { useEffect, useState } from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import PaymentTypeCash from "@/components/component/tabsCashRegisterForm/PaymentTypeCash";
// import PaymentTypeCard from "@/components/component/tabsCashRegisterForm/PaymentTypeCard";
// import PaymentTypeChekingAccount from "@/components/component/tabsCashRegisterForm/PaymentTypeChekingAccount";
// import PaymentTypeMercadoPago from "@/components/component/tabsCashRegisterForm/PaymentTypeMercadoPago";
// import PaymentTypePointMaxiconsumo from "@/components/component/tabsCashRegisterForm/PaymentTypePointMaxiconsumo";

// import { getLastCashRegister, updateCashRegister } from "@/service/cashRegisterService";
// import { getCashMovements } from "@/service/cashMovementsService";
// import { getCancellations } from "@/service/cancellationService";

// export default function Page() {
// 	const [currentTab, setCurrentTab] = useState("efectivo");
// 	const [cashRegister, setCashRegister] = useState(null);
// 	const [cashMovements, setCashMovements] = useState([]);
// 	const [cancellations, setCancellations] = useState([]);
// 	const [formData, setFormData] = useState({
// 		cash: { sales: 0, incomes: 0, withdrawals: 0, toRender: 0, diff: 0 },
// 		checkingAccount: { sales: 0, toRender: 0, diff: 0 },
// 		cards: { sales: 0, withdrawals: 0, toRender: 0, diff: 0 },
// 		mercadoPago: { sales: 0, withdrawals: 0, toRender: 0, diff: 0 },
// 		pointMaxiconsumo: { sales: 0, withdrawals: 0, toRender: 0, diff: 0 },
// 	});

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			const cashRegisterData = await getLastCashRegister();
// 			const cashMovementsData = await getCashMovements();
// 			const cancellationsData = await getCancellations();
// 			setCashRegister(cashRegisterData);
// 			setCashMovements(cashMovementsData);
// 			setCancellations(cancellationsData);
// 		};
// 		fetchData();
// 	}, []);

// 	const handleInputChange = (paymentType, detail, value) => {
// 		setFormData(prevData => ({
// 			...prevData,
// 			[paymentType]: {
// 				...prevData[paymentType],
// 				[detail]: value,
// 			},
// 		}));
// 	};

// 	const handleSave = async () => {
// 		const cashRegisterData = {
// 			totalCashInSystem: parseFloat(formData.cash.sales || 0) + parseFloat(formData.cash.incomes || 0) - parseFloat(formData.cash.withdrawals || 0),
// 			salesWithCash: parseFloat(formData.cash.sales || 0),
// 		};

// 		try {
// 			await updateCashRegister(cashRegister.id, cashRegisterData);
// 			console.log("Cash register updated successfully");
// 		} catch (error) {
// 			console.error("Failed to update cash register", error);
// 		}

// 		const tabOrder = ["efectivo", "cuentaCorriente", "tarjetas", "mercadoPago", "pointMaxiconsumo", "resumen"];
// 		const nextTab = tabOrder[(tabOrder.indexOf(currentTab) + 1) % tabOrder.length];
// 		setCurrentTab(nextTab);
// 	};

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
// 				<Tabs value={currentTab} onValueChange={setCurrentTab}>
// 					<div className="flex justify-between">
// 						<div>
// 							<TabsList>
// 								<TabsTrigger value="efectivo">Efectivo</TabsTrigger>
// 								<TabsTrigger value="cuentaCorriente">Cta. Corriente</TabsTrigger>
// 								<TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
// 								<TabsTrigger value="mercadoPago">Mercado Pago</TabsTrigger>
// 								<TabsTrigger value="pointMaxiconsumo">Point Maxiconsumo</TabsTrigger>
// 								<TabsTrigger value="resumen">Resumen</TabsTrigger>
// 							</TabsList>
// 						</div>
// 					</div>
// 					<TabsContent value="efectivo">
// 						<PaymentTypeCash
// 							name="Efectivo"
// 							description=""
// 							details={["Ventas", "Ingresos", "Retiros", "A rendir"]}
// 							data={formData.cash}
// 							onChange={handleInputChange}
// 							onSave={handleSave}
// 							cashMovements={cashMovements}
// 							cancellations={cancellations}
// 							cashRegister={cashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="cuentaCorriente">
// 						<PaymentTypeChekingAccount
// 							name="Cuenta Corriente"
// 							description=""
// 							details={["Ventas", "A rendir"]}
// 							data={formData.checkingAccount}
// 							onChange={handleInputChange}
// 							onSave={handleSave}
// 							cashMovements={cashMovements}
// 							cancellations={cancellations}
// 							cashRegister={cashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="tarjetas">
// 						<PaymentTypeCard
// 							name="tarjetas"
// 							description="Clover / QR - TDF - La red"
// 							details={["Ventas", "Retiros", "A rendir"]}
// 							data={formData.cards}
// 							onChange={handleInputChange}
// 							onSave={handleSave}
// 							cashMovements={cashMovements}
// 							cancellations={cancellations}
// 							cashRegister={cashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="mercadoPago">
// 						<PaymentTypeMercadoPago
// 							name="mercado pago"
// 							description="QR - Link - Tarjeta debito y credito"
// 							details={["Ventas", "Retiros", "A rendir"]}
// 							data={formData.mercadoPago}
// 							onChange={handleInputChange}
// 							onSave={handleSave}
// 							cashMovements={cashMovements}
// 							cancellations={cancellations}
// 							cashRegister={cashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="pointMaxiconsumo">
// 						<PaymentTypePointMaxiconsumo
// 							name="point maxiconsumo"
// 							description="Tarjeta debito y credito"
// 							details={["Ventas", "Retiros", "A rendir"]}
// 							data={formData.pointMaxiconsumo}
// 							onChange={handleInputChange}
// 							onSave={handleSave}
// 							cashMovements={cashMovements}
// 							cancellations={cancellations}
// 							cashRegister={cashRegister}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="resumen">
// 						<div>Resumen de todas las gestiones de cobro</div>
// 						{/* Agregar contenido del resumen aquí */}
// 					</TabsContent>
// 				</Tabs>
// 			</CardContent>
// 		</Card>
// 	);
// }
