import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createAssociation, deleteAssociation, getAllterminals } from '@/service/terminalService';
import { CardStackIcon } from '@radix-ui/react-icons';
import { TrashIcon } from '@/components/icons';
import { useToast } from "@/components/ui/use-toast";

const ModalTerminals = ({ terminals, onTerminalsChange, cashRegisterId }) => {
	const [selectedOption, setSelectedOption] = useState('');
	const [loading, setLoading] = useState(false);
	const [allTerminals, setAllTerminals] = useState([]);

	const { toast } = useToast();

	useEffect(() => {
		const fetchAllTerminals = async () => {
			try {
				const terminals = await getAllterminals();
				setAllTerminals(terminals);
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

	const handleAdd = async () => {
		const option = allTerminals.find(o => o.id === selectedOption);
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

	const availableOptions = allTerminals.filter(
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Seleccionar Terminales</DialogTitle>
				</DialogHeader>
				<div className="flex gap-2">
					<Select
						onValueChange={(val) => setSelectedOption(val)} value={selectedOption}
						disabled={loading || terminalsFiltered.length >= 3}
					>
						<SelectTrigger className="px-4 py-2 border rounded-md">
							{selectedOption ? allTerminals.find(o => o.id === selectedOption).description : 'Seleccionar...'}
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
				<div className="border shadow-sm rounded-lg mt-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-1/4">N° Terminal</TableHead>
								<TableHead className="w-1/2">Descripción</TableHead>
								<TableHead className="w-1/4">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{terminalsFiltered.length === 0 ? (
								<TableRow>
									<TableCell colSpan="3" className="text-center">No hay terminales seleccionadas</TableCell>
								</TableRow>
							) : (
								terminalsFiltered.map((terminal, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium w-1/4">{terminal.terminalNumber}</TableCell>
										<TableCell className="w-1/2">{terminal.description}</TableCell>
										<TableCell className="w-1/4">
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleRemove(terminal.id)}
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


// import React, { useState } from 'react';
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { createTerminal, deleteTerminal } from '@/service/terminalService';
// import { CardStackIcon } from '@radix-ui/react-icons';
// import { TrashIcon } from '@/components/icons';
// import { useToast } from "@/components/ui/use-toast"
// import { TERMINALS } from '@/constants/terminals.constant';

// // TODO: Agregar validación para no poder eliminar terminales si hay transacciones asociadas
// const ModalTerminals = ({ terminals, onTerminalsChange, cashRegisterId }) => {
// 	const [selectedOption, setSelectedOption] = useState('');
// 	const [loading, setLoading] = useState(false);

// 	const terminalOptions = TERMINALS;

// 	const { toast } = useToast()

// 	const handleAdd = async () => {
// 		const option = terminalOptions.find(o => o.terminalNumber === selectedOption);
// 		if (option && !terminals.some(t => t.terminalNumber === option.terminalNumber) && terminalsFiltered.length < 3) {
// 			setLoading(true);
// 			try {
// 				const newTerminal = await createTerminal({
// 					terminalNumber: option.terminalNumber,
// 					description: option.description,
// 					cashRegisterId: cashRegisterId
// 				});
// 				onTerminalsChange([...terminals, newTerminal]);
// 				setSelectedOption('');
// 			} catch (error) {
// 				console.error('Error adding terminal:', error);
// 				toast({
// 					variant: "destructive",
// 					title: "Error",
// 					description: "Ocurrió un error al agregar la terminal",
// 				})
// 			} finally {
// 				setLoading(false);
// 			}
// 		}
// 	};

// 	const handleRemove = async (terminalId) => {
// 		setLoading(true);
// 		try {
// 			await deleteTerminal(terminalId);
// 			onTerminalsChange(terminals.filter(terminal => terminal.id !== terminalId));
// 			toast({
// 				title: "Terminal eliminada",
// 				description: "La terminal fue eliminada correctamente",
// 			})
// 		} catch (error) {
// 			console.error('Error removing terminal:', error);
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Ocurrió un error al eliminar la terminal",
// 			})
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const availableOptions = terminalOptions.filter(
// 		(option) => !terminals.some((t) => t.description === option.description)
// 	);

// 	const terminalsFiltered = terminals.filter((terminal) => terminal.terminalNumber !== 'cash');

// 	return (
// 		<Dialog className="max-h-96">
// 			<DialogTrigger asChild>
// 				<Button>
// 					<CardStackIcon className="h-4 w-4 mr-2" />
// 					Seleccionar Terminales
// 				</Button>
// 			</DialogTrigger>
// 			<DialogContent>
// 				<DialogHeader>
// 					<DialogTitle>Seleccionar Terminales</DialogTitle>
// 				</DialogHeader>
// 				<div className="flex gap-2">
// 					<Select
// 						onValueChange={(val) => setSelectedOption(val)} value={selectedOption}
// 						disabled={loading || terminalsFiltered.length >= 3}
// 					>
// 						<SelectTrigger className="px-4 py-2 border rounded-md">
// 							{selectedOption ? terminalOptions.find(o => o.terminalNumber === selectedOption).description : 'Seleccionar...'}
// 						</SelectTrigger>
// 						<SelectContent>
// 							{availableOptions.map((option) => (
// 								<SelectItem key={option.terminalNumber} value={option.terminalNumber}>
// 									{option.description}
// 								</SelectItem>
// 							))}
// 						</SelectContent>
// 					</Select>
// 					<Button onClick={handleAdd} disabled={!selectedOption || loading || terminalsFiltered.length >= 3}>
// 						{loading ? 'Agregando...' : 'Agregar'}
// 					</Button>
// 				</div>
// 				<div className="border shadow-sm rounded-lg mt-4">
// 					<Table>
// 						<TableHeader>
// 							<TableRow>
// 								<TableHead className="w-1/4">N° Terminal</TableHead>
// 								<TableHead className="w-1/2">Descripción</TableHead>
// 								<TableHead className="w-1/4">Acciones</TableHead>
// 							</TableRow>
// 						</TableHeader>
// 						<TableBody>
// 							{terminalsFiltered.length === 0 ? (
// 								<TableRow>
// 									<TableCell colSpan="3" className="text-center">No hay terminales seleccionadas</TableCell>
// 								</TableRow>
// 							) : (
// 								terminalsFiltered.map((terminal, index) => (
// 									<TableRow key={index}>
// 										<TableCell className="font-medium w-1/4">{terminal.terminalNumber}</TableCell>
// 										<TableCell className="w-1/2">{terminal.description}</TableCell>
// 										<TableCell className="w-1/4">
// 											<Button variant="outline" size="icon" onClick={() => handleRemove(terminal.id)}>
// 												<TrashIcon className="h-4 w-4" />
// 												<span className="sr-only">Eliminar</span>
// 											</Button>
// 										</TableCell>
// 									</TableRow>
// 								))
// 							)}
// 						</TableBody>
// 					</Table>
// 				</div>
// 				<DialogClose asChild>
// 					<Button>Cerrar</Button>
// 				</DialogClose>
// 			</DialogContent>
// 		</Dialog>
// 	);
// };

// export default ModalTerminals;
