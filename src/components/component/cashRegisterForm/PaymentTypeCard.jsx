import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';

export default function PaymentTypeCard({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
	const [data, setData] = useState({
		salesWithCards: 0,
		withdrawal: 0,
		toRenderSystem: 0,
		cashToRenderWithCards: 0,
		diff: 0
	});

	useEffect(() => {
		if (cashRegister) {
			const withdrawal = (cancellations.filter(cancellation => cancellation.method.includes('CLOVER')).reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

			setData(prevData => {
				const toRenderSystem = parseFloat(prevData.salesWithCards - withdrawal).toFixed(2);
				const diff = (parseFloat(prevData.cashToRenderWithCards || 0) - toRenderSystem).toFixed(2);
				return {
					...prevData,
					salesWithCards: +cashRegister.salesWithCards,
					withdrawal,
					toRenderSystem,
					cashToRenderWithCards: +cashRegister.cashToRenderWithCards,
					diff
				};
			});
		}
	}, [cashRegister, cashMovements, cancellations]);

	const handleInputChange = (detail, value) => {
		setData(prevData => {
			const newData = { ...prevData, [detail]: detail === 'cashToRenderWithCards' && value === '' ? '' : parseFloat(value) || 0 };
			if (detail === "salesWithCards" || detail === "withdrawal") {
				newData.toRenderSystem = (newData.salesWithCards - newData.withdrawal).toFixed(2);
				newData.diff = (parseFloat(newData.cashToRenderWithCards || 0) - newData.toRenderSystem).toFixed(2);
			}
			if (detail === "cashToRenderWithCards") {
				newData.diff = (parseFloat(newData.cashToRenderWithCards || 0) - newData.toRenderSystem).toFixed(2);
			}
			return newData;
		});
	};

	const handleBlur = (e) => {
		updateCashRegister({
			...cashRegister,
			[e.target.name]: e.target.value
		});
	}

	return (
		<div className='flex flex-col w-full'>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="uppercase flex flex-col p-2">Tarjetas
							<span className="text-xs font-normal text-gray-500 uppercase"> (Clover / QR - TDF - La red)</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3 pt-2 pb-5">
								<div className="flex flex-col gap-6">
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="salesWithCards">Ventas</label>
										<div className="relative text-black">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="salesWithCards"
												id="salesWithCards"
												min="0"
												step="0.01"
												value={data.salesWithCards || ''}
												onChange={(e) => handleInputChange('salesWithCards', e.target.value)}
												onBlur={handleBlur}
												placeholder="0.00"
												className="border w-full shadow pl-5"
												required
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="withdrawalCards">Retiros</label>
										<div className="relative text-gray-400">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none ">$</span>
											<Input
												type="number"
												name="withdrawal"
												id="withdrawalCards"
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
											<label className="text-xs font-medium uppercase" htmlFor="toRenderSystemCards">A rendir</label>
											<div className="relative text-gray-400">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="toRenderSystem"
													id="toRenderSystemCards"
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
											<label className="text-xs font-medium uppercase" htmlFor="cashToRenderWithCards">Fisico</label>
											<div className="relative text-black">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="cashToRenderWithCards"
													id="cashToRenderWithCards"
													min="0"
													step="0.01"
													value={data.cashToRenderWithCards || ''}
													onChange={(e) => handleInputChange('cashToRenderWithCards', e.target.value)}
													onBlur={handleBlur}
													placeholder="0.00"
													className="border w-full shadow pl-5"
													required
												/>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="diffCards">Diferencia</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-500">$</span>
											<Input
												type="number"
												name="diff"
												id="diffCards"
												step="0.01"
												value={data.diff || ''}
												placeholder="0.00"
												className={`border w-full shadow text-gray-400 bg-gray-100 cursor-not-allowed pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
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
		</div>
	);
}
