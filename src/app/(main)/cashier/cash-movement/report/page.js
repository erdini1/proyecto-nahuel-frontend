// "use client";
// import { useEffect, useState } from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { getLastCashRegister, updateCashRegister } from "@/service/cashRegisterService";
// import { getCashMovements } from "@/service/cashMovementsService";
// import { getCancellations } from "@/service/cancellationService";
// import Spinner from '@/components/component/Spinner';
// import PaymentTypeCash from '@/components/component/cashRegisterForm/PaymentTypeCash';
// import PaymentTypeCheckingAccount from '@/components/component/cashRegisterForm/PaymentTypeCheckingAccount';
// import PaymentTypeCard from '@/components/component/cashRegisterForm/PaymentTypeCard';
// import PaymentTypeMercadoPago from '@/components/component/cashRegisterForm/PaymentTypeMercadoPago';
// import PaymentTypePointMaxiconsumo from '@/components/component/cashRegisterForm/PaymentTypePointMaxiconsumo';
// import { Button } from '@/components/ui/button';
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from '@/components/ui/label';
// import Link from 'next/link';
// import { getTerminals } from '@/service/terminalService';

// export default function Page() {
// 	const [cashRegister, setCashRegister] = useState(null);
// 	const [cashMovements, setCashMovements] = useState([]);
// 	const [cancellations, setCancellations] = useState([]);
// 	const [terminals, setTerminals] = useState([]);
// 	const [observations, setObservations] = useState('');
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [selectedTerminals, setSelectedTerminals] = useState({
// 		card: true,
// 		mercadoPago: true,
// 		pointMaxiconsumo: true,
// 		// checkingAccount: true,
// 	});

// 	const { toast } = useToast();

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				setIsLoading(true);
// 				const cashRegisterData = await getLastCashRegister();
// 				const cashMovementsData = await getCashMovements();
// 				const cancellationsData = await getCancellations();
// 				const terminals = await getTerminals(cashRegisterData.id);

// 				setCashRegister(cashRegisterData);
// 				setCashMovements(cashMovementsData);
// 				setCancellations(cancellationsData);
// 				// setTerminals(terminals);

// 				setSelectedTerminals({
// 					card: terminals.some(terminal => terminal.description.includes('CLOVER')),
// 					mercadoPago: terminals.some(terminal => terminal.description.includes('MERCADO PAGO')),
// 					pointMaxiconsumo: terminals.some(terminal => terminal.description.includes('MAXI')),
// 					// checkingAccount: terminals.some(terminal => terminal.method === 'CUENTA_CORRIENTE'),
// 				});

// 				console.log("terminals:", terminals);
// 				console.log("cash:", terminals.some(terminal => terminal.description === 'EFECTIVO'),
// 					"card:", terminals.some(terminal => terminal.description.includes('CLOVER')),
// 					"mercadoPago:", terminals.some(terminal => terminal.description.includes('MERCADO PAGO')),
// 					"pointMaxiconsumo:", terminals.some(terminal => terminal.description.includes('MAXI')))

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
// 	}, [toast]);

// 	const handleUpdateCashRegister = async (updatedData) => {
// 		try {
// 			await updateCashRegister(cashRegister.id, updatedData);
// 			toast({
// 				title: "Actualizado",
// 				description: "Los datos del registro de caja se actualizaron correctamente",
// 			});
// 		} catch (error) {
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Ocurrió un error al actualizar el registro de caja",
// 			});
// 		}
// 	};

// 	const handleSave = () => {
// 		handleUpdateCashRegister({
// 			observations,
// 			isClosed: true
// 		})
// 	};

// 	return (
// 		<div className='flex flex-col gap-6 p-4'>
// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Registro de Caja</CardTitle>
// 					<CardDescription>Rellena los campos a continuación para actualizar los datos de la caja.</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					{isLoading ? (
// 						<div className="flex justify-center items-center h-64">
// 							<Spinner />
// 						</div>
// 					) : (
// 						<div className='flex flex-col gap-6'>
// 							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-center'>
// 								<div className='flex-grow max-w-xs flex-shrink-0'>
// 									<PaymentTypeCash
// 										cashMovements={cashMovements}
// 										cancellations={cancellations}
// 										cashRegister={cashRegister}
// 										updateCashRegister={handleUpdateCashRegister}
// 									/>
// 								</div>
// 								{selectedTerminals.card && (
// 									<div className='flex-grow max-w-xs flex-shrink-0'>
// 										<PaymentTypeCard
// 											cashMovements={cashMovements}
// 											cancellations={cancellations}
// 											cashRegister={cashRegister}
// 											updateCashRegister={handleUpdateCashRegister}
// 										/>
// 									</div>
// 								)}
// 								{selectedTerminals.mercadoPago && (
// 									<div className='flex-grow max-w-xs flex-shrink-0'>
// 										<PaymentTypeMercadoPago
// 											cashMovements={cashMovements}
// 											cancellations={cancellations}
// 											cashRegister={cashRegister}
// 											updateCashRegister={handleUpdateCashRegister}
// 										/>
// 									</div>
// 								)}
// 								{selectedTerminals.pointMaxiconsumo && (
// 									<div className='flex-grow max-w-xs flex-shrink-0'>
// 										<PaymentTypePointMaxiconsumo
// 											cashMovements={cashMovements}
// 											cancellations={cancellations}
// 											cashRegister={cashRegister}
// 											updateCashRegister={handleUpdateCashRegister}
// 										/>
// 									</div>
// 								)}
// 								{/* {selectedTerminals.checkingAccount && ( */}
// 								<div className='flex-grow max-w-xs flex-shrink-0'>
// 									<PaymentTypeCheckingAccount
// 										cashMovements={cashMovements}
// 										cancellations={cancellations}
// 										cashRegister={cashRegister}
// 										updateCashRegister={handleUpdateCashRegister}
// 									/>
// 								</div>
// 								{/* )} */}
// 							</div>
// 							<div className='flex flex-col gap-2 items-center'>
// 								<div className="w-full max-w-md">
// 									<Label htmlFor="observations">Observaciones:</Label>
// 									<Textarea
// 										placeholder="Escribe tus observaciones..."
// 										id="observations"
// 										value={observations}
// 										onChange={(e) => setObservations(e.target.value)}
// 									/>
// 								</div>
// 								<Link href="/cashier" className='w-full max-w-xs'>
// 									<Button
// 										className='w-full'
// 										onClick={handleSave}
// 									>
// 										Cerrar Caja
// 									</Button>
// 								</Link>
// 							</div>
// 						</div>
// 					)}
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);

// }

// ------------

// "use client";
// import { useEffect, useState } from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { getLastCashRegister, updateCashRegister } from "@/service/cashRegisterService";
// import { getCashMovements } from "@/service/cashMovementsService";
// import { getCancellations } from "@/service/cancellationService";
// import Spinner from '@/components/component/Spinner';
// import PaymentTypeCash from '@/components/component/cashRegisterForm/PaymentTypeCash';
// import PaymentTypeCheckingAccount from '@/components/component/cashRegisterForm/PaymentTypeCheckingAccount';
// import PaymentTypeCard from '@/components/component/cashRegisterForm/PaymentTypeCard';
// import PaymentTypeMercadoPago from '@/components/component/cashRegisterForm/PaymentTypeMercadoPago';
// import PaymentTypePointMaxiconsumo from '@/components/component/cashRegisterForm/PaymentTypePointMaxiconsumo';
// import { Button } from '@/components/ui/button';
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from '@/components/ui/label';
// import Link from 'next/link';
// import { getTerminals } from '@/service/terminalService';

// export default function Page() {
// 	const [cashRegister, setCashRegister] = useState(null);
// 	const [cashMovements, setCashMovements] = useState([]);
// 	const [cancellations, setCancellations] = useState([]);
// 	const [terminals, setTerminals] = useState([]);
// 	const [observations, setObservations] = useState('');
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [selectedTerminals, setSelectedTerminals] = useState({
// 		card: true,
// 		mercadoPago: true,
// 		pointMaxiconsumo: true,
// 		// checkingAccount: true,
// 	});

// 	const { toast } = useToast();

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				setIsLoading(true);
// 				const cashRegisterData = await getLastCashRegister();
// 				const cashMovementsData = await getCashMovements();
// 				const cancellationsData = await getCancellations();
// 				const terminals = await getTerminals(cashRegisterData.id);

// 				setCashRegister(cashRegisterData);
// 				setCashMovements(cashMovementsData);
// 				setCancellations(cancellationsData);
// 				setTerminals(terminals);

// 				setSelectedTerminals({
// 					card: terminals.some(terminal => terminal.description.includes('CLOVER')),
// 					mercadoPago: terminals.some(terminal => terminal.description.includes('MERCADO PAGO')),
// 					pointMaxiconsumo: terminals.some(terminal => terminal.description.includes('MAXI')),
// 					// checkingAccount: terminals.some(terminal => terminal.method === 'CUENTA_CORRIENTE'),
// 				});
// 				console.log(selectedTerminals)

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
// 	}, [toast]);

// 	const handleUpdateCashRegister = async (updatedData) => {
// 		try {
// 			await updateCashRegister(cashRegister.id, updatedData);
// 			toast({
// 				title: "Actualizado",
// 				description: "Los datos del registro de caja se actualizaron correctamente",
// 			});
// 		} catch (error) {
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Ocurrió un error al actualizar el registro de caja",
// 			});
// 		}
// 	};

// 	const handleSave = () => {
// 		handleUpdateCashRegister({
// 			observations,
// 			isClosed: true
// 		})
// 	};

// 	return (
// 		<div>
// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Registro de Caja</CardTitle>
// 					<CardDescription>Rellena los campos a continuación para actualizar los datos de la caja.</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					{isLoading ? (
// 						<div className="flex justify-center items-center h-64">
// 							<Spinner />
// 						</div>
// 					) : (
// 						<div className='flex flex-col gap-6'>
// 							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 my-8 justify-center divide-x-2'>
// 								<div className='flex-grow max-w-xs flex-shrink-0'>
// 									<PaymentTypeCash
// 										cashMovements={cashMovements}
// 										cancellations={cancellations}
// 										cashRegister={cashRegister}
// 										updateCashRegister={handleUpdateCashRegister}
// 									/>
// 								</div>
// 								<div className={`flex-grow max-w-xs flex-shrink-0 ${selectedTerminals.card ? "" : "opacity-50 pointer-events-none"}`}>
// 									<PaymentTypeCard
// 										cashMovements={cashMovements}
// 										cancellations={cancellations}
// 										cashRegister={cashRegister}
// 										updateCashRegister={handleUpdateCashRegister}

// 									/>
// 								</div>
// 								<div className={`flex-grow max-w-xs flex-shrink-0 ${selectedTerminals.mercadoPago ? "" : "opacity-50 pointer-events-none"}`}>
// 									<PaymentTypeMercadoPago
// 										cashMovements={cashMovements}
// 										cancellations={cancellations}
// 										cashRegister={cashRegister}
// 										updateCashRegister={handleUpdateCashRegister}
// 									/>
// 								</div>
// 								<div className={`flex-grow max-w-xs flex-shrink-0 ${selectedTerminals.pointMaxiconsumo ? "" : "opacity-50 pointer-events-none"}`}>
// 									<PaymentTypePointMaxiconsumo
// 										cashMovements={cashMovements}
// 										cancellations={cancellations}
// 										cashRegister={cashRegister}
// 										updateCashRegister={handleUpdateCashRegister}
// 									/>
// 								</div>
// 								<div className='flex-grow max-w-xs flex-shrink-0'>
// 									<PaymentTypeCheckingAccount
// 										cashMovements={cashMovements}
// 										cancellations={cancellations}
// 										cashRegister={cashRegister}
// 										updateCashRegister={handleUpdateCashRegister}
// 									/>
// 								</div>
// 							</div>
// 							<div className='flex flex-col gap-4 items-center'>
// 								<div className="w-full max-w-lg">
// 									<Label htmlFor="observations">Observaciones:</Label>
// 									<Textarea
// 										placeholder="Escribe tus observaciones..."
// 										id="observations"
// 										value={observations}
// 										onChange={(e) => setObservations(e.target.value)}
// 									/>
// 								</div>
// 								<Link href="/cashier" className='w-full max-w-md'>
// 									<Button
// 										className='w-full'
// 										onClick={handleSave}
// 									>
// 										Cerrar Caja
// 									</Button>
// 								</Link>
// 							</div>
// 						</div>
// 					)}
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }

"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getLastCashRegister, updateCashRegister } from "@/service/cashRegisterService";
import { getCashMovements } from "@/service/cashMovementsService";
import { getCancellations } from "@/service/cancellationService";
import Spinner from '@/components/component/Spinner';
import PaymentTypeCash from '@/components/component/cashRegisterForm/PaymentTypeCash';
import PaymentTypeCheckingAccount from '@/components/component/cashRegisterForm/PaymentTypeCheckingAccount';
import PaymentTypeCard from '@/components/component/cashRegisterForm/PaymentTypeCard';
import PaymentTypeMercadoPago from '@/components/component/cashRegisterForm/PaymentTypeMercadoPago';
import PaymentTypePointMaxiconsumo from '@/components/component/cashRegisterForm/PaymentTypePointMaxiconsumo';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { getTerminals } from '@/service/terminalService';

export default function Page() {
	const [cashRegister, setCashRegister] = useState(null);
	const [cashMovements, setCashMovements] = useState([]);
	const [cancellations, setCancellations] = useState([]);
	const [terminals, setTerminals] = useState([]);
	const [observations, setObservations] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTerminals, setSelectedTerminals] = useState({
		card: true,
		mercadoPago: true,
		pointMaxiconsumo: true,
		// checkingAccount: true,
	});

	const { toast } = useToast();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const cashRegisterData = await getLastCashRegister();
				const cashMovementsData = await getCashMovements();
				const cancellationsData = await getCancellations();
				const terminals = await getTerminals(cashRegisterData.id);

				setCashRegister(cashRegisterData);
				setCashMovements(cashMovementsData);
				setCancellations(cancellationsData);
				setTerminals(terminals);

				setSelectedTerminals({
					card: terminals.some(terminal => terminal.description.includes('CLOVER')),
					mercadoPago: terminals.some(terminal => terminal.description.includes('MERCADO PAGO')),
					pointMaxiconsumo: terminals.some(terminal => terminal.description.includes('MAXI')),
					// checkingAccount: terminals.some(terminal => terminal.method === 'CUENTA_CORRIENTE'),
				});
				console.log(selectedTerminals)

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

	const handleUpdateCashRegister = async (updatedData) => {
		try {
			await updateCashRegister(cashRegister.id, updatedData);
			toast({
				title: "Actualizado",
				description: "Los datos del registro de caja se actualizaron correctamente",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al actualizar el registro de caja",
			});
		}
	};

	const handleSave = () => {
		handleUpdateCashRegister({
			observations,
			isClosed: true
		})
	};

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Registro de Caja</CardTitle>
					<CardDescription>Rellena los campos a continuación para actualizar los datos de la caja.</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<div className='flex flex-col gap-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 my-8 justify-center divide-x-2'>
								<div className='flex-grow max-w-xs flex-shrink-0 mb-4'>
									<PaymentTypeCash
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
								<div className={`flex-grow max-w-xs flex-shrink-0 mb-4 ${selectedTerminals.card ? "" : "opacity-50 pointer-events-none"}`}>
									<PaymentTypeCard
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}

									/>
								</div>
								<div className={`flex-grow max-w-xs flex-shrink-0 mb-4 ${selectedTerminals.mercadoPago ? "" : "opacity-50 pointer-events-none"}`}>
									<PaymentTypeMercadoPago
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
								<div className={`flex-grow max-w-xs flex-shrink-0 mb-4 ${selectedTerminals.pointMaxiconsumo ? "" : "opacity-50 pointer-events-none"}`}>
									<PaymentTypePointMaxiconsumo
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
								<div className='flex-grow max-w-xs flex-shrink-0 mb-4'>
									<PaymentTypeCheckingAccount
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
							</div>
							<div className='flex flex-col gap-4 items-center'>
								<div className="w-full max-w-lg">
									<Label htmlFor="observations">Observaciones:</Label>
									<Textarea
										placeholder="Escribe tus observaciones..."
										id="observations"
										value={observations}
										onChange={(e) => setObservations(e.target.value)}
									/>
								</div>
								<Link href="/cashier" className='w-full max-w-md'>
									<Button
										className='w-full'
										onClick={handleSave}
									>
										Cerrar Caja
									</Button>
								</Link>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
