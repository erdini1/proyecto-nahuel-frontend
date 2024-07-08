import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AssignShift = ({ isOpen, onClose, onShiftSelect }) => {
	const [selectedOption, setSelectedOption] = useState('');
	const { toast } = useToast();

	const handleUpdate = async () => {
		try {
			setSelectedOption('');
			onShiftSelect(selectedOption);
			onClose();

			toast({
				title: "Éxito",
				description: "Turno seleccionado correctamente",
			});
		} catch (error) {
			console.error('Error al seleccionar turno:', error);
			toast({
				variant: "error",
				title: "Error",
				description: "Ocurrió un error al seleccionar el turno",
			});
		}
	};

	return (
		<Dialog open={isOpen}>
			<DialogContent className="w-[400px] h-[150px] flex flex-col gap-5 justify-center" >
				<DialogHeader >
					<DialogTitle>Seleccionar Turno</DialogTitle>
				</DialogHeader>
				<div className="flex gap-2 items-center justify-center ">
					<Select
						id="sectorFilter"
						onValueChange={(val) => setSelectedOption(val)}
						value={selectedOption}
					>
						<SelectTrigger className="w-2/3 shadow-md">
							<SelectValue placeholder="Seleccionar Turno" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Mañana">Mañana</SelectItem>
							<SelectItem value="Tarde">Tarde</SelectItem>
							<SelectItem value="Noche">Noche</SelectItem>
						</SelectContent>
					</Select>
					<Button onClick={handleUpdate} disabled={!selectedOption}>
						Guardar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AssignShift;
