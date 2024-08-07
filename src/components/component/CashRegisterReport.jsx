import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { updateCashRegister } from "@/service/cashRegisterService";
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

export default function CashRegisterReport({ cashRegister, cashMovements, cancellations, terminals }) {
	const [observations, setObservations] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTerminals, setSelectedTerminals] = useState({
		cash: true,
		card: true,
		mercadoPago: true,
		pointMaxiconsumo: true,
		checkingAccount: true,
	});

	const { toast } = useToast();

	useEffect(() => {
		setIsLoading(true);
		if (cashRegister) {
			setSelectedTerminals({
				cash: true,
				card: terminals.some(terminal => terminal.description.includes('CLOVER')),
				mercadoPago: terminals.some(terminal => terminal.description.includes('MERCADO PAGO')),
				pointMaxiconsumo: terminals.some(terminal => terminal.description.includes('MAXI')),
				checkingAccount: cashRegister.CashBox.hasCheckingAccount,
			});
		}
		setIsLoading(false);
	}, [cashRegister]);

	const handleUpdateCashRegister = async (updatedData) => {
		try {
			await updateCashRegister(cashRegister.id, updatedData);
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
		toast({
			title: "Actualizado",
			description: "Los datos del registro de caja se actualizaron correctamente",
		});
	};

	const lengthPaymentMethods = () => {
		const paymentMethods = [
			selectedTerminals.cash,
			selectedTerminals.card,
			selectedTerminals.mercadoPago,
			selectedTerminals.pointMaxiconsumo,
			selectedTerminals.checkingAccount
		];
		return paymentMethods.reduce((acc, value) => value ? acc + 1 : acc, 0);
	}

	return (
		<Card className="bg-white w-full">
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
						<div className={`mt-6 justify-center divide-x-2 ${lengthPaymentMethods() >= 4 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "flex flex-wrap"}`}>
							<div className={`flex-grow ${lengthPaymentMethods() < 4 ? "max-w-md" : "max-w-xs"} flex-shrink-0 mb-4`}>
								<PaymentTypeCash
									cashMovements={cashMovements}
									cancellations={cancellations}
									cashRegister={cashRegister}
									updateCashRegister={handleUpdateCashRegister}
								/>
							</div>
							{selectedTerminals.card && (
								<div className={`flex-grow ${lengthPaymentMethods() < 4 ? "max-w-md" : "max-w-xs"} flex-shrink-0 mb-4`}>
									<PaymentTypeCard
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
							)}
							{selectedTerminals.mercadoPago && (
								<div className={`flex-grow ${lengthPaymentMethods() < 4 ? "max-w-md" : "max-w-xs"} flex-shrink-0 mb-4`}>
									<PaymentTypeMercadoPago
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
							)}
							{selectedTerminals.pointMaxiconsumo && (
								<div className={`flex-grow ${lengthPaymentMethods() < 4 ? "max-w-md" : "max-w-xs"} flex-shrink-0 mb-4`}>
									<PaymentTypePointMaxiconsumo
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
							)}
							{selectedTerminals.checkingAccount && (
								<div className={`flex-grow ${lengthPaymentMethods() < 4 ? "max-w-md" : "max-w-xs"} flex-shrink-0 mb-4`}>
									<PaymentTypeCheckingAccount
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
									/>
								</div>
							)}
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
	);
}