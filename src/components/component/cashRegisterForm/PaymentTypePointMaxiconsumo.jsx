import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';

const PaymentTypePointMaxiconsumo = forwardRef(({ cashMovements, cancellations, cashRegister, updateCashRegister }, ref) => {
	const [data, setData] = useState({
		salesWithPointMaxiconsumo: 0,
		withdrawal: 0,
		toRenderSystem: 0,
		cashToRenderWithPointMaxiconsumo: 0,
		diff: 0,
		batchNumber: 0
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
					diff,
					batchNumber: cashRegister.batchNumber
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

	useImperativeHandle(ref, () => ({
		getData: () => ({
			salesWithPointMaxiconsumo: data.salesWithPointMaxiconsumo,
			cashToRenderWithPointMaxiconsumo: data.cashToRenderWithPointMaxiconsumo,
			batchNumber: data.batchNumber
		}),
	}));

	return (
		<div className='flex flex-col w-full'>
			<Table className="w-full bg-slate-900">
				<TableHeader>
					<TableRow>
						<TableHead className="uppercase flex flex-col p-2 text-white">
							Point Maxiconsumo
							<span className="text-xs font-normal text-gray-400 uppercase"> (Tarjeta debito y credito)</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow className="bg-[#e7e1e1]/80 hover:bg-[#e7e1e1]/80 backdrop-blur">
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3 pt-2 pb-5">
								<div className="flex flex-col gap-3">
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
												value={data.salesWithPointMaxiconsumo || ''}
												onChange={(e) => handleInputChange('salesWithPointMaxiconsumo', e.target.value)}
												placeholder="0.00"
												className="border w-full shadow pl-5 ring-2 ring-offset-1 ring-gray-500"
												required
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="withdrawalPointMaxiconsumo">Retiros</label>
										<div className="relative text-gray-700">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="withdrawal"
												id="withdrawalPointMaxiconsumo"
												step="0.01"
												value={data.withdrawal || ''}
												placeholder="0.00"
												className={`border w-full shadow bg-gray-300 cursor-not-allowed pl-5`}
												onFocus={(e) => e.target.blur()}
												readOnly
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="toRenderSystemPointMaxiconsumo">A rendir</label>
										<div className="relative text-gray-700">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="toRenderSystem"
												id="toRenderSystemPointMaxiconsumo"
												step="0.01"
												value={data.toRenderSystem || ''}
												placeholder="0.00"
												className={`border w-full shadow bg-gray-300 cursor-not-allowed pl-5`}
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
												value={data.cashToRenderWithPointMaxiconsumo || ""}
												onChange={(e) => handleInputChange('cashToRenderWithPointMaxiconsumo', e.target.value)}
												required
												placeholder="0.00"
												className="border w-full shadow pl-5 ring-2 ring-offset-1 ring-gray-500"
											/>
										</div>
									</div>
									<div className="flex gap-1 items-center">
										<div className="flex flex-col gap-2 w-2/3">
											<label className="text-xs font-medium uppercase" htmlFor="diffPointMaxiconsumo">Diferencia</label>
											<div className="relative text-gray-500">
												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
												<Input
													type="number"
													name="diff"
													id="diffPointMaxiconsumo"
													step="0.01"
													value={data.diff || ''}
													placeholder="0.00"
													className={`border w-full shadow cursor-not-allowed bg-gray-300 pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
													onFocus={(e) => e.target.blur()}
													readOnly
												/>
											</div>
										</div>
										<div className="flex flex-col gap-2 w-1/3">
											<label className="text-xs font-medium uppercase" htmlFor="batchNumber">N° Lote</label>
											<Input
												type="number"
												name="batchNumber"
												id="batchNumber"
												min="0"
												value={data.batchNumber || ''}
												onChange={(e) => handleInputChange('batchNumber', e.target.value)}
												required
												placeholder="Lote"
												className="border w-full shadow ring-2 ring-offset-1 ring-gray-500"
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2 pointer-events-none opacity-0">
										<label className="text-xs font-medium uppercase" htmlFor="diffMercadoPago">Diferencia</label>
										<div className="relative text-gray-500">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="diff"
												id="diffMercadoPago"
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
		</div>
	);
})

export default PaymentTypePointMaxiconsumo;


// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { useEffect, useState } from 'react';

// export default function PaymentTypePointMaxiconsumo({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
// 	const [data, setData] = useState({
// 		salesWithPointMaxiconsumo: 0,
// 		withdrawal: 0,
// 		toRenderSystem: 0,
// 		cashToRenderWithPointMaxiconsumo: 0,
// 		diff: 0,
// 		batchNumber: 0
// 	});

// 	useEffect(() => {
// 		if (cashRegister) {
// 			const withdrawal = (cancellations.filter(cancellation => cancellation.method.startsWith('MAXI')).reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

// 			setData(prevData => {
// 				const toRenderSystem = parseFloat(prevData.salesWithPointMaxiconsumo - withdrawal).toFixed(2);
// 				const diff = (parseFloat(prevData.cashToRenderWithPointMaxiconsumo || 0) - toRenderSystem).toFixed(2);
// 				return {
// 					...prevData,
// 					salesWithPointMaxiconsumo: +cashRegister.salesWithPointMaxiconsumo,
// 					withdrawal,
// 					toRenderSystem,
// 					cashToRenderWithPointMaxiconsumo: +cashRegister.cashToRenderWithPointMaxiconsumo,
// 					diff,
// 					batchNumber: cashRegister.batchNumber
// 				};
// 			});
// 		}
// 	}, [cashRegister, cashMovements, cancellations]);

// 	const handleInputChange = (detail, value) => {
// 		setData(prevData => {
// 			const newData = { ...prevData, [detail]: detail === 'cashToRenderWithPointMaxiconsumo' && value === '' ? '' : parseFloat(value) || 0 };
// 			if (detail === "salesWithPointMaxiconsumo" || detail === "withdrawal") {
// 				newData.toRenderSystem = (newData.salesWithPointMaxiconsumo - newData.withdrawal).toFixed(2);
// 				newData.diff = (parseFloat(newData.cashToRenderWithPointMaxiconsumo || 0) - newData.toRenderSystem).toFixed(2);
// 			}
// 			if (detail === "cashToRenderWithPointMaxiconsumo") {
// 				newData.diff = (parseFloat(newData.cashToRenderWithPointMaxiconsumo || 0) - newData.toRenderSystem).toFixed(2);
// 			}
// 			return newData;
// 		});
// 	};

// 	const handleBlur = (e) => {
// 		updateCashRegister({
// 			...cashRegister,
// 			[e.target.name]: e.target.value
// 		});
// 	}

// 	return (
// 		<div className='flex flex-col w-full'>
// 			<Table className="w-full">
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead className="uppercase flex flex-col p-2">
// 							Point Maxiconsumo
// 							<span className="text-xs font-normal text-gray-500 uppercase"> (Tarjeta debito y credito)</span>
// 						</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					<TableRow>
// 						<TableCell className="align-top" colSpan="1">
// 							<div className="flex flex-col gap-3 pt-2 pb-5">
// 								<div className="flex flex-col gap-6">
// 									<div className="flex flex-col gap-2">
// 										<label className="text-xs font-medium uppercase" htmlFor="salesWithPointMaxiconsumo">Ventas</label>
// 										<div className="relative text-black">
// 											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 											<Input
// 												type="number"
// 												name="salesWithPointMaxiconsumo"
// 												id="salesWithPointMaxiconsumo"
// 												min="0"
// 												step="0.01"
// 												value={data.salesWithPointMaxiconsumo || ''}
// 												onChange={(e) => handleInputChange('salesWithPointMaxiconsumo', e.target.value)}
// 												onBlur={handleBlur}
// 												placeholder="0.00"
// 												className="border w-full shadow pl-5"
// 												required
// 											/>
// 										</div>
// 									</div>
// 									<div className="flex flex-col gap-2">
// 										<label className="text-xs font-medium uppercase" htmlFor="withdrawalPointMaxiconsumo">Retiros</label>
// 										<div className="relative text-gray-400">
// 											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 											<Input
// 												type="number"
// 												name="withdrawal"
// 												id="withdrawalPointMaxiconsumo"
// 												step="0.01"
// 												value={data.withdrawal || ''}
// 												placeholder="0.00"
// 												className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5`}
// 												onFocus={(e) => e.target.blur()}
// 												readOnly
// 											/>
// 										</div>
// 									</div>
// 									<div className="flex gap-1">
// 										<div className="flex flex-col gap-2">
// 											<label className="text-xs font-medium uppercase" htmlFor="toRenderSystemPointMaxiconsumo">A rendir</label>
// 											<div className="relative text-gray-400">
// 												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 												<Input
// 													type="number"
// 													name="toRenderSystem"
// 													id="toRenderSystemPointMaxiconsumo"
// 													step="0.01"
// 													value={data.toRenderSystem || ''}
// 													placeholder="0.00"
// 													className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5`}
// 													onFocus={(e) => e.target.blur()}
// 													readOnly
// 												/>
// 											</div>
// 										</div>
// 										<div className="flex flex-col gap-2">
// 											<label className="text-xs font-medium uppercase" htmlFor="cashToRenderWithPointMaxiconsumo">Fisico</label>
// 											<div className="relative text-black">
// 												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 												<Input
// 													type="number"
// 													name="cashToRenderWithPointMaxiconsumo"
// 													id="cashToRenderWithPointMaxiconsumo"
// 													min="0"
// 													step="0.01"
// 													value={data.cashToRenderWithPointMaxiconsumo || ""}
// 													onChange={(e) => handleInputChange('cashToRenderWithPointMaxiconsumo', e.target.value)}
// 													onBlur={handleBlur}
// 													required
// 													placeholder="0.00"
// 													className="border w-full shadow pl-5"
// 												/>
// 											</div>
// 										</div>
// 									</div>
// 									<div className="flex gap-1 items-center">
// 										<div className="flex flex-col gap-2 w-1/2">
// 											<label className="text-xs font-medium uppercase" htmlFor="diffPointMaxiconsumo">Diferencia</label>
// 											<div className="relative text-gray-500">
// 												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 												<Input
// 													type="number"
// 													name="diff"
// 													id="diffPointMaxiconsumo"
// 													step="0.01"
// 													value={data.diff || ''}
// 													placeholder="0.00"
// 													className={`border w-full shadow cursor-not-allowed bg-gray-100 pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
// 													onFocus={(e) => e.target.blur()}
// 													readOnly
// 												/>
// 											</div>
// 										</div>
// 										<div className="flex flex-col gap-2 w-1/2">
// 											<label className="text-xs font-medium uppercase" htmlFor="batchNumber">Nro de Lote</label>
// 											<Input
// 												type="number"
// 												name="batchNumber"
// 												id="batchNumber"
// 												min="0"
// 												value={data.batchNumber || ''}
// 												onChange={(e) => handleInputChange('batchNumber', e.target.value)}
// 												onBlur={handleBlur}
// 												required
// 												placeholder="Lote"
// 												className="border w-full shadow "
// 											/>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }
