import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { SaveIcon } from "@/components/icons";
import { Save } from "lucide-react";

export default function PaymentTypeCash({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
	const [data, setData] = useState({
		salesWithCash: 0,
		income: 0,
		withdrawal: 0,
		toRenderSystem: 0,
		cashToRenderWithCash: 0,
		diff: 0
	});

	useEffect(() => {
		if (cashRegister) {
			const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
			const changeAmount = parseFloat(cashRegister.changeAmount) || 0;
			const income = initialAmount + changeAmount;
			const withdrawal = cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0) + (cancellations.filter(cancellation => cancellation.method === 'EFECTIVO').reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

			setData(prevData => {
				const toRenderSystem = parseFloat(prevData.salesWithCash + income - withdrawal).toFixed(2);
				const diff = (parseFloat(prevData.cashToRenderWithCash || 0) - toRenderSystem).toFixed(2);
				return {
					...prevData,
					salesWithCash: +cashRegister.salesWithCash,
					income,
					withdrawal,
					toRenderSystem,
					cashToRenderWithCash: +cashRegister.cashToRenderWithCash,
					diff
				};
			});
		}
	}, [cashRegister, cashMovements, cancellations]);

	const handleInputChange = (detail, value) => {
		setData(prevData => {
			const newData = { ...prevData, [detail]: detail === 'cashToRenderWithCash' && value === '' ? '' : parseFloat(value) || 0 };
			if (detail === "salesWithCash" || detail === "income" || detail === "withdrawal") {
				newData.toRenderSystem = (newData.salesWithCash + newData.income - newData.withdrawal).toFixed(2);
				newData.diff = (parseFloat(newData.cashToRenderWithCash || 0) - newData.toRenderSystem).toFixed(2);
			}
			if (detail === "cashToRenderWithCash") {
				newData.diff = (parseFloat(newData.cashToRenderWithCash || 0) - newData.toRenderSystem).toFixed(2);
			}
			return newData;
		});
	};

	const handleSave = () => {
		updateCashRegister({
			salesWithCash: data.salesWithCash,
			cashToRenderWithCash: data.cashToRenderWithCash
		});
	};

	return (
		<div className='flex flex-col w-full'>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="uppercase flex items-center justify-between">
							Efectivo
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-6">
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="salesWithCash">Ventas</label>
										<div className="relative text-black">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="salesWithCash"
												id="salesWithCash"
												min="0"
												step="0.01"
												autoFocus
												value={data.salesWithCash || ''}
												onChange={(e) => handleInputChange('salesWithCash', e.target.value)}
												placeholder="0.00"
												className="border w-full shadow pl-5"
												required
											/>
										</div>
									</div>
									<div className="flex gap-1">
										<div className="flex flex-col gap-2">
											<label className="text-xs font-medium uppercase" htmlFor="income">Ingresos</label>
											<div className="relative text-gray-400">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="income"
													id="income"
													step="0.01"
													value={data.income || ''}
													placeholder="0.00"
													className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5`}
													onFocus={(e) => e.target.blur()}
													readOnly
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
											<label className="text-xs font-medium uppercase" htmlFor="cashToRenderWithCash">Fisico</label>
											<div className="relative text-black">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="cashToRenderWithCash"
													id="cashToRenderWithCash"
													min="0"
													step="0.01"
													autoFocus
													value={data.cashToRenderWithCash || ''}
													onChange={(e) => handleInputChange('cashToRenderWithCash', e.target.value)}
													placeholder="0.00"
													className="border w-full shadow pl-5"
													required
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
				disabled={data.salesWithCash === '' || data.cashToRenderWithCash === ''}
			>
				<Save className="h-4 w-4" />
				Guardar
			</Button>
		</div>
	);
}
