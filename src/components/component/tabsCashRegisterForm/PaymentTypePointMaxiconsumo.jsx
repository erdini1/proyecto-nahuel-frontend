import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

export default function PaymentTypePointMaxiconsumo({
	name,
	description,
	details,
	data,
	onChange,
	onSave,
	cashMovements,
	cancellations,
	cashRegister }) {

	useEffect(() => {
		const updateDetailValues = () => {
			if (cashRegister) {
				onChange(name, 'incomes', calculateIncomes());
				onChange(name, 'withdrawals', calculateWithdrawals());
			}
		};
		updateDetailValues();
	}, [cashRegister, cashMovements, cancellations]);

	const calculateIncomes = () => {
		let incomes = 0;
		const initialAmount = parseFloat(cashRegister.initialAmount);
		const changeAmount = parseFloat(cashRegister.changeAmount);
		if (!isNaN(initialAmount) && !isNaN(changeAmount)) {
			incomes = initialAmount + changeAmount;
		}
		return incomes;
	};

	const calculateWithdrawals = () => {
		return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0);
	};

	const handleInputChange = (detail, value) => {
		onChange(name, detail, value);

		if (detail === "ventas" || detail === "ingresos" || detail === "retiros") {
			const sales = parseFloat(data.sales || 0);
			const incomes = parseFloat(data.incomes || 0);
			const withdrawals = parseFloat(data.withdrawals || 0);
			const toRender = sales + incomes - withdrawals;
			onChange(name, "toRender", toRender.toFixed(2));
		}

		if (detail === "a rendir") {
			const toRender = parseFloat(value || 0);
			const cashToRenderWithCash = parseFloat(data.sales || 0) + parseFloat(data.incomes || 0) - parseFloat(data.withdrawals || 0);
			const diff = toRender - cashToRenderWithCash;
			if (!isNaN(diff)) {
				onChange(name, "diff", diff.toFixed(2));
			}
		}
	};

	return (
		<div className='flex flex-col'>
			<div className='text-right'>
				<Button className="w-32" onClick={onSave}>Continuar</Button>
			</div>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-1/4">Tipo de cobro</TableHead>
						<TableHead className="w-1/4">Sistema</TableHead>
						<TableHead className="w-1/4">Físico en mano</TableHead>
						<TableHead className="w-1/4">Diferencia</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="align-top" colSpan="1">
							<div className="font-bold">{name.toUpperCase()}</div>
							{description && <div className="text-sm text-gray-500">{description}</div>}
						</TableCell>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3">
								{details.map((detail, idx) => (
									<div key={idx} className="flex flex-col gap-1">
										<label className={`text-sm font-medium`} htmlFor={detail}>{detail}</label>
										<Input
											type="number"
											name={detail}
											id={detail}
											min="0"
											step="0.01"
											autoFocus
											disabled={detail === "Ingresos" || detail === "Retiros" || detail === "A rendir"}
											value={data[detail.toLowerCase().replace(/\s+/g, '')] || ""}
											onChange={(e) => handleInputChange(detail.toLowerCase().replace(/\s+/g, ''), e.target.value)}
											required
											placeholder="$0.00"
										/>
									</div>
								))}
							</div>
						</TableCell>
						<TableCell className="align-bottom" colSpan="1">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium" htmlFor="amount">A rendir</label>
								<Input
									type="number"
									name="amount"
									id="amount"
									min="0"
									step="0.01"
									autoFocus
									required
									value={data.aRendir}
									onChange={(e) => handleInputChange('toRender', e.target.value)}
									placeholder="$0.00"
								/>
							</div>
						</TableCell>
						<TableCell className="align-bottom" colSpan="1">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
								<p className={`h-10 p-2 ${data.diff > 0 ? "text-red-500" : "text-green-500"}`}>
									{data.diff}
								</p>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}