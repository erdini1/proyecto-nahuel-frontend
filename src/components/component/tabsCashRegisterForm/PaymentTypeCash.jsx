import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

export default function PaymentTypeCash({ cashMovements, cancellations, cashRegister, updateCashRegister, onNextTab }) {
	const [data, setData] = useState({
		ventas: 0,
		ingresos: 0,
		retiros: 0,
		aRendirSistema: 0,
		aRendirFisico: 0,
		diff: 0
	});

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const ventas = parseFloat(localStorage.getItem("ventas")) || 0;
			const aRendirFisico = parseFloat(localStorage.getItem("aRendirFisico")) || 0;
			setData(prevData => ({
				...prevData,
				ventas,
				aRendirFisico,
			}));
		}
	}, []);

	useEffect(() => {
		if (cashRegister) {
			const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
			const changeAmount = parseFloat(cashRegister.changeAmount) || 0;
			const ingresos = initialAmount + changeAmount;
			const retiros = cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0) + (cancellations.filter(cancellation => cancellation.method === 'EFECTIVO').reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

			setData(prevData => {
				const aRendirSistema = parseFloat(prevData.ventas + ingresos - retiros).toFixed(2);
				const diff = (parseFloat(prevData.aRendirFisico || 0) - aRendirSistema).toFixed(2);
				return {
					...prevData,
					ingresos,
					retiros,
					aRendirSistema,
					diff
				};
			});
		}
	}, [cashRegister, cashMovements, cancellations]);

	const handleInputChange = (detail, value) => {
		setData(prevData => {
			const newData = { ...prevData, [detail]: detail === 'aRendirFisico' && value === '' ? '' : parseFloat(value) || 0 };
			if (detail === "ventas" || detail === "ingresos" || detail === "retiros") {
				newData.aRendirSistema = (newData.ventas + newData.ingresos - newData.retiros).toFixed(2);
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
			salesWithCash: data.ventas,
			cashToRenderWithCash: data.aRendirFisico
		});
		if (typeof window !== 'undefined') {
			localStorage.setItem("ventas", data.ventas);
			localStorage.setItem("aRendirFisico", data.aRendirFisico);
		}
		onNextTab(); 
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
							<div className="font-bold">EFECTIVO</div>
							{/* // 							{description && <div className="text-sm text-gray-500">{description}</div>} */}
						</TableCell>
						<TableCell className="align-top" colSpan="1">
							<div className="flex flex-col gap-3">
								{["ventas", "ingresos", "retiros", "aRendirSistema"].map((detail, idx) => (
									<div key={idx} className="flex flex-col gap-1">
										<label className="text-sm font-medium" htmlFor={detail}>{detail.charAt(0).toUpperCase() + detail.slice(1)}</label>
										<Input
											type="number"
											name={detail}
											id={detail}
											min="0"
											step="0.01"
											autoFocus
											disabled={['ingresos', 'retiros', 'aRendirSistema'].includes(detail)}
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

// export default function PaymentTypeCash({ cashMovements, cancellations, cashRegister, updateCashRegister }) {
// 	const [data, setData] = useState({
// 		ventas: 0,
// 		ingresos: 0,
// 		retiros: 0,
// 		aRendirSistema: 0,
// 		aRendirFisico: '',
// 		diff: 0
// 	});

// 	useEffect(() => {
// 		if (cashRegister) {
// 			const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
// 			const changeAmount = parseFloat(cashRegister.changeAmount) || 0;
// 			const ingresos = initialAmount + changeAmount;
// 			const retiros = cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0) + (cancellations.filter(cancellation => cancellation.method === 'EFECTIVO').reduce((sum, cancellation) => sum + parseFloat(cancellation.amount), 0));

// 			setData(prevData => ({
// 				...prevData,
// 				ingresos,
// 				retiros,
// 				aRendirSistema: (prevData.ventas + ingresos - retiros).toFixed(2),
// 				diff: (parseFloat(prevData.aRendirFisico || 0) - (prevData.ventas + ingresos - retiros)).toFixed(2)
// 			}));
// 		}
// 	}, [cashRegister, cashMovements, cancellations]);

// 	const handleInputChange = (detail, value) => {
// 		setData(prevData => {
// 			const newData = { ...prevData, [detail]: detail === 'aRendirFisico' && value === '' ? '' : parseFloat(value) || 0 };
// 			if (detail === "ventas" || detail === "ingresos" || detail === "retiros") {
// 				newData.aRendirSistema = (newData.ventas + newData.ingresos - newData.retiros).toFixed(2);
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
// 			salesWithCash: data.ventas,
// 			cashToRenderWithCash: data.aRendirFisico
// 		});
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
// 							<div className="font-bold">EFECTIVO</div>
// 							{/* // 							{description && <div className="text-sm text-gray-500">{description}</div>} */}
// 						</TableCell>
// 						<TableCell className="align-top" colSpan="1">
// 							<div className="flex flex-col gap-3">
// 								{["ventas", "ingresos", "retiros", "aRendirSistema"].map((detail, idx) => (
// 									<div key={idx} className="flex flex-col gap-1">
// 										<label className="text-sm font-medium" htmlFor={detail}>{detail.charAt(0).toUpperCase() + detail.slice(1)}</label>
// 										<Input
// 											type="number"
// 											name={detail}
// 											id={detail}
// 											min="0"
// 											step="0.01"
// 											autoFocus
// 											disabled={['ingresos', 'retiros', 'aRendirSistema'].includes(detail)}
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


// -------------------------------

// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useEffect } from 'react';

// export default function PaymentTypeCash({ name, description, details, data, onChange, onSave, cashMovements, cancellations, cashRegister }) {

// 	useEffect(() => {
// 		const updateDetailValues = () => {
// 			if (cashRegister) {
// 				onChange(name, 'incomes', calculateIncomes());
// 				onChange(name, 'withdrawals', calculateWithdrawals());
// 			}
// 		};
// 		updateDetailValues();
// 	}, [cashRegister, cashMovements, cancellations]);

// 	const calculateIncomes = () => {
// 		const initialAmount = parseFloat(cashRegister.initialAmount);
// 		const changeAmount = parseFloat(cashRegister.changeAmount);
// 		return (!isNaN(initialAmount) && !isNaN(changeAmount)) ? initialAmount + changeAmount : 0;
// 	};

// 	const calculateWithdrawals = () => {
// 		return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0);
// 	};

// 	const handleInputChange = (detail, value) => {
// 		onChange(name, detail, value);

// 		if (detail === "ventas" || detail === "ingresos" || detail === "retiros") {
// 			const sales = parseFloat(data.sales || 0);
// 			const incomes = parseFloat(data.incomes || 0);
// 			const withdrawals = parseFloat(data.withdrawals || 0);
// 			onChange(name, "toRender", (sales + incomes - withdrawals).toFixed(2));
// 		}

// 		if (detail === "a rendir") {
// 			const toRender = parseFloat(value || 0);
// 			const cashToRenderWithCash = parseFloat(data.sales || 0) + parseFloat(data.incomes || 0) - parseFloat(data.withdrawals || 0);
// 			onChange(name, "diff", (toRender - cashToRenderWithCash).toFixed(2));
// 		}
// 	};

// 	return (
// 		<div className='flex flex-col'>
// 			<div className='text-right'>
// 				<Button className="w-32" onClick={onSave}>Continuar</Button>
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
// 							<div className="font-bold">{name.toUpperCase()}</div>
// 							{description && <div className="text-sm text-gray-500">{description}</div>}
// 						</TableCell>
// 						<TableCell className="align-top" colSpan="1">
// 							<div className="flex flex-col gap-3">
// 								{details.map((detail, idx) => (
// 									<div key={idx} className="flex flex-col gap-1">
// 										<label className={`text-sm font-medium`} htmlFor={detail}>{detail}</label>
// 										<Input
// 											type="number"
// 											name={detail}
// 											id={detail}
// 											min="0"
// 											step="0.01"
// 											autoFocus
// 											disabled={detail === "Ingresos" || detail === "Retiros" || detail === "A rendir"}
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
// 									value={data.aRendir}
// 									onChange={(e) => handleInputChange('toRender', e.target.value)}
// 									placeholder="$0.00"
// 								/>
// 							</div>
// 						</TableCell>
// 						<TableCell className="align-bottom" colSpan="1">
// 							<div className="flex flex-col gap-2">
// 								<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
// 								<p className={`h-10 p-2 ${data.diff > 0 ? "text-red-500" : "text-green-500"}`}>
// 									{data.diff}
// 								</p>
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }

// ---------------------------------------

// import { useState, useEffect } from 'react';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { getCashMovements } from "@/service/cashMovementsService";
// import { getCancellations } from "@/service/cancellationService";
// import { getLastCashRegister, updateCashRegister } from '@/service/cashRegisterService';

// // TODO: Pasar los datos desde report para no tener que traer todos los datos en cada pestaña
// export default function PaymentType({ name, description, details, data, onChange, onSave }) {
// 	const [cashMovements, setCashMovements] = useState([]);
// 	const [cancellations, setCancellations] = useState([]);
// 	const [cashRegister, setCashRegister] = useState({});

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				const cashMovementsData = await getCashMovements();
// 				const cancellationsData = await getCancellations();
// 				const cashRegisterData = await getLastCashRegister();
// 				setCashMovements(cashMovementsData);
// 				setCancellations(cancellationsData);
// 				setCashRegister(cashRegisterData);
// 			} catch (error) {
// 				console.error('Error fetching data:', error);
// 			}
// 		};
// 		fetchData();
// 	}, []);

// 	const getDetailValue = (detail) => {
// 		if (detail === "Ingresos") {
// 			let incomes = 0;
// 			const initialAmount = parseFloat(cashRegister.initialAmount);
// 			const changeAmount = parseFloat(cashRegister.changeAmount);
// 			if (!isNaN(initialAmount) && !isNaN(changeAmount)) {
// 				incomes = initialAmount + changeAmount;
// 			}
// 			return incomes;
// 		} else if (detail === "Retiros") {
// 			return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0);
// 		}
// 		return "";
// 	};

// 	const handleInputChange = (detail, value) => {
// 		onChange(name, detail, value);

// 		if (detail === "Ventas" || detail === "Ingresos" || detail === "Retiros") {
// 			const sales = parseFloat(data.sales || 0);
// 			const incomes = parseFloat(data.incomes || 0);
// 			const withdrawals = parseFloat(data.withdrawals || 0);
// 			const toRender = sales + incomes - withdrawals;
// 			onChange(name, "toRender", toRender.toFixed(2));
// 		}

// 		if (detail === "A rendir") {
// 			// Calcular y actualizar "Diferencia"
// 			const toRender = parseFloat(value || 0);
// 			const cashToRenderWithCash = parseFloat(data.toRender || 0);
// 			const difference = toRender - cashToRenderWithCash;
// 			// Actualizar "Diferencia" en el estado local (data)
// 			onChange(name, "difference", difference.toFixed(2));
// 		}
// 	};

// 	const handleSave = async () => {
// 		const cashRegisterData = {
// 			salesWithCash: parseFloat(data.sales || 0),
// 			cashToRenderWithCash: parseFloat(data.toRender || 0),
// 		};

// 		try {
// 			await updateCashRegister(cashRegister.id, cashRegisterData);
// 			console.log("Cash register updated successfully");
// 		} catch (error) {
// 			console.error("Failed to update cash register", error);
// 		}

// 		onSave();
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
// 							<div className="font-bold">{name.toUpperCase()}</div>
// 							{description && <div className="text-sm text-gray-500">{description}</div>}
// 						</TableCell>
// 						<TableCell className="align-top" colSpan="1">
// 							<div className="flex flex-col gap-3">
// 								{details.map((detail, idx) => (
// 									<div key={idx} className="flex flex-col gap-1">
// 										<label className={`text-sm font-medium`} htmlFor={detail}>{detail}</label>
// 										<Input
// 											type="number"
// 											name={detail}
// 											id={detail}
// 											min="0"
// 											step="0.01"
// 											autoFocus
// 											disabled={detail === "Ingresos" || detail === "Retiros" || detail === "A rendir"}
// 											value={data[detail.toLowerCase()] || getDetailValue(detail)}
// 											onChange={(e) => handleInputChange(detail.toLowerCase(), e.target.value)}
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
// 									value={data.aRendir}
// 									onChange={(e) => handleInputChange('toRender', e.target.value)}
// 									placeholder="$0.00"
// 								/>
// 							</div>
// 						</TableCell>
// 						<TableCell className="align-bottom" colSpan="1">
// 							<div className="flex flex-col gap-2">
// 								<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
// 								<p className={`h-10 p-2 ${data.diferencia > 0 ? "text-red-500" : "text-green-500"}`}>
// 									{data.diferencia}
// 								</p>
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }
