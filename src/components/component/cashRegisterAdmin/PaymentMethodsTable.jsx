import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"


const PaymentMethodsTable = ({ cashRegister }) => {
	const [data, setData] = useState({
		Cash: {
			sales: cashRegister?.cashSales || 0,
			income: cashRegister?.cashIncome || 0,
			withdrawal: cashRegister?.cashWithdrawal || 0,
			toRenderSystem: cashRegister?.cashToRenderSystem || 0,
			inHand: cashRegister?.cashInHand || 0,
			diff: cashRegister?.cashDiff || 0
		},
		Cards: {
			sales: cashRegister?.cardSales || 0,
			withdrawal: cashRegister?.cardWithdrawal || 0,
			toRenderSystem: cashRegister?.cardToRenderSystem || 0,
			inHand: cashRegister?.cardInHand || 0,
			diff: cashRegister?.cardDiff || 0
		},
		MercadoPago: {
			sales: cashRegister?.mercadoPagoSales || 0,
			withdrawal: cashRegister?.mercadoPagoWithdrawal || 0,
			toRenderSystem: cashRegister?.mercadoPagoToRenderSystem || 0,
			inHand: cashRegister?.mercadoPagoInHand || 0,
			diff: cashRegister?.mercadoPagoDiff || 0
		},
		PointMaxiconsumo: {
			sales: cashRegister?.pointMaxiconsumoSales || 0,
			withdrawal: cashRegister?.pointMaxiconsumoWithdrawal || 0,
			toRenderSystem: cashRegister?.pointMaxiconsumoToRenderSystem || 0,
			inHand: cashRegister?.pointMaxiconsumoInHand || 0,
			diff: cashRegister?.pointMaxiconsumoDiff || 0,
			batchNumber: cashRegister?.batchNumber || 0
		},
		Credit: {
			sales: cashRegister?.creditSales || 0,
			toRenderSystem: cashRegister?.creditToRenderSystem || 0,
			inHand: cashRegister?.creditInHand || 0,
			diff: cashRegister?.creditDiff || 0
		},
	});

	const paymentMethods = [
		{ key: "Cash", label: "Efectivo", terminal: "" },
		{ key: "Cards", label: "Tarjetas", terminal: "CLOVER" },
		{ key: "MercadoPago", label: "Mercado Pago", terminal: "MERCADO PAGO" },
		{ key: "PointMaxiconsumo", label: "Point Maxiconsumo", terminal: "MAXI" },
		{ key: "Credit", label: "Cuenta Corriente", terminal: "" }
	];

	const isTerminalInUse = (description, terminals) => {
		return terminals.some(terminal => terminal.description.includes(description));
	};

	return (
		<div>
			<div className="flex justify-between bg-gray-100 items-end">
				<p><span className="font-semibold">Tipos de Cobro</span></p>
				<div className="flex gap-6 border rounded-lg bg-white shadow p-4 text-xs uppercase">
					<div className="flex items-center gap-1">
						<span className="font-semibold text-gray-700">Monto Inicial:</span>
						<Badge variant="" className="bg-gray-400">$ {cashRegister?.initialAmount || 0}</Badge>
					</div>
					<div className="flex items-center gap-1">
						<span className="font-semibold text-gray-700">Ingreso de Cambio:</span>
						<Badge variant="" className="bg-gray-400">$ {cashRegister?.changeAmount || 0}</Badge>
					</div>
					<div className="flex items-center gap-1">
						<span className="font-semibold text-gray-700">Terminales:</span>
						{cashRegister.Terminals.map(terminal => (
							terminal.terminalNumber !== "cash" && (
								<Badge key={terminal.id} className="capitalize bg-gray-400">{terminal.description}</Badge>
							)
						))}
					</div>
				</div>
			</div>
			<Table className="min-w-full divide-y divide-gray-200 mt-4 border">
				<TableHeader className="bg-gray-50 text-gray-500 text-left text-xs uppercase">
					<TableRow>
						<TableHead className="px-6 py-3">Tipo de Cobro</TableHead>
						<TableHead className="px-6 py-3">Ventas</TableHead>
						<TableHead className="px-6 py-3">Ingreso</TableHead>
						<TableHead className="px-6 py-3">Retiros</TableHead>
						<TableHead className="px-6 py-3">A rendir</TableHead>
						<TableHead className="px-6 py-3">Físico, en mano</TableHead>
						<TableHead className="px-6 py-3">Diferencia</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200 text-xs whitespace-nowrap">
					{paymentMethods.map(({ key, label, terminal }) => {
						const isInUse = key === "Credit" ? cashRegister.cashBoxHasCheckingAccount : isTerminalInUse(terminal, cashRegister.Terminals);
						return (
							!isInUse ? null : (
								<TableRow key={key}>
									<TableCell className={`px-6 py-4 text-gray-600 uppercase`}>{label} <span>{key === "PointMaxiconsumo" && isInUse ? `(${data[key]?.batchNumber})` : ""}</span></TableCell>
									<TableCell className="px-6 py-4">$ {data[key]?.sales || 0}</TableCell>
									<TableCell className="px-6 py-4">{key !== "Cash" ? " - " : `$ ${data.Cash.income}`}</TableCell>
									<TableCell className="px-6 py-4">{key === "Credit" ? " - " : `$ ${data[key]?.withdrawal || 0}`}</TableCell>
									<TableCell className="px-6 py-4">$ {data[key]?.toRenderSystem || 0}</TableCell>
									<TableCell className="px-6 py-4 ">$ {data[key]?.inHand || 0}</TableCell>
									<TableCell className="px-6 py-4">
										$ <span className={`font-semibold ${data[key]?.diff >= 0 ? "text-green-500" : "text-red-500"}`}>{data[key]?.diff || 0}</span>
									</TableCell>
								</TableRow>
							)
						);
					})}
					<TableRow className="bg-gray-100 font-semibold uppercase">
						<TableCell className="px-6 py-4 border-t-2">Total Medios de Pago</TableCell>
						<TableCell className="px-6 py-4 border-r-2 border-t-2">$ {cashRegister.totalPaymentMethods || 0}</TableCell>
						<TableCell className="px-6 py-4 border-t-2" colSpan={2}>Retiro total Efectivo</TableCell>
						<TableCell className="px-6 py-4 border-r-2 border-t-2">$ {cashRegister.cashWithdrawal || 0}</TableCell>
						<TableCell className="px-6 py-4 border-t-2" colSpan={1}>Total Diferencias</TableCell>
						<TableCell className={`px-6 py-4 border-t-2 ${cashRegister.totalDiff >= 0 ? "text-green-500" : "text-red-500"}`}>$ {cashRegister.totalDiff}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
};

export default PaymentMethodsTable;