import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

export default function PaymentTypeCard({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
	const [data, setData] = useState({
		ventas: 0,
		retiros: 0,
		aRendirSistema: 0,
		aRendirFisico: '',
		diff: 0
	});

	useEffect(() => {
		if (cashRegister) {
			const retiros = cancellations.filter(cancellation => cancellation.method.startsWith('CAJA')).reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0);


			setData(prevData => ({
				...prevData,
				retiros,
				aRendirSistema: prevData.ventas.toFixed(2),
				diff: (parseFloat(prevData.aRendirFisico || 0) - prevData.ventas).toFixed(2)
			}));
		}
	}, [cashRegister, cashMovements, cancellations]);

	const handleInputChange = (detail, value) => {
		setData(prevData => {
			const newData = { ...prevData, [detail]: detail === 'aRendirFisico' && value === '' ? '' : parseFloat(value) || 0 };
			if (detail === "ventas") {
				newData.aRendirSistema = newData.ventas.toFixed(2);
				newData.diff = (parseFloat(newData.aRendirFisico || 0) - newData.aRendirSistema).toFixed(2);
			}
			if (detail === "aRendirFisico") {
				newData.diff = (parseFloat(newData.aRendirFisico || 0) - newData.aRendirSistema).toFixed(2);
			}
			return newData;
		});
	};

	const handleSave = () => {
		console.log("Datos guardados:", data);
		updateCashRegister({
			salesWithCredit: data.ventas,
			cashToRenderWithCredit: data.aRendirFisico
		});
	};

	return (
		<div className='flex flex-col'>
			<div className='text-right'>
				<Button className="w-32" onClick={handleSave}>Continuar</Button>
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
							<div className="font-bold">TARJETAS</div>
							<div className="text-sm text-gray-500">Clover / QR - TDF - La red</div>
						</TableCell>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3">
								{["ventas", "retiros", "aRendirSistema"].map((detail, idx) => (
									<div key={idx} className="flex flex-col gap-1">
										<label className="text-sm font-medium" htmlFor={detail}>{detail.charAt(0).toUpperCase() + detail.slice(1)}</label>
										<Input
											type="number"
											name={detail}
											id={detail}
											min="0"
											step="0.01"
											autoFocus
											disabled={['retiros', 'aRendirSistema'].includes(detail)}
											value={data[detail] || ''}
											onChange={(e) => handleInputChange(detail, e.target.value)}
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
									value={data.aRendirFisico}
									onChange={(e) => handleInputChange('aRendirFisico', e.target.value)}
									placeholder="$0.00"
								/>
							</div>
						</TableCell>
						<TableCell className="align-bottom" colSpan="1">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
								<p className={`h-10 p-2 ${data.diff >= 0 ? "text-green-500" : "text-red-500"}`}>
									{isNaN(data.diff) ? 0 : data.diff}
								</p>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
