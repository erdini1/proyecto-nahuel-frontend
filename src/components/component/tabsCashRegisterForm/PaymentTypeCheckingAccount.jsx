import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

export default function PaymentTypeCheckingAccount({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
	const [data, setData] = useState({
		ventas: 0,
		aRendirSistema: 0,
		aRendirFisico: '',
		diff: 0
	});

	useEffect(() => {
		if (cashRegister) {
			setData(prevData => ({
				...prevData,
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
							<div className="font-bold">CUENTA CORRIENTE</div>
						</TableCell>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3">
								{["ventas", "aRendirSistema"].map((detail, idx) => (
									<div key={idx} className="flex flex-col gap-1">
										<label className="text-sm font-medium" htmlFor={detail}>{detail.charAt(0).toUpperCase() + detail.slice(1)}</label>
										<Input
											type="number"
											name={detail}
											id={detail}
											min="0"
											step="0.01"
											autoFocus
											disabled={detail === "aRendirSistema"}
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


// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from 'react';

// export default function PaymentTypeCheckingAccount({ cashMovements, cancellations, cashRegister, updateCashRegister, onNextTab }) {
// 	const [data, setData] = useState({
// 		ventas: 0,
// 		// ingresos: 0,
// 		// retiros: 0,
// 		aRendirSistema: 0,
// 		aRendirFisico: 0,
// 		diff: 0
// 	});

// 	useEffect(() => {
// 		if (typeof window !== 'undefined') {
// 			const ventas = parseFloat(localStorage.getItem("ventas")) || 0;
// 			const aRendirFisico = parseFloat(localStorage.getItem("aRendirFisico")) || 0;
// 			setData(prevData => ({
// 				...prevData,
// 				ventas,
// 				aRendirFisico,
// 			}));
// 		}
// 	}, []);

// 	useEffect(() => {
// 		if (cashRegister) {
// 			// const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
// 			// const changeAmount = parseFloat(cashRegister.changeAmount) || 0;
// 			// const ingresos = initialAmount + changeAmount;
// 			// const retiros = cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0) + (cancellations.filter(cancellation => cancellation.method === 'EFECTIVO').reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

// 			setData(prevData => {
// 				const aRendirSistema = parseFloat(prevData.ventas).toFixed(2);
// 				const diff = (parseFloat(prevData.aRendirFisico || 0) - aRendirSistema).toFixed(2);
// 				return {
// 					...prevData,
// 					// ingresos,
// 					// retiros,
// 					aRendirSistema,
// 					diff
// 				};
// 			});
// 		}
// 	}, [cashRegister, cashMovements, cancellations]);

// 	const handleInputChange = (detail, value) => {
// 		setData(prevData => {
// 			const newData = { ...prevData, [detail]: detail === 'aRendirFisico' && value === '' ? '' : parseFloat(value) || 0 };
// 			if (detail === "ventas"/*  || detail === "ingresos" || detail === "retiros" */) {
// 				newData.aRendirSistema = newData.ventas.toFixed(2);
// 				newData.diff = (parseFloat(newData.aRendirFisico || 0) - newData.aRendirSistema).toFixed(2);
// 			}
// 			if (detail === "aRendirFisico") {
// 				newData.diff = (parseFloat(newData.aRendirFisico || 0) - newData.aRendirSistema).toFixed(2);
// 			}
// 			return newData;
// 		});
// 	};

// 	const handleSave = () => {
// 		console.log("Datos guardados:", data);
// 		updateCashRegister({
// 			salesWithCredit: data.ventas,
// 			cashToRenderWithCredit: data.aRendirFisico
// 		});
// 		if (typeof window !== 'undefined') {
// 			localStorage.setItem("ventas", data.ventas);
// 			localStorage.setItem("aRendirFisico", data.aRendirFisico);
// 		}
// 		onNextTab();
// 	};

// 	return (
// 		<div className='flex flex-col'>
// 			<div className='text-right'>
// 				<Button className="w-32" onClick={handleSave}>Continuar</Button>
// 			</div>

// 			<Table className="w-full">
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead className="w-1/4">Tipo de cobro</TableHead>
// 						<TableHead className="w-1/4">Sistema</TableHead>
// 						<TableHead className="w-1/4">Físico en mano</TableHead>
// 						<TableHead className="w-1/4">Diferencia</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					<TableRow>
// 						<TableCell className="align-top" colSpan="1">
// 							<div className="font-bold">CUENTE CORRIENTE</div>
// 							{/* // 							{description && <div className="text-sm text-gray-500">{description}</div>} */}
// 						</TableCell>
// 						<TableCell className="align-top" colSpan="1">
// 							<div className="flex flex-col gap-3">
// 								{["ventas", "aRendirSistema"].map((detail, idx) => (
// 									<div key={idx} className="flex flex-col gap-1">
// 										<label className="text-sm font-medium" htmlFor={detail}>{detail.charAt(0).toUpperCase() + detail.slice(1)}</label>
// 										<Input
// 											type="number"
// 											name={detail}
// 											id={detail}
// 											min="0"
// 											step="0.01"
// 											autoFocus
// 											disabled={detail === "aRendirSistema"}
// 											value={data[detail] || ''}
// 											onChange={(e) => handleInputChange(detail, e.target.value)}
// 											required
// 											placeholder="$0.00"
// 										/>
// 									</div>
// 								))}
// 							</div>
// 						</TableCell>
// 						<TableCell className="align-bottom" colSpan="1">
// 							<div className="flex flex-col gap-2">
// 								<label className="text-sm font-medium" htmlFor="amount">A rendir</label>
// 								<Input
// 									type="number"
// 									name="amount"
// 									id="amount"
// 									min="0"
// 									step="0.01"
// 									autoFocus
// 									required
// 									value={data.aRendirFisico}
// 									onChange={(e) => handleInputChange('aRendirFisico', e.target.value)}
// 									placeholder="$0.00"
// 								/>
// 							</div>
// 						</TableCell>
// 						<TableCell className="align-bottom" colSpan="1">
// 							<div className="flex flex-col gap-2">
// 								<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
// 								<p className={`h-10 p-2 ${data.diff >= 0 ? "text-green-500" : "text-red-500"}`}>
// 									{isNaN(data.diff) ? 0 : data.diff}
// 								</p>
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }


