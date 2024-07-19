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

export default function Page() {
	const [cashRegister, setCashRegister] = useState(null);
	const [cashMovements, setCashMovements] = useState([]);
	const [cancellations, setCancellations] = useState([]);
	const [observations, setObservations] = useState('');
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
							<div className='flex justify-center'>
								<div className='w-1/5 h-full border-r-2'>
									<PaymentTypeCash
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
								<div className='w-1/5 border-r-2'>
									<PaymentTypeCard
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
								<div className='w-1/5 border-r-2'>
									<PaymentTypeMercadoPago
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
								<div className='w-1/5 border-r-2'>
									<PaymentTypePointMaxiconsumo
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
								<div className='w-1/5 '>
									<PaymentTypeCheckingAccount
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
							</div>
							<div className='flex gap-2 items-center'>
								<div className=" mx-auto w-1/2 gap-3 ">
									<Label htmlFor="observations">Observaciones:</Label>
									<Textarea
										placeholder="Escribe tus observaciones..."
										id="observations"
										value={observations}
										onChange={(e) => setObservations(e.target.value)}
									/>
								</div>
								<Link href="/cashier" className='w-1/4 mx-auto'>
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
