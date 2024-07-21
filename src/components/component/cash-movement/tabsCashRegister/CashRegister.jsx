import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCashRegister, updateCashRegister } from "@/service/cashRegisterService";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast"

export default function CashRegister({ onCreated, cashRegister }) {
	const [cashRegisterNumber, setCashRegisterNumber] = useState(0);
	const [initialAmount, setInitialAmount] = useState("");
	const [changeAmount, setChangeAmount] = useState("");
	const [disabledButtons, setDisabledButtons] = useState(false);

	const { toast } = useToast();

	useEffect(() => {
		if (cashRegister) {
			const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
			const changeAmount = parseFloat(cashRegister.changeAmount) || 0;

			setCashRegisterNumber(cashRegister.cashRegisterNumber);
			console.log('cashRegisterNumber:', cashRegisterNumber);
			setInitialAmount(initialAmount);
			setChangeAmount(changeAmount);
		}
	}, [cashRegister]);

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
			if (cashRegister) {
				console.log('Actualizando caja:', formData);
				await updateCashRegister(cashRegister.id, formData);
				toast({
					title: "Actualizado",
					description: "Los datos del registro de caja se actualizaron correctamente",
				});
				return;
			}
			console.log('Creando caja:', formData);
			await createCashRegister(formData);
			toast({
				title: "Caja creada",
				description: "La caja fue creada correctamente",
			});
			onCreated();
		} catch (error) {
			console.error('Error al crear la caja:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al crear la caja",
			});
		}
	};

	// TODO: Permitir crear nuevas cajas
	return (
		<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 border">
			<h2 className="text-xl font-bold mb-4">Datos de la Caja</h2>
			<form className="grid gap-4" onSubmit={handleSubmit}>
				<div className="grid gap-2">
					<label className="text-sm font-medium" htmlFor='cashNumber'>Número de caja</label>
					<ToggleGroup type="single" className="justify-center">
						{[1, 2, 3, 4, 5].map((num) => (
							<ToggleGroupItem
								key={num}
								value={cashRegisterNumber === num}
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
						<label className="text-sm font-medium" htmlFor='initialAmount'>Monto inicial</label>
						<div className="relative text-black">
							<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
							<Input
								id="initialAmount"
								type="number"
								min="0"
								step="0.01"
								value={initialAmount}
								placeholder="0.00"
								onChange={(e) => setInitialAmount(e.target.value)}
								className="p-2 border rounded pl-5 shadow"
							/>
						</div>
					</div>
					<div className="grid gap-2 w-1/2">
						<label className="text-sm font-medium" htmlFor='changeAmount'>Ingreso de cambio</label>
						<div className="relative text-black">
							<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
							<Input
								id="changeAmount"
								type="number"
								min="0"
								step="0.01"
								value={changeAmount}
								onChange={(e) => setChangeAmount(e.target.value)}
								className="p-2 border rounded pl-5 shadow"
								placeholder="0.00"
							/>
						</div>
					</div>
				</div>
				<Button
					className="w-full"
					type="submit"
					disabled={cashRegisterNumber === '' || initialAmount === ''}
				>Guardar Datos Iniciales</Button>
			</form>
		</div>
	);
}
