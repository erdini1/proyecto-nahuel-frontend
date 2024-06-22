import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCashRegister } from "@/service/cashRegisterService";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function CashRegister({ onCreated }) {
	const [cashRegisterNumber, setCashRegisterNumber] = useState('');
	const [initialAmount, setInitialAmount] = useState("");
	const [changeAmount, setChangeAmount] = useState(0);
	const [disabledButtons, setDisabledButtons] = useState(false);

	const handleCashRegisterNumberChange = (number) => {
		setCashRegisterNumber(number);
		setDisabledButtons(!disabledButtons);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = {
			cashRegisterNumber,
			initialAmount,
			changeAmount,
		};
		try {
			await createCashRegister(formData);
			// alert('Caja creada correctamente');
			onCreated();
		} catch (error) {
			console.error('Error al crear la caja:', error);
		}
	};

	return (
		<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 border">
			<h2 className="text-xl font-bold mb-4">Datos de la Caja</h2>
			<form className="grid gap-4" onSubmit={handleSubmit}>
				<div className="grid gap-2">
					<label className="text-sm font-medium" htmlFor='cashNumber'>Número de caja{/* <span className='text-red-300'> *</span> */}</label>
					<ToggleGroup type="single" className="justify-center">
						{[1, 2, 3, 4].map((num) => (
							<ToggleGroupItem
								key={num}
								value={num}
								id="cashNumber"
								variant="outline"
								className={`w-1/4 ${disabledButtons && cashRegisterNumber !== num ? 'opacity-50 ' : 'shadow'}`}
								onClick={() => handleCashRegisterNumberChange(num)}
								disabled={disabledButtons && cashRegisterNumber !== num}
								pressed={cashRegisterNumber === num}
							>
								Caja {num}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
				<div className="flex gap-1">
					<div className="grid gap-2 w-1/2">
						<label className="text-sm font-medium" htmlFor='initialAmount'>Monto inicial{/* <span className='text-red-300'> *</span> */}</label>
						<Input
							id="initialAmount"
							type="number"
							min="0"
							step="0.01"
							value={initialAmount}
							onChange={(e) => setInitialAmount(e.target.value)}
							className="p-2 border rounded"
						/>
					</div>
					<div className="grid gap-2 w-1/2">
						<label className="text-sm font-medium" htmlFor='changeAmount'>Ingreso de cambio</label>
						<Input
							id="changeAmount"
							type="number"
							min="0"
							step="0.01"
							value={changeAmount}
							onChange={(e) => setChangeAmount(e.target.value)}
							className="p-2 border rounded"
						/>
					</div>
				</div>
				<Button
					className="w-full"
					type="submit"
					disabled={cashRegisterNumber === '' || initialAmount === '' /* || changeAmount === '' */}
				>Guardar Datos Iniciales</Button>
			</form>
		</div>
	);
}
