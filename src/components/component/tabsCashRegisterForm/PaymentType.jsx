import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCashMovements } from "@/service/cashMovementsService";
import { getCancellations } from "@/service/cancellationService";
import { getLastCashRegister, updateCashRegister } from '@/service/cashRegisterService';

export default function PaymentType({ name, description, details, data, onChange, onSave }) {
	const [cashMovements, setCashMovements] = useState([]);
	const [cancellations, setCancellations] = useState([]);
	const [cashRegister, setCashRegister] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cashMovementsData = await getCashMovements();
				const cancellationsData = await getCancellations();
				const cashRegisterData = await getLastCashRegister();
				setCashMovements(cashMovementsData);
				setCancellations(cancellationsData);
				setCashRegister(cashRegisterData);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	const getDetailValue = (detail) => {
		if (detail === "Ingresos") {
			let incomes = 0;
			const initialAmount = parseFloat(cashRegister.initialAmount);
			const changeAmount = parseFloat(cashRegister.changeAmount);
			if (!isNaN(initialAmount) && !isNaN(changeAmount)) {
				incomes = initialAmount + changeAmount;
			}
			return incomes;
		} else if (detail === "Retiros") {
			return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0);
		}
		return "";
	};

	const handleInputChange = (detail, value) => {
		onChange(name, detail, value);

		if (detail === "Ventas" || detail === "Ingresos" || detail === "Retiros") {
			const sales = parseFloat(data.sales || 0);
			const incomes = parseFloat(data.incomes || 0);
			const withdrawals = parseFloat(data.withdrawals || 0);
			const toRender = sales + incomes - withdrawals;
			onChange(name, "toRender", toRender.toFixed(2));
		}

		if (detail === "A rendir") {
			// Calcular y actualizar "Diferencia"
			const toRender = parseFloat(value || 0);
			const cashToRenderWithCash = parseFloat(data.toRender || 0);
			const difference = toRender - cashToRenderWithCash;
			// Actualizar "Diferencia" en el estado local (data)
			onChange(name, "difference", difference.toFixed(2));
		}
	};

	const handleSave = async () => {
		const cashRegisterData = {
			salesWithCash: parseFloat(data.sales || 0),
			cashToRenderWithCash: parseFloat(data.toRender || 0),
		};

		try {
			await updateCashRegister(cashRegister.id, cashRegisterData);
			console.log("Cash register updated successfully");
		} catch (error) {
			console.error("Failed to update cash register", error);
		}

		onSave(); // Llama a la función onSave del padre para cambiar de pestaña
	};

	return (
		<div className='flex flex-col'>
			<div className='text-right'>
				<Button className="w-32" onClick={handleSave}>Cargar</Button>
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
											value={data[detail.toLowerCase()] || getDetailValue(detail)}
											onChange={(e) => handleInputChange(detail.toLowerCase(), e.target.value)}
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
								<p className={`h-10 p-2 ${data.diferencia > 0 ? "text-red-500" : "text-green-500"}`}>
									{data.diferencia}
								</p>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}



// import { useState, useEffect } from 'react';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { getCashMovements } from "@/service/cashMovementsService";
// import { getCancellations } from "@/service/cancellationService";
// import { getLastCashRegister } from '@/service/cashRegisterService';

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
// 			let ingresos = 0;
// 			const initialAmount = parseFloat(cashRegister.initialAmount);
// 			const changeAmount = parseFloat(cashRegister.changeAmount);
// 			if (!isNaN(initialAmount) && !isNaN(changeAmount)) {
// 				ingresos = initialAmount + changeAmount;
// 			}
// 			return ingresos;
// 		} else if (detail === "Retiros") {
// 			return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0);
// 		}
// 		return "";
// 	};

// 	const handleInputChange = (detail, value) => {
// 		onChange(name, detail, value);
// 	};

// 	return (
// 		<div className='flex flex-col'>
// 			<div className='text-right'>
// 				<Button className="w-32" onClick={onSave}>Cargar</Button>
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
// 									onChange={(e) => handleInputChange('aRendir', e.target.value)}
// 									placeholder="$0.00"
// 								/>
// 							</div>
// 						</TableCell>
// 						<TableCell className="align-bottom" colSpan="1">
// 							<div className="flex flex-col gap-2">
// 								<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
// 								<p className={`h-10 p-2 ${10 > 0 ? "text-red-500" : "text-green-500"}`}>$0</p>
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }

// ----------------------------------------

// import { useState, useEffect } from 'react';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import { getCashMovements } from "@/service/cashMovementsService";
// import { getCancellations } from "@/service/cancellationService";
// import { getLastCashRegister } from '@/service/cashRegisterService';

// export default function PaymentType({ name, description, details }) {
// 	const [cashMovements, setCashMovements] = useState([]);
// 	const [cancellations, setCancellations] = useState([]);
// 	const [cashRegister, setCashRegister] = useState([]);

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				const cashMovementsData = await getCashMovements();
// 				const cancellationsData = await getCancellations();
// 				const cashRegister = await getLastCashRegister();
// 				setCashMovements(cashMovementsData);
// 				setCancellations(cancellationsData);
// 				setCashRegister(cashRegister);
// 			} catch (error) {
// 				console.error('Error fetching data:', error);
// 			}
// 		};
// 		fetchData();
// 	}, []);

// 	const getDetailValue = (detail) => {
// 		if (detail === "Ingresos") {
// 			let ingresos = 0;
// 			const initialAmount = parseFloat(cashRegister.initialAmount);
// 			const changeAmount = parseFloat(cashRegister.changeAmount);
// 			if (!isNaN(initialAmount) && !isNaN(changeAmount)) {
// 				ingresos = initialAmount + changeAmount;
// 			}
// 			return ingresos;
// 		} else if (detail === "Retiros") {
// 			return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount), 0);
// 		}
// 		return "";
// 	};

// 	return (
// 		<div className='flex flex-col'>
// 			<div className='text-right'>
// 				<Button className="w-32">Cargar</Button>

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
// 											defaultValue={getDetailValue(detail)}
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
// 									placeholder="$0.00"
// 								/>
// 							</div>
// 						</TableCell>
// 						<TableCell className="align-bottom" colSpan="1">
// 							<div className="flex flex-col gap-2">
// 								<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
// 								<p className={`h-10 p-2 ${10 > 0 ? "text-red-500" : "text-green-500"}`}>$0</p>
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// }

