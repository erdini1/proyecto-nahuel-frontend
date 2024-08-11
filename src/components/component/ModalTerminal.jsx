import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createAssociation, deleteAssociation, getAllterminals } from '@/service/terminalService';
import { CardStackIcon } from '@radix-ui/react-icons';
import { TrashIcon } from '@/components/icons';
import { useToast } from "@/components/ui/use-toast";

const ModalTerminals = ({ terminals, onTerminalsChange, cashRegisterId, cashRegisterNumber }) => {
	const [selectedOption, setSelectedOption] = useState('');
	const [loading, setLoading] = useState(false);
	const [allTerminals, setAllTerminals] = useState([]);

	const { toast } = useToast();

	useEffect(() => {
		const fetchAllTerminals = async () => {
			try {
				const terminals = await getAllterminals();
				setAllTerminals(terminals.filter(terminal => terminal.isActive));
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al obtener las terminales",
				});
			}
		};
		fetchAllTerminals();
	}, []);

	const allTerminalsFiltered = () => {
		return allTerminals.filter(terminal => terminal.description.includes("CLOVER") ? terminal.description.includes(cashRegisterNumber) : !terminal.description.includes('clover'));
	}

	const handleAdd = async () => {
		const option = allTerminalsFiltered().find(o => o.id === selectedOption);
		if (option && !terminals.some(t => t.id === option.id) && terminalsFiltered.length < 3) {
			setLoading(true);
			try {
				await createAssociation(option.id, cashRegisterId);
				onTerminalsChange([...terminals, option]);
				setSelectedOption('');
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Ocurrió un error al agregar la terminal",
				});
			} finally {
				setLoading(false);
			}
		}
	};

	const handleRemove = async (terminalId) => {
		setLoading(true);
		try {
			await deleteAssociation(terminalId, cashRegisterId);
			onTerminalsChange(terminals.filter(terminal => terminal.id !== terminalId));
			toast({
				title: "Terminal eliminada",
				description: "La terminal fue eliminada correctamente",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al eliminar la terminal",
			});
		} finally {
			setLoading(false);
		}
	};

	const availableOptions = allTerminalsFiltered().filter(
		(option) => !terminals.some((t) => t.id === option.id)
	);

	const terminalsFiltered = terminals.filter((terminal) => terminal.terminalNumber !== 'cash');

	return (
		<Dialog className="max-h-96">
			<DialogTrigger asChild>
				<Button>
					<CardStackIcon className="h-4 w-4 mr-2" />
					Seleccionar Terminales
				</Button>
			</DialogTrigger>
			<DialogContent className="from-slate-300 to-slate-400 bg-gradient-to-b">
				<DialogHeader>
					<DialogTitle>Seleccionar Terminales</DialogTitle>
				</DialogHeader>
				<div className="flex gap-2">
					<Select
						onValueChange={(val) => setSelectedOption(val)} value={selectedOption}
						disabled={loading || terminalsFiltered.length >= 3}
					>
						<SelectTrigger className="px-4 py-2 border rounded-md">
							{selectedOption ? allTerminalsFiltered().find(o => o.id === selectedOption).description : 'Seleccionar...'}
						</SelectTrigger>
						<SelectContent>
							{availableOptions.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									{option.description}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button onClick={handleAdd} disabled={!selectedOption || loading || terminalsFiltered.length >= 3}>
						{loading ? 'Agregando...' : 'Agregar'}
					</Button>
				</div>
				<div className="shadow-sm mt-4">
					<Table className="bg-[#31304D]/70">
						<TableHeader>
							<TableRow>
								<TableHead className="w-1/4 text-white">N° Terminal</TableHead>
								<TableHead className="w-1/2 text-white">Descripción</TableHead>
								<TableHead className="w-1/4 text-white">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{terminalsFiltered.length === 0 ? (
								<TableRow className="bg-[#e7e1e1]/70">
									<TableCell colSpan="3" className="text-center">No hay terminales seleccionadas</TableCell>
								</TableRow>
							) : (
								terminalsFiltered.map((terminal, index) => (
									<TableRow key={index} className="even:bg-[#e7e1e1]/70 odd:bg-[#e7e1e1]/80 backdrop-blur">
										<TableCell className="font-medium w-1/4">{terminal.terminalNumber}</TableCell>
										<TableCell className="w-1/2">{terminal.description}</TableCell>
										<TableCell className="w-1/4">
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleRemove(terminal.id)}
												className="shadow border-2 border-gray-400"
											>
												<TrashIcon className="h-4 w-4" />
												<span className="sr-only">Eliminar</span>
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
				<DialogClose asChild>
					<Button>Cerrar</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
};

export default ModalTerminals;