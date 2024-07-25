import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"


const PaymentMethodsTable = ({ cashRegister, cashMovements, cancellations }) => {
	const [data, setData] = useState({
		Cash: {
			sales: 0,
			income: 0,
			withdrawal: 0,
			toRenderSystem: 0,
			inHand: 0,
			diff: 0
		},
		Cards: {
			sales: 0,
			withdrawal: 0,
			toRenderSystem: 0,
			inHand: 0,
			diff: 0
		},
		MercadoPago: {
			sales: 0,
			withdrawal: 0,
			toRenderSystem: 0,
			inHand: 0,
			diff: 0
		},
		PointMaxiconsumo: {
			sales: 0,
			withdrawal: 0,
			toRenderSystem: 0,
			inHand: 0,
			diff: 0
		},
		Credit: {
			sales: 0,
			toRenderSystem: 0,
			inHand: 0,
			diff: 0
		},
		Total: 0
	});

	useEffect(() => {
		if (cashRegister) {
			const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
			const changeAmount = parseFloat(cashRegister.changeAmount) || 0;
			const incomeCash = initialAmount + changeAmount;

			const withdrawal = {
				Cash: calculateWithdrawal(cashMovements, cancellations, 'EFECTIVO'),
				Cards: calculateWithdrawal([], cancellations, 'CLOVER'),
				MercadoPago: calculateWithdrawal([], cancellations, 'MERCADO PAGO'),
				PointMaxiconsumo: calculateWithdrawal([], cancellations, 'MAXI')
			}

			const toRenderSystem = {
				Cash: calculateToRenderSystem(+cashRegister.salesWithCash, incomeCash, withdrawal.Cash),
				Cards: calculateToRenderSystem(+cashRegister.salesWithCards, 0, withdrawal.Cards),
				MercadoPago: calculateToRenderSystem(+cashRegister.salesWithMercadoPago, 0, withdrawal.MercadoPago),
				PointMaxiconsumo: calculateToRenderSystem(+cashRegister.salesWithPointMaxiconsumo, 0, withdrawal.PointMaxiconsumo),
				Credit: +cashRegister.salesWithCredit
			}

			const diff = {
				Cash: calculateDiff(+cashRegister.cashToRenderWithCash, toRenderSystem.Cash),
				Cards: calculateDiff(+cashRegister.cashToRenderWithCards, toRenderSystem.Cards),
				MercadoPago: calculateDiff(+cashRegister.cashToRenderWithMercadoPago, toRenderSystem.MercadoPago),
				PointMaxiconsumo: calculateDiff(+cashRegister.cashToRenderWithPointMaxiconsumo, toRenderSystem.PointMaxiconsumo),
				Credit: calculateDiff(+cashRegister.cashToRenderWithCredit, toRenderSystem.Credit)
			}

			const totalPaymentMethods = Object.keys(cashRegister).filter(key => key.includes('salesWith')).reduce((sum, key) => sum + parseFloat(+cashRegister[key]), 0);
			setData(prevData => ({ ...prevData, Total: totalPaymentMethods }));

			setData({
				Cash: {
					sales: cashRegister.salesWithCash,
					income: incomeCash,
					withdrawal: withdrawal.Cash,
					toRenderSystem: toRenderSystem.Cash,
					inHand: cashRegister.cashToRenderWithCash,
					diff: diff.Cash
				},
				Cards: {
					sales: cashRegister.salesWithCards,
					withdrawal: withdrawal.Cards,
					toRenderSystem: toRenderSystem.Cards,
					inHand: cashRegister.cashToRenderWithCards,
					diff: diff.Cards
				},
				MercadoPago: {
					sales: cashRegister.salesWithMercadoPago,
					withdrawal: withdrawal.MercadoPago,
					toRenderSystem: toRenderSystem.MercadoPago,
					inHand: cashRegister.cashToRenderWithMercadoPago,
					diff: diff.MercadoPago
				},
				PointMaxiconsumo: {
					sales: cashRegister.salesWithPointMaxiconsumo,
					withdrawal: withdrawal.PointMaxiconsumo,
					toRenderSystem: toRenderSystem.PointMaxiconsumo,
					inHand: cashRegister.cashToRenderWithPointMaxiconsumo,
					diff: diff.PointMaxiconsumo
				},
				Credit: {
					sales: cashRegister.salesWithCredit,
					toRenderSystem: toRenderSystem.Credit,
					inHand: cashRegister.cashToRenderWithCredit,
					diff: diff.Credit
				},
				Total: totalPaymentMethods
			});
		}
	}, [cashRegister, cashMovements, cancellations]);

	const calculateWithdrawal = (cashMovements, cancellations, method) => {
		return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0) +
			(cancellations.filter(cancellation => cancellation.method.includes(method)).reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));
	};

	const calculateToRenderSystem = (sales, income, withdrawal) => {
		return parseFloat(sales + income - withdrawal).toFixed(2);
	};

	const calculateDiff = (cashToRender, toRenderSystem) => {
		return (parseFloat(cashToRender || 0) - toRenderSystem).toFixed(2);
	};

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
						const isInUse = key === "Credit" ? cashRegister.CashBox.hasCheckingAccount : isTerminalInUse(terminal, cashRegister.Terminals);

						return (
							<TableRow key={key} className={isInUse ? "" : "opacity-50"}>
								<TableCell className={`px-6 py-4 text-gray-600 uppercase`}>{label} <span>{key === "PointMaxiconsumo" ? "(225)" : ""}</span></TableCell>
								<TableCell className="px-6 py-4">$ {data[key]?.sales || 0}</TableCell>
								<TableCell className="px-6 py-4">{key !== "Cash" ? " - " : `$ ${data.Cash.income}`}</TableCell>
								<TableCell className="px-6 py-4">{key === "Credit" ? " - " : `$ ${data[key]?.withdrawal || 0}`}</TableCell>
								<TableCell className="px-6 py-4">$ {data[key]?.toRenderSystem || 0}</TableCell>
								<TableCell className="px-6 py-4 ">$ {data[key]?.inHand || 0}</TableCell>
								<TableCell className="px-6 py-4">
									$ <span className={`font-semibold ${data[key]?.diff >= 0 ? "text-green-500" : "text-red-500"}`}>{data[key]?.diff || 0}</span>
								</TableCell>
							</TableRow>
						);
					})}
					<TableRow className="bg-gray-100 font-semibold uppercase">
						<TableCell className="px-6 py-4 border-t-2">Total Medios de Pago</TableCell>
						<TableCell className="px-6 py-4 border-r-2 border-t-2">$ {data.Total || 0}</TableCell>
						<TableCell className="px-6 py-4 border-t-2" colSpan={2}>Retiro total Tarjetas</TableCell>
						<TableCell className="px-6 py-4 border-r-2 border-t-2">$ {data.Cards.withdrawal || 0}</TableCell>
						<TableCell className="px-6 py-4 border-t-2" colSpan={1}>Retiro total Efectivo</TableCell>
						<TableCell className="px-6 py-4 border-t-2">$ {data.Cash.withdrawal || 0}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
};

export default PaymentMethodsTable;
