import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { Save } from "lucide-react";

export default function PaymentTypePointMaxiconsumo({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
	const [data, setData] = useState({
		salesWithPointMaxiconsumo: 0,
		withdrawal: 0,
		toRenderSystem: 0,
		cashToRenderWithPointMaxiconsumo: 0,
		diff: 0,
		lotNumber: 0
	});

	useEffect(() => {
		if (cashRegister) {
			const withdrawal = (cancellations.filter(cancellation => cancellation.method.startsWith('MAXI')).reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

			setData(prevData => {
				const toRenderSystem = parseFloat(prevData.salesWithPointMaxiconsumo - withdrawal).toFixed(2);
				const diff = (parseFloat(prevData.cashToRenderWithPointMaxiconsumo || 0) - toRenderSystem).toFixed(2);
				return {
					...prevData,
					salesWithPointMaxiconsumo: +cashRegister.salesWithPointMaxiconsumo,
					withdrawal,
					toRenderSystem,
					cashToRenderWithPointMaxiconsumo: +cashRegister.cashToRenderWithPointMaxiconsumo,
					diff
				};
			});
		}
	}, [cashRegister, cashMovements, cancellations]);

	const handleInputChange = (detail, value) => {
		setData(prevData => {
			const newData = { ...prevData, [detail]: detail === 'cashToRenderWithPointMaxiconsumo' && value === '' ? '' : parseFloat(value) || 0 };
			if (detail === "salesWithPointMaxiconsumo" || detail === "withdrawal") {
				newData.toRenderSystem = (newData.salesWithPointMaxiconsumo - newData.withdrawal).toFixed(2);
				newData.diff = (parseFloat(newData.cashToRenderWithPointMaxiconsumo || 0) - newData.toRenderSystem).toFixed(2);
			}
			if (detail === "cashToRenderWithPointMaxiconsumo") {
				newData.diff = (parseFloat(newData.cashToRenderWithPointMaxiconsumo || 0) - newData.toRenderSystem).toFixed(2);
			}
			return newData;
		});
	};

	// TODO: Agregar numero de lote
	const handleSave = () => {
		updateCashRegister({
			salesWithPointMaxiconsumo: data.salesWithPointMaxiconsumo,
			cashToRenderWithPointMaxiconsumo: data.cashToRenderWithPointMaxiconsumo
		});
	};

	return (
		<div className='flex flex-col w-full'>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="uppercase flex flex-col">
							Point Maxiconsumo
							<span className="text-xs font-normal text-gray-500 uppercase"> (Tarjeta debito y credito)</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-6">
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="salesWithPointMaxiconsumo">Ventas</label>
										<div className="relative text-black">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="salesWithPointMaxiconsumo"
												id="salesWithPointMaxiconsumo"
												min="0"
												step="0.01"
												autoFocus
												value={data.salesWithPointMaxiconsumo || ''}
												onChange={(e) => handleInputChange('salesWithPointMaxiconsumo', e.target.value)}
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
											<label className="text-xs font-medium uppercase" htmlFor="cashToRenderWithPointMaxiconsumo">Fisico</label>
											<div className="relative text-black">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="cashToRenderWithPointMaxiconsumo"
													id="cashToRenderWithPointMaxiconsumo"
													min="0"
													step="0.01"
													autoFocus
													value={data.cashToRenderWithPointMaxiconsumo || ''}
													onChange={(e) => handleInputChange('cashToRenderWithPointMaxiconsumo', e.target.value)}
													required
													placeholder="0.00"
													className="border w-full shadow pl-5"
												/>
											</div>
										</div>
									</div>
									<div className="flex gap-1 items-center">
										<div className="flex flex-col gap-2 w-1/2">
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
													className={`border w-full shadow cursor-not-allowed bg-gray-100 pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
													onFocus={(e) => e.target.blur()}
													readOnly
												/>
											</div>
										</div>
										<div className="flex flex-col gap-2 w-1/2">
											<label className="text-xs font-medium uppercase" htmlFor="lotNumber">Nro de Lote</label>
											<Input
												type="number"
												name="lotNumber"
												id="lotNumber"
												min="0"
												step="0.01"
												value={data.lotNumber || ''}
												onChange={(e) => handleInputChange('lotNumber', e.target.value)}
												required
												placeholder="Lote"
												className="border w-full shadow "
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
				disabled={data.salesWithPointMaxiconsumo === '' || data.cashToRenderWithPointMaxiconsumo === '' || !data.lotNumber}
			>
				<Save className="h-4 w-4" />
				Guardar
			</Button>
		</div>
	);
}
