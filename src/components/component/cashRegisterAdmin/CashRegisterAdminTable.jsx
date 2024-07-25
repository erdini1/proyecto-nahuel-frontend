import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import CashRegisterRow from '@/components/component/cashRegisterAdmin/CashRegisterRow';

export default function CashRegisterAdminTable({ cashRegisters, cashMovements, cancellations }) {

	const cashMovementsFiltered = (cashRegisterId) => {
		return cashMovements.filter((cashMovement) => cashMovement.CashRegister.id === cashRegisterId);
	}

	const cancellationsFiltered = (cashRegisterId) => {
		return cancellations.filter((cancellation) => cancellation.CashRegister.id === cashRegisterId);
	}

	return (
		<div className="border shadow-sm rounded-lg  overflow-x-auto">
			<Table className="min-w-full divide-y divide-gray-200">
				<TableHeader className="bg-gray-100 text-left">
					<TableRow>
						<TableHead className="px-3"></TableHead>
						<TableHead className="w-2/12 py-3">Cajero</TableHead>
						<TableHead className="w-2/12 py-3">Fecha</TableHead>
						<TableHead className="w-1/12 py-3">Caja</TableHead>
						<TableHead className="w-2/12 py-3">Total Medios de pago</TableHead>
						<TableHead className="w-2/12 py-3">Total Retiros Tarjetas</TableHead>
						<TableHead className="w-2/12 py-3">Total Retios Efectivo</TableHead>
						<TableHead className="w-1/12 py-3">Estado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200">
					{cashRegisters.length === 0 ? (
						<TableRow>
							<TableCell colSpan="7" className="px-6 py-4 whitespace-nowrap text-center">No hay registros de caja</TableCell>
						</TableRow>
					) : (
						cashRegisters.map((cashRegister) => (
							<CashRegisterRow
								key={cashRegister.id}
								cashRegister={cashRegister}
								cashMovementsFiltered={cashMovementsFiltered}
								cancellationsFiltered={cancellationsFiltered}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div >
	);
}

// import { use, useEffect, useState } from 'react';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
// import { ChevronDownIcon } from '@radix-ui/react-icons';

// export default function CashRegisterAdminTable({ cashRegisters, cashMovements, cancellations, terminals }) {
// 	const [expandedRows, setExpandedRows] = useState({});

// 	const handleRowClick = (id) => {
// 		setExpandedRows((prevState) => ({
// 			...prevState,
// 			[id]: !prevState[id],
// 		}));
// 	};

// 	const cashMovementsFiltered = (cashRegisterId) => {
// 		return cashMovements.filter((cashMovement) => cashMovement.CashRegister.id === cashRegisterId);
// 	}

// 	const cancellationsFiltered = (cashRegisterId) => {
// 		return cancellations.filter((cancellation) => cancellation.CashRegister.id === cashRegisterId);
// 	}

// 	return (
// 		<div className="border shadow-sm rounded-lg  overflow-x-auto">
// 			<Table className="min-w-full divide-y divide-gray-200">
// 				<TableHeader className="bg-gray-100">
// 					<TableRow>
// 						<TableHead className="py-3 text-left"></TableHead>
// 						<TableHead className="px-6 py-3 text-left">Cajero</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Fecha</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Caja</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Monto inicial</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Ingreso de cambio</TableHead>
// 						<TableHead className="px-3 py-3 text-left">Estado</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody className="bg-white divide-y divide-gray-200">
// 					{cashRegisters.length === 0 ? (
// 						<TableRow>
// 							<TableCell colSpan="7" className="px-6 py-4 whitespace-nowrap text-center">No hay registros de caja</TableCell>
// 						</TableRow>
// 					) : (
// 						cashRegisters.map((cashRegister) => (
// 							<>
// 								<TableRow key={cashRegister.id} onClick={() => handleRowClick(cashRegister.id)}>
// 									<TableCell className="py-4 cursor-pointer">
// 										<ChevronDownIcon className={`h-4 w-4 ${expandedRows[cashRegister.id] ? 'transform rotate-180' : ''}`} />
// 									</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer capitalize">{cashRegister.User.firstName} {cashRegister.User.lastName}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">{cashRegister.date}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">{cashRegister.CashBox.description}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">$ {cashRegister.initialAmount}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">$ {cashRegister.changeAmount}</TableCell>
// 									<TableCell className="px-3 py-4 whitespace-nowrap cursor-pointer"><span className='bg-green-500 rounded-2xl p-1 text-xs'>Cerrado</span></TableCell>
// 								</TableRow>
// 								{expandedRows[cashRegister.id] && (
// 									<TableRow>
// 										<TableCell colSpan="7" className="px-6 py-4 whitespace-nowrap">
// 											<Collapsible open>
// 												<CollapsibleContent className='flex flex-col gap-4'>
// 													<div>
// 														<p>
// 															<span className="font-semibold">Tipos de Cobro</span>
// 														</p>
// 														<Table className="min-w-full divide-y divide-gray-200 mt-4 border">
// 															<TableHeader className="bg-gray-50 text-gray-500 text-left text-xs uppercase">
// 																<TableRow>
// 																	<TableHead className="px-6 py-3">Tipo de Cobro</TableHead>
// 																	<TableHead className="px-6 py-3">Ventas</TableHead>
// 																	<TableHead className="px-6 py-3">Ingreso</TableHead>
// 																	<TableHead className="px-6 py-3">Retiros</TableHead>
// 																	<TableHead className="px-6 py-3">A rendir</TableHead>
// 																	<TableHead className="px-6 py-3">Fisico, en mano</TableHead>
// 																	<TableHead className="px-6 py-3">Diferencia</TableHead>
// 																</TableRow>
// 															</TableHeader>
// 															<TableBody className="bg-white divide-y divide-gray-200 text-xs whitespace-nowrap">
// 																{["Efectivo", "Tarjetas", "Mercado Pago", "Point Maxiconsumo", "Cuenta Corriente"].map((item) => (
// 																	<TableRow >
// 																		<TableCell className="px-6 py-4  text-gray-600 uppercase">{item}</TableCell>
// 																		<TableCell className="px-6 py-4">$ 800 </TableCell>
// 																		<TableCell className="px-6 py-4">{item !== "Efectivo" ? " - " : "$ 800"}</TableCell>
// 																		<TableCell className="px-6 py-4">{item === "Cuenta Corriente" ? " - " : "$ 800"}</TableCell>
// 																		<TableCell className="px-6 py-4">$ 800 </TableCell>
// 																		<TableCell className="px-6 py-4">$ 800 </TableCell>
// 																		<TableCell className="px-6 py-4">$ 800 </TableCell>
// 																	</TableRow>
// 																))}
// 																<TableRow >
// 																	<TableCell className="px-6 py-4 uppercase">Total Medios de Pago</TableCell>
// 																	<TableCell className="px-6 py-4">$ 9000 </TableCell>
// 																</TableRow>
// 															</TableBody>
// 														</Table>
// 													</div>
// 													<div className='flex gap-2'>
// 														<div className='w-1/2'>
// 															<p>
// 																<span className="font-semibold">Movimientos</span>
// 															</p>
// 															<Table className="min-w-full divide-y divide-gray-200 mt-4 border">
// 																<TableHeader className="bg-gray-50">
// 																	<TableRow>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">ID</TableHead>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">Detalle</TableHead>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">Hora</TableHead>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">Monto</TableHead>
// 																	</TableRow>
// 																</TableHeader>
// 																<TableBody className="bg-white divide-y divide-gray-200">
// 																	{cashMovementsFiltered(cashRegister.id).length === 0 ? (
// 																		<TableRow>
// 																			<TableCell colSpan="4" className="px-6 py-4 whitespace-nowrap text-center">No se encontraron movimientos</TableCell>
// 																		</TableRow>
// 																	) : (
// 																		cashMovementsFiltered(cashRegister.id).map((cashMovement) => (
// 																			<TableRow >
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">{cashMovement.id}</TableCell>
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">{cashMovement.Provider.name}</TableCell>
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">{cashMovement.time}</TableCell>
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">$ {cashMovement.amount}</TableCell>
// 																			</TableRow>
// 																		))
// 																	)}
// 																</TableBody>
// 															</Table>
// 														</div>
// 														<div className='w-1/2'>
// 															<p>
// 																<span className="font-semibold">Anulaciones</span>
// 															</p>
// 															<Table className="min-w-full divide-y divide-gray-200 mt-4 border">
// 																<TableHeader className="bg-gray-50">
// 																	<TableRow>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">ID</TableHead>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">Detalle</TableHead>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">Hora</TableHead>
// 																		<TableHead className="w-1/4 py-3 pl-6 text-left text-xs text-gray-500 uppercase">Monto</TableHead>
// 																	</TableRow>
// 																</TableHeader>
// 																<TableBody className="bg-white divide-y divide-gray-200">
// 																	{cancellationsFiltered(cashRegister.id).length === 0 ? (
// 																		<TableRow>
// 																			<TableCell colSpan="4" className="px-6 py-4 whitespace-nowrap text-center">No se encontraron anulaciones</TableCell>
// 																		</TableRow>
// 																	) : (
// 																		cancellationsFiltered(cashRegister.id).map((cancellation) => (
// 																			<TableRow >
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">{cancellation.id}</TableCell>
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">{cancellation.id}</TableCell>
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">{cancellation.id}</TableCell>
// 																				<TableCell className="w-1/4 py-4 pl-6 text-xs whitespace-nowrap">{cancellation.id}</TableCell>
// 																			</TableRow>
// 																		))
// 																	)}
// 																</TableBody>
// 															</Table>
// 														</div>
// 													</div>
// 												</CollapsibleContent>
// 											</Collapsible>
// 										</TableCell>
// 									</TableRow >
// 								)}
// 							</>
// 						))
// 					)}
// 				</TableBody>
// 			</Table>
// 		</div >
// 	);
// }

// ---------------------

// import { useState } from 'react';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
// import { ChevronDownIcon } from '@radix-ui/react-icons';

// export default function CashRegisterAdminTable({ cashRegisters, cashMovements, cancellations, terminals }) {
// 	const [expandedRows, setExpandedRows] = useState({});

// 	const handleRowClick = (id) => {
// 		setExpandedRows((prevState) => ({
// 			...prevState,
// 			[id]: !prevState[id],
// 		}));
// 	};

// 	return (
// 		<div className="border shadow-sm rounded-lg  overflow-x-auto">
// 			<Table className="min-w-full divide-y divide-gray-200">
// 				<TableHeader className="bg-gray-100">
// 					<TableRow>
// 						<TableHead className="py-3 text-left"></TableHead>
// 						<TableHead className="px-6 py-3 text-left">Cajero</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Fecha</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Caja</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Monto inicial</TableHead>
// 						<TableHead className="px-6 py-3 text-left">Ingreso de cambio</TableHead>
// 						<TableHead className="px-3 py-3 text-left">Estado</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody className="bg-white divide-y divide-gray-200">
// 					{cashRegisters.length === 0 ? (
// 						<TableRow>
// 							<TableCell colSpan="7" className="px-6 py-4 whitespace-nowrap text-center">No hay registros de caja</TableCell>
// 						</TableRow>
// 					) : (
// 						cashRegisters.map((cashRegister) => (
// 							<>
// 								<TableRow key={cashRegister.id} onClick={() => handleRowClick(cashRegister.id)}>
// 									<TableCell className="py-4 cursor-pointer">
// 										<ChevronDownIcon className={`h-4 w-4 ${expandedRows[cashRegister.id] ? 'transform rotate-180' : ''}`} />
// 									</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer capitalize">{cashRegister.User.firstName} {cashRegister.User.lastName}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">{cashRegister.date}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">{cashRegister.CashBox.description}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">$ {cashRegister.initialAmount}</TableCell>
// 									<TableCell className="px-6 py-4 whitespace-nowrap cursor-pointer">$ {cashRegister.changeAmount}</TableCell>
// 									<TableCell className="px-3 py-4 whitespace-nowrap cursor-pointer"><span className='bg-green-500 rounded-2xl p-1 text-xs'>Cerrado</span></TableCell>
// 								</TableRow>
// 								{expandedRows[cashRegister.id] && (
// 									<TableRow>
// 										<TableCell colSpan="7" className="px-6 py-4 whitespace-nowrap">
// 											<Collapsible open>
// 												{/* <CollapsibleTrigger>Detalles de métodos de pago</CollapsibleTrigger> */}
// 												<CollapsibleContent>
// 													<Table className="min-w-full divide-y divide-gray-200 mt-4 border">
// 														<TableHeader className="bg-gray-50">
// 															<TableRow>
// 																<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Método de pago</TableHead>
// 																<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Ventas</TableHead>
// 																<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Ingreso</TableHead>
// 																<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Retiros</TableHead>
// 																<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">A rendir</TableHead>
// 																<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Fisico, en mano</TableHead>
// 																<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Diferencia</TableHead>
// 															</TableRow>
// 														</TableHeader>
// 														<TableBody className="bg-white divide-y divide-gray-200">
// 															{["Efectivo", "Tarjetas", "Mercado Pago", "Point Maxiconsumo", "Cuenta Corriente"].map((item) => (
// 																<TableRow >
// 																	<TableCell className="px-6 py-4 whitespace-nowrap uppercase">{item}</TableCell>
// 																	<TableCell className="px-6 py-4 whitespace-nowrap">$ 800 </TableCell>
// 																	<TableCell className="px-6 py-4 whitespace-nowrap">{item !== "Efectivo" ? " - " : "$ 800"}</TableCell>
// 																	<TableCell className="px-6 py-4 whitespace-nowrap">{item === "Cuenta Corriente" ? " - " : "$ 800"}</TableCell>
// 																	<TableCell className="px-6 py-4 whitespace-nowrap">$ 800 </TableCell>
// 																	<TableCell className="px-6 py-4 whitespace-nowrap">$ 800 </TableCell>
// 																	<TableCell className="px-6 py-4 whitespace-nowrap">$ 800 </TableCell>
// 																</TableRow>
// 															))}
// 															<TableRow >
// 																<TableCell className="px-6 py-4 whitespace-nowrap uppercase">Total Medios de Pago</TableCell>
// 																<TableCell className="px-6 py-4 whitespace-nowrap">$ 9000 </TableCell>
// 															</TableRow>
// 														</TableBody>
// 													</Table>
// 												</CollapsibleContent>
// 											</Collapsible>
// 										</TableCell>
// 									</TableRow >
// 								)}
// 							</>
// 						))
// 					)}
// 				</TableBody>
// 			</Table>
// 		</div >
// 	);
// }


// -------------------

// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";

// export default function CashRegisterAdminTable({ cashRegisters }) {
// 	return (
// 		<div className="border shadow-sm rounded-lg max-w-screen-lg overflow-x-auto">
// 			<Table className="min-w-full divide-y divide-gray-200">
// 				<TableHeader className="bg-gray-50">
// 					<TableRow>
// 						<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Cajero</TableHead>
// 						<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Fecha</TableHead>
// 						<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Caja</TableHead>
// 						<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Monto inicial</TableHead>
// 						<TableHead className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Ingreso de cambio</TableHead>

// 					</TableRow>
// 				</TableHeader>
// 				<TableBody className="bg-white divide-y divide-gray-200">
// 					{cashRegisters.length === 0 ? (
// 						<TableRow>
// 							<TableCell colSpan="17" className="px-6 py-4 whitespace-nowrap text-center">No hay registros de caja</TableCell>
// 						</TableRow>
// 					) : (
// 						cashRegisters.map((cashRegister) => (
// 							<TableRow key={cashRegister.id}>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.cashBoxId}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.date}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.initialAmount}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.changeIncome}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.terminal1}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.terminal1Number}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.passedForPosnetT1}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.terminal2}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.terminal2Number}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.passedForPosnetT2}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.terminal3}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.terminal3Number}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.passedForPosnetT3}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.maxiTerminalNumber}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.passedForMaxi}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.maxiconsumoBatchNumber}</TableCell>
// 								<TableCell className="px-6 py-4 whitespace-nowrap">{cashRegister.totalByPaymentMethods}</TableCell>
// 							</TableRow>
// 						))
// 					)}
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }
// ----------------------

// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";

// export default function CashRegisterAdminTable({ cashRegisters }) {
// 	return (
// 		<div div className="border shadow-sm rounded-lg max-w-screen-lg overflow-x-auto" >
// 			<Table>
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead className="">Nro de caja</TableHead>
// 						<TableHead className="">Fecha</TableHead>
// 						<TableHead className="">Monto inicial</TableHead>
// 						<TableHead className="">Ingreso de cambio</TableHead>
// 						<TableHead className="">Terminal N°1</TableHead>
// 						<TableHead className="">N de terminal 1</TableHead>
// 						<TableHead className="">Pasado p/posnet T1</TableHead>
// 						<TableHead className="">Terminal N°2</TableHead>
// 						<TableHead className="">N de terminal 2</TableHead>
// 						<TableHead className="">Pasado p/posnet T2</TableHead>
// 						<TableHead className="">Terminal N°3</TableHead>
// 						<TableHead className="">N de terminal 3</TableHead>
// 						<TableHead className="">Pasado p/posnet T3</TableHead>
// 						<TableHead className="">N de terminal MAXI</TableHead>
// 						<TableHead className="">Pasado por MAXI</TableHead>
// 						<TableHead className="">N° lote MAXICONSUMO</TableHead>
// 						<TableHead className="">Total por medios de pagos</TableHead>
// 					</TableRow>
// 				</TableHeader>

// 				<TableBody>
// 					{cashRegisters.length === 0 ? (
// 						<TableRow>
// 							<TableCell colSpan="17" className="text-center">No hay registros de caja</TableCell>
// 						</TableRow>
// 					) : (
// 						cashRegisters.map((cashRegister) => (
// 							<TableRow key={cashRegister.id}>
// 								<TableCell className="">{cashRegister.cashBoxId}</TableCell>
// 								<TableCell className="">{cashRegister.date}</TableCell>
// 								<TableCell className="">{cashRegister.initialAmount}</TableCell>
// 								<TableCell className="">{cashRegister.changeIncome}</TableCell>
// 								<TableCell className="">{cashRegister.terminal1}</TableCell>
// 								<TableCell className="">{cashRegister.terminal1Number}</TableCell>
// 								<TableCell className="">{cashRegister.passedForPosnetT1}</TableCell>
// 								<TableCell className="">{cashRegister.terminal2}</TableCell>
// 								<TableCell className="">{cashRegister.terminal2Number}</TableCell>
// 								<TableCell className="">{cashRegister.passedForPosnetT2}</TableCell>
// 								<TableCell className="">{cashRegister.terminal3}</TableCell>
// 								<TableCell className="">{cashRegister.terminal3Number}</TableCell>
// 								<TableCell className="">{cashRegister.passedForPosnetT3}</TableCell>
// 								<TableCell className="">{cashRegister.maxiTerminalNumber}</TableCell>
// 								<TableCell className="">{cashRegister.passedForMaxi}</TableCell>
// 								<TableCell className="">{cashRegister.maxiconsumoBatchNumber}</TableCell>
// 								<TableCell className="">{cashRegister.totalByPaymentMethods}</TableCell>
// 							</TableRow>
// 						))
// 					)}
// 				</TableBody>
// 			</Table>
// 		</div >
// 	);
// }

// ---------------------------

// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { FilePenIcon, TrashIcon } from "@/components/icons/index";
// import { translateRole } from "@/helpers/role.helper";
// import {
// 	AlertDialog,
// 	AlertDialogAction,
// 	AlertDialogCancel,
// 	AlertDialogContent,
// 	AlertDialogDescription,
// 	AlertDialogFooter,
// 	AlertDialogHeader,
// 	AlertDialogTitle,
// 	AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// export default function CashRegisterAdminTable() {

// 	return (
// 		<div className="border shadow-sm rounded-lg">
// 			<Table>
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead className="w-1/4">Nombre y Apellido</TableHead>
// 						<TableHead className="w-1/4">Numero de ingreso</TableHead>
// 						<TableHead className="w-1/4">Sector</TableHead>
// 						<TableHead className="w-1/4">Acciones</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					{employees.length === 0 ? (
// 						<TableRow>
// 							<TableCell colSpan="4" className="text-center">No hay usuarios registrados</TableCell>
// 						</TableRow>
// 					) : (
// 						employees.map((employee) => (
// 							<TableRow key={employee.id}>
// 								<TableCell className="w-1/4 capitalize">{employee.firstName} {employee.lastName}</TableCell>
// 								<TableCell className="w-1/4">{employee.number}</TableCell>
// 								<TableCell className="w-1/4 capitalize">
// 									{employee.Sectors?.map((sector) => (
// 										<p key={sector.id}>{sector.name}</p>
// 									))}
// 								</TableCell>
// 								<TableCell className="w-1/4">
// 									<div className="flex items-center gap-2">
// 										<Button
// 											variant="outline"
// 											size="icon"
// 											onClick={() => handleUpdateEmployee(employee.id)}
// 										>
// 											<FilePenIcon className="h-4 w-4" />
// 											<span className="sr-only">Editar</span>
// 										</Button>

// 										<AlertDialog>
// 											<AlertDialogTrigger asChild>
// 												<Button
// 													variant="outline"
// 													size="icon"
// 												>
// 													<TrashIcon className="h-4 w-4" />
// 													<span className="sr-only">Eliminar</span>
// 												</Button>
// 											</AlertDialogTrigger>
// 											<AlertDialogContent>
// 												<AlertDialogHeader>
// 													<AlertDialogTitle>Esta seguro que desea eliminar el usuario?</AlertDialogTitle>
// 													<AlertDialogDescription>
// 														Esta acción no se puede deshacer. Esto eliminará permanentemente su cuenta y removerá los datos de los servidores.
// 													</AlertDialogDescription>
// 												</AlertDialogHeader>
// 												<AlertDialogFooter>
// 													<AlertDialogCancel>Cancelar</AlertDialogCancel>
// 													<AlertDialogAction
// 														onClick={() => handleDeleteEmployee(employee.id)}
// 													>Continuar</AlertDialogAction>
// 												</AlertDialogFooter>
// 											</AlertDialogContent>
// 										</AlertDialog>
// 									</div>
// 								</TableCell>
// 							</TableRow>
// 						))
// 					)}
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }

