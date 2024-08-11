import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCashRegister, updateCashRegister } from "@/service/cashRegisterService";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast"

export default function CashRegister({ onCreated, onUpdated, cashRegister, cashBoxes }) {
	const [initialAmount, setInitialAmount] = useState("");
	const [changeAmount, setChangeAmount] = useState("");
	const [cashBoxId, setCashBoxId] = useState(cashBoxes.length > 0 ? cashBoxes[0].id : 0);
	const [disabledButtons, setDisabledButtons] = useState(false);

	const { toast } = useToast();

	useEffect(() => {
		if (cashRegister) {
			const initialAmount = parseFloat(cashRegister.initialAmount) || 0;
			const changeAmount = parseFloat(cashRegister.changeAmount) || 0;

			setCashBoxId(cashRegister.cashBoxId);
			setDisabledButtons(true);
			setInitialAmount(initialAmount);
			setChangeAmount(changeAmount);
		}
	}, [cashRegister]);

	const handleCashBoxChange = (id) => {
		setCashBoxId(id);
		setDisabledButtons(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = {
			initialAmount,
			changeAmount: changeAmount || 0,
			cashBoxId,
		};
		try {
			if (cashRegister) {
				await updateCashRegister(cashRegister.id, formData);
				toast({
					title: "Actualizado",
					description: "Los datos del registro de caja se actualizaron correctamente",
				});
				onUpdated();
				return;
			}
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

	return (
		<div className="max-w-2xl mx-auto from-[#211f2f] to-[#211f2f]/60 bg-gradient-to-t rounded-lg shadow-md p-6 border">
			<h2 className="text-xl font-bold mb-4 text-white">Datos de la Caja</h2>
			<form className="grid gap-4" onSubmit={handleSubmit}>
				<div className="grid gap-2">
					<label className="text-sm font-medium text-white" htmlFor='cashBox'>Número de caja</label>
					<ToggleGroup type="single" className="justify-center grid grid-cols-3 gap-4">
						{cashBoxes.map((cashBox) => (
							<ToggleGroupItem
								key={cashBox.id}
								value={cashBox.id === cashBoxId}
								id="cashBox"
								variant="outline"
								className={`w-full ${disabledButtons && cashBoxId !== cashBox.id ? 'opacity-70 bg-gray-400' : 'shadow bg-white border border-gray-300 ring-orange-500 ring-offset-1 ring-2'}`}
								onClick={() => handleCashBoxChange(cashBox.id)}
							>
								{cashBox.description}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
				<div className="flex gap-1">
					<div className="grid gap-2 w-1/2">
						<label className="text-sm font-medium text-white" htmlFor='initialAmount'>Monto inicial</label>
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
						<label className="text-sm font-medium text-white" htmlFor='changeAmount'>Ingreso de cambio</label>
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
					disabled={cashBoxId === 0 || initialAmount === ""}
				>Guardar Datos Iniciales</Button>
			</form>
		</div>
	);
}