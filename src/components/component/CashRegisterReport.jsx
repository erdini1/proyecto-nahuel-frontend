import { useEffect, useState } from 'react'
import { useRef } from 'react';
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

export default function CashRegisterReport({ cashRegister, setCashRegister, cashMovements, cancellations, terminals }) {
	const cashRef = useRef();
	const cardRef = useRef();
	const mercadoPagoRef = useRef();
	const pointMaxiconsumoRef = useRef();
	const checkingAccountRef = useRef();

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
			const { cash, cards, mercadoPago, pointMaxiconsumo, credit, observations, isClosed } = updatedData;
			await updateCashRegister(cashRegister.id, {
				salesWithCash: cash.salesWithCash,
				cashToRenderWithCash: cash.cashToRenderWithCash,
				salesWithCards: cards.salesWithCards,
				cashToRenderWithCards: cards.cashToRenderWithCards,
				salesWithMercadoPago: mercadoPago.salesWithMercadoPago,
				cashToRenderWithMercadoPago: mercadoPago.cashToRenderWithMercadoPago,
				salesWithPointMaxiconsumo: pointMaxiconsumo.salesWithPointMaxiconsumo,
				cashToRenderWithPointMaxiconsumo: pointMaxiconsumo.cashToRenderWithPointMaxiconsumo,
				batchNumber: pointMaxiconsumo.batchNumber,
				salesWithCredit: credit.salesWithCredit,
				cashToRenderWithCredit: credit.cashToRenderWithCredit,
				observations,
				isClosed
			});

			setCashRegister({
				...cashRegister,
				salesWithCash: cash.salesWithCash,
				cashToRenderWithCash: cash.cashToRenderWithCash,
				salesWithCards: cards.salesWithCards,
				cashToRenderWithCards: cards.cashToRenderWithCards,
				salesWithMercadoPago: mercadoPago.salesWithMercadoPago,
				cashToRenderWithMercadoPago: mercadoPago.cashToRenderWithMercadoPago,
				salesWithPointMaxiconsumo: pointMaxiconsumo.salesWithPointMaxiconsumo,
				cashToRenderWithPointMaxiconsumo: pointMaxiconsumo.cashToRenderWithPointMaxiconsumo,
				batchNumber: pointMaxiconsumo.batchNumber,
				salesWithCredit: credit.salesWithCredit,
				cashToRenderWithCredit: credit.cashToRenderWithCredit,
				observations,
				isClosed
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al actualizar el registro de caja",
			});
		}
	};

	const handleSave = async (isClosed) => {
		const formData = {
			cash: cashRef.current?.getData(),
			cards: cardRef.current?.getData(),
			mercadoPago: mercadoPagoRef.current?.getData(),
			pointMaxiconsumo: pointMaxiconsumoRef.current?.getData(),
			credit: checkingAccountRef.current?.getData(),
		};

		if (isClosed) {
			formData.observations = observations;
			formData.isClosed = true;
		}

		handleUpdateCashRegister(formData);

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
		<Card className="bg-slate-100/70 backdrop-blur-lg">
			<CardHeader>
				<div className='flex justify-between'>
					<div>
						<CardTitle>Registro de Caja</CardTitle>
						<CardDescription>Rellena los campos a continuación para actualizar los datos de la caja.</CardDescription>
					</div>
					<div className='w-1/6'>
						<Button
							variant="outline"
							className="w-full shadow ring-2 ring-offset-1 ring-gray-400"
							onClick={() => handleSave(false)}
						>
							Guardar
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Spinner />
					</div>
				) : (
					<div className='flex flex-col gap-6'>
						<div className={`mt-3 justify-center divide-x-2 ${lengthPaymentMethods() >= 4 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "flex flex-wrap"}`}>
							<div className={`flex-grow ${lengthPaymentMethods() < 4 ? "max-w-md" : "max-w-xs"} flex-shrink-0 mb-4`}>
								<PaymentTypeCash
									cashMovements={cashMovements}
									cancellations={cancellations}
									cashRegister={cashRegister}
									updateCashRegister={handleUpdateCashRegister}
									ref={cashRef}
								/>
							</div>
							{selectedTerminals.card && (
								<div className={`flex-grow ${lengthPaymentMethods() < 4 ? "max-w-md" : "max-w-xs"} flex-shrink-0 mb-4`}>
									<PaymentTypeCard
										cashMovements={cashMovements}
										cancellations={cancellations}
										cashRegister={cashRegister}
										updateCashRegister={handleUpdateCashRegister}
										ref={cardRef}
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
										ref={mercadoPagoRef}
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
										ref={pointMaxiconsumoRef}
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
										ref={checkingAccountRef}
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
									className="border shadow ring-2 ring-offset-1 ring-gray-400 p-2"
								/>
							</div>
							<Link href="/cashier" className='w-full max-w-md'>
								<Button
									className='w-full'
									onClick={() => handleSave(true)}
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