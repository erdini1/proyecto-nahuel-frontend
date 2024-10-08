import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';

const PaymentTypeCheckingAccount = forwardRef(({ cashMovements, cancellations, cashRegister, updateCashRegister }, ref) => {
	const [data, setData] = useState({
		salesWithCredit: 0,
		toRenderSystem: 0,
		cashToRenderWithCredit: 0,
		diff: 0
	});

	useEffect(() => {
		if (cashRegister) {
			setData(prevData => {
				const toRenderSystem = parseFloat(prevData.salesWithCredit).toFixed(2);
				const diff = (parseFloat(prevData.salesWithCredit || 0) - toRenderSystem).toFixed(2);
				return {
					...prevData,
					salesWithCredit: +cashRegister.salesWithCredit,
					toRenderSystem,
					cashToRenderWithCredit: +cashRegister.cashToRenderWithCredit,
					diff
				};
			});
		}
	}, [cashRegister, cashMovements, cancellations]);

	const handleInputChange = (detail, value) => {
		setData(prevData => {
			const newData = { ...prevData, [detail]: detail === 'cashToRenderWithCredit' && value === '' ? '' : parseFloat(value) || 0 };
			if (detail === "salesWithCredit") {
				newData.toRenderSystem = (newData.salesWithCredit || 0).toFixed(2);
				newData.diff = (parseFloat(newData.cashToRenderWithCredit || 0) - newData.toRenderSystem).toFixed(2);
			}
			if (detail === "cashToRenderWithCredit") {
				newData.diff = (parseFloat(newData.cashToRenderWithCredit || 0) - newData.toRenderSystem).toFixed(2);
			}
			return newData;
		});
	};

	useImperativeHandle(ref, () => ({
		getData: () => ({
			salesWithCredit: data.salesWithCredit,
			cashToRenderWithCredit: data.cashToRenderWithCredit
		}),
	}));

	return (
		<div className="flex flex-col w-full">
			<Table className="w-full bg-slate-900">
				<TableHeader>
					<TableRow>
						<TableHead className="uppercase flex items-center justify-between text-white">
							Cuenta corriente
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow className="bg-[#e7e1e1]/80 hover:bg-[#e7e1e1]/80 backdrop-blur">
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3 pt-2 pb-5">
								<div className="flex flex-col gap-3">
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="salesWithCredit">Ventas</label>
										<div className="relative text-black">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="salesWithCredit"
												id="salesWithCredit"
												min="0"
												step="0.01"
												value={data.salesWithCredit || ''}
												onChange={(e) => handleInputChange('salesWithCredit', e.target.value)}
												placeholder="0.00"
												className="border w-full shadow pl-5 ring-2 ring-offset-1 ring-gray-500"
												required
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="toRenderSystemCredit">A rendir</label>
										<div className="relative text-gray-700">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="toRenderSystem"
												id="toRenderSystemCredit"
												step="0.01"
												value={data.toRenderSystem || ''}
												placeholder="0.00"
												className={`border w-full shadow text-gray-400 bg-gray-300 cursor-not-allowed pl-5`}
												onFocus={(e) => e.target.blur()}
												readOnly
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="cashToRenderWithCredit">Fisico</label>
										<div className="relative text-black">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="cashToRenderWithCredit"
												id="cashToRenderWithCredit"
												min="0"
												step="0.01"
												value={data.cashToRenderWithCredit || ''}
												onChange={(e) => handleInputChange('cashToRenderWithCredit', e.target.value)}
												placeholder="0.00"
												className="border w-full shadow pl-5 ring-2 ring-offset-1 ring-gray-500"
												required
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-xs font-medium uppercase" htmlFor="diffCredit">Diferencia</label>
										<div className="relative text-gray-500">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="diff"
												id="diffCredit"
												step="0.01"
												value={data.diff || ''}
												placeholder="0.00"
												className={`border w-full shadow bg-gray-300 cursor-not-allowed pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
												onFocus={(e) => e.target.blur()}
												readOnly
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2 pointer-events-none opacity-0">
										<label className="text-xs font-medium uppercase" htmlFor="diffMercadoPago">Oculto</label>
										<div className="relative text-gray-500">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="oculto1"
												id="oculto1"
												value={data.diff || ''}
												placeholder="0.00"
												className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5`}
												onFocus={(e) => e.target.blur()}
												readOnly
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2 pointer-events-none opacity-0">
										<label className="text-xs font-medium uppercase" htmlFor="diffMercadoPago">Oculto</label>
										<div className="relative text-gray-500">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												name="oculto2"
												id="oculto2"
												value={data.diff || ''}
												placeholder="0.00"
												className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5`}
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

export default PaymentTypeCheckingAccount;

// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { useEffect, useState } from 'react';

// export default function PaymentTypeCheckingAccount({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
// 	const [data, setData] = useState({
// 		salesWithCredit: 0,
// 		toRenderSystem: 0,
// 		cashToRenderWithCredit: 0,
// 		diff: 0
// 	});

// 	useEffect(() => {
// 		if (cashRegister) {
// 			setData(prevData => {
// 				const toRenderSystem = parseFloat(prevData.salesWithCredit).toFixed(2);
// 				const diff = (parseFloat(prevData.salesWithCredit || 0) - toRenderSystem).toFixed(2);
// 				return {
// 					...prevData,
// 					salesWithCredit: +cashRegister.salesWithCredit,
// 					toRenderSystem,
// 					cashToRenderWithCredit: +cashRegister.cashToRenderWithCredit,
// 					diff
// 				};
// 			});
// 		}
// 	}, [cashRegister, cashMovements, cancellations]);

// 	const handleInputChange = (detail, value) => {
// 		setData(prevData => {
// 			const newData = { ...prevData, [detail]: detail === 'cashToRenderWithCredit' && value === '' ? '' : parseFloat(value) || 0 };
// 			if (detail === "salesWithCredit") {
// 				newData.toRenderSystem = (newData.salesWithCredit || 0).toFixed(2);
// 				newData.diff = (parseFloat(newData.cashToRenderWithCredit || 0) - newData.toRenderSystem).toFixed(2);
// 			}
// 			if (detail === "cashToRenderWithCredit") {
// 				newData.diff = (parseFloat(newData.cashToRenderWithCredit || 0) - newData.toRenderSystem).toFixed(2);
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
// 		// <div className="flex flex-col w-full min-h-full justify-between ">
// 		<div className="flex flex-col w-full">
// 			<Table className="w-full">
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead className="uppercase flex items-center justify-between">
// 							Cuenta corriente
// 						</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					<TableRow>
// 						<TableCell className="align-top" colSpan="1">
// 							<div className="flex flex-col gap-3 pt-2 pb-5">
// 								<div className="flex flex-col gap-6">
// 									<div className="flex flex-col gap-2">
// 										<label className="text-xs font-medium uppercase" htmlFor="salesWithCredit">Ventas</label>
// 										<div className="relative text-black">
// 											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 											<Input
// 												type="number"
// 												name="salesWithCredit"
// 												id="salesWithCredit"
// 												min="0"
// 												step="0.01"
// 												value={data.salesWithCredit || ''}
// 												onChange={(e) => handleInputChange('salesWithCredit', e.target.value)}
// 												onBlur={handleBlur}
// 												placeholder="0.00"
// 												className="border w-full shadow pl-5"
// 												required
// 											/>
// 										</div>
// 									</div>
// 									<div className="flex gap-1">
// 										<div className="flex flex-col gap-2">
// 											<label className="text-xs font-medium uppercase" htmlFor="toRenderSystemCredit">A rendir</label>
// 											<div className="relative text-gray-400">
// 												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 												<Input
// 													type="number"
// 													name="toRenderSystem"
// 													id="toRenderSystemCredit"
// 													step="0.01"
// 													value={data.toRenderSystem || ''}
// 													placeholder="0.00"
// 													className={`border w-full shadow text-gray-400 bg-gray-100 cursor-not-allowed pl-5`}
// 													onFocus={(e) => e.target.blur()}
// 													readOnly
// 												/>
// 											</div>
// 										</div>
// 										<div className="flex flex-col gap-2">
// 											<label className="text-xs font-medium uppercase" htmlFor="cashToRenderWithCredit">Fisico</label>
// 											<div className="relative text-black">
// 												<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 												<Input
// 													type="number"
// 													name="cashToRenderWithCredit"
// 													id="cashToRenderWithCredit"
// 													min="0"
// 													step="0.01"
// 													value={data.cashToRenderWithCredit || ''}
// 													onChange={(e) => handleInputChange('cashToRenderWithCredit', e.target.value)}
// 													onBlur={handleBlur}
// 													placeholder="0.00"
// 													className="border w-full shadow pl-5"
// 													required
// 												/>
// 											</div>
// 										</div>
// 									</div>
// 									<div className="flex flex-col gap-2">
// 										<label className="text-xs font-medium uppercase" htmlFor="diffCredit">Diferencia</label>
// 										<div className="relative text-gray-500">
// 											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 											<Input
// 												type="number"
// 												name="diff"
// 												id="diffCredit"
// 												step="0.01"
// 												value={data.diff || ''}
// 												placeholder="0.00"
// 												className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
// 												onFocus={(e) => e.target.blur()}
// 												readOnly
// 											/>
// 										</div>
// 									</div>
// 									<div className="flex flex-col gap-2 pointer-events-none opacity-0">
// 										<label className="text-xs font-medium uppercase" htmlFor="diffMercadoPago">Diferencia</label>
// 										<div className="relative text-gray-500">
// 											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
// 											<Input
// 												type="number"
// 												name="diff"
// 												id="diffMercadoPago"
// 												step="0.01"
// 												value={data.diff || ''}
// 												placeholder="0.00"
// 												className={`border w-full shadow bg-gray-100 cursor-not-allowed pl-5 ${data.diff < 0 ? 'text-red-500' : 'text-green-500'}`}
// 												onFocus={(e) => e.target.blur()}
// 												readOnly
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
// 		// </div>
// 	);
// }