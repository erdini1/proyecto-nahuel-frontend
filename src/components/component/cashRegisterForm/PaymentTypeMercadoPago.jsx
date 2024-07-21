import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { Save } from "lucide-react";

export default function PaymentTypeMercadoPago({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
	const [data, setData] = useState({
		salesWithMercadoPago: 0,
		withdrawal: 0,
		toRenderSystem: 0,
		cashToRenderWithMercadoPago: 0,
		diff: 0
	});

	useEffect(() => {
		if (cashRegister) {
			const withdrawal = (cancellations.filter(cancellation => cancellation.method === 'MERCADO PAGO').reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

			setData(prevData => {
				const toRenderSystem = parseFloat(prevData.salesWithMercadoPago - withdrawal).toFixed(2);
				const diff = (parseFloat(prevData.cashToRenderWithMercadoPago || 0) - toRenderSystem).toFixed(2);
				return {
					...prevData,
					salesWithMercadoPago: +cashRegister.salesWithMercadoPago,
					withdrawal,
					toRenderSystem,
					cashToRenderWithMercadoPago: +cashRegister.cashToRenderWithMercadoPago,
					diff
				};
			});
		}
	}, [cashRegister, cashMovements, cancellations]);

	const handleInputChange = (detail, value) => {
		setData(prevData => {
			const newData = { ...prevData, [detail]: detail === 'cashToRenderWithMercadoPago' && value === '' ? '' : parseFloat(value) || 0 };
			if (detail === "salesWithMercadoPago" || detail === "withdrawal") {
				newData.toRenderSystem = (newData.salesWithMercadoPago - newData.withdrawal).toFixed(2);
				newData.diff = (parseFloat(newData.cashToRenderWithMercadoPago || 0) - newData.toRenderSystem).toFixed(2);
			}
			if (detail === "cashToRenderWithMercadoPago") {
				newData.diff = (parseFloat(newData.cashToRenderWithMercadoPago || 0) - newData.toRenderSystem).toFixed(2);
			}
			return newData;
		});
	};

	const handleSave = () => {
		updateCashRegister({
			salesWithMercadoPago: data.salesWithMercadoPago,
			cashToRenderWithMercadoPago: data.cashToRenderWithMercadoPago
		});
	};

	return (
		<div className='flex flex-col w-full'>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="uppercase flex flex-col">Mercado Pago
							<span className="text-xs font-normal text-gray-500 uppercase"> (QR - Link - Debito y Credito)</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-6">
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="salesWithMercadoPago">Ventas</label>
										<div className="relative text-black">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none ">$</span>
											<Input
												type="number"
												name="salesWithMercadoPago"
												id="salesWithMercadoPago"
												min="0"
												step="0.01"
												value={data.salesWithMercadoPago || ''}
												onChange={(e) => handleInputChange('salesWithMercadoPago', e.target.value)}
												placeholder="0.00"
												className="border w-full shadow pl-5"
												required
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="withdrawal">Retiros</label>
										<div className="relative text-gray-400">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="withdrawal"
												id="withdrawal"
												step="0.01"
												value={data.withdrawal || ''}
												placeholder="0.00"
												className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5`}
												onFocus={(e) => e.target.blur()}
												readOnly
											/>
										</div>
									</div>
									<div className="flex gap-1">
										<div className="flex flex-col gap-2">
											<label className="text-xs font-medium uppercase" htmlFor="toRenderSystem">A rendir</label>
											<div className="relative text-gray-400">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="toRenderSystem"
													id="toRenderSystem"
													step="0.01"
													value={data.toRenderSystem || ''}
													placeholder="0.00"
													className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5`}
													onFocus={(e) => e.target.blur()}
													readOnly
												/>
											</div>
										</div>
										<div className="flex flex-col gap-2">
											<label className="text-xs font-medium uppercase" htmlFor="cashToRenderWithMercadoPago">Fisico</label>
											<div className="relative text-black">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="cashToRenderWithMercadoPago"
													id="cashToRenderWithMercadoPago"
													min="0"
													step="0.01"
													value={data.cashToRenderWithMercadoPago || ''}
													onChange={(e) => handleInputChange('cashToRenderWithMercadoPago', e.target.value)}
													required
													placeholder="0.00"
													className="border w-full shadow pl-5"
												/>
											</div>

										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="diff">Diferencia</label>
										<div className="relative text-gray-500">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="diff"
												id="diff"
												step="0.01"
												value={data.diff || ''}
												placeholder="0.00"
												className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
												onFocus={(e) => e.target.blur()}
												readOnly
											/>
										</div>
									</div>
								</div>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<Button
				variant="outline"
				className="w-1/2 self-center shadow flex gap-2"
				onClick={handleSave}
				disabled={!data.salesWithMercadoPago || !data.cashToRenderWithMercadoPago}
			>
				<Save className="h-4 w-4" />
				Guardar
			</Button>
		</div>
	);
}
