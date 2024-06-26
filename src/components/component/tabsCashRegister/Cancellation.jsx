import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { createCancellation, deleteCancellation, getCancellations, updateCancellation } from "@/service/cancellationService";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateType } from "@/helpers/cancellation.helper";
import Spinner from "@/components/component/Spinner";
import { FilePenIcon, TrashIcon, PlusIcon } from "@/components/icons";

export default function Cancellations({ terminals, cashRegisterId }) {
	const [cancellations, setCancellations] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedTerminal, setSelectedTerminal] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCancellation, setEditingCancellation] = useState(null);
	const [newCancellation, setNewCancellation] = useState({
		type: 'cancellation',
		method: '',
		amount: '',
		cashRegisterId: '',
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cancellations = await getCancellations();
				setCancellations(cancellations);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewCancellation({ ...newCancellation, [name]: value });
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setNewCancellation({
			type: 'cancellation',
			method: '',
			amount: '',
			cashRegisterId: '',
		});
		setSelectedTerminal(null);
		setEditingCancellation(null);
	};

	const handleSelectChange = (value) => {
		const selected = terminals.find(terminal => terminal.id === value);
		setNewCancellation({ ...newCancellation, method: selected.description });
		setSelectedTerminal(selected);
		setOpen(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		newCancellation.cashRegisterId = cashRegisterId;
		try {
			if (editingCancellation) {
				await updateCancellation(editingCancellation.id, newCancellation);
			} else {
				await createCancellation(newCancellation);
			}
			const cancellations = await getCancellations();
			setCancellations(cancellations);
			handleModalClose();
		} catch (error) {
			console.error('Error creating or updating cancellation:', error);
		}
	};

	const handleEdit = async (cancellation) => {
		setEditingCancellation(cancellation);
		setNewCancellation({
			type: cancellation.type,
			method: cancellation.terminalId,
			amount: cancellation.amount,
		});
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		try {
			await deleteCancellation(id);
			const cancellationsData = await getCancellations();
			setCancellations(cancellationsData);
		} catch (error) {
			console.error('Error deleting cancellation:', error);
		}
	};

	return (
		<div className="w-1/2">
			<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
				<div className="flex-1">
					<h1 className="font-semibold text-lg">Anulaciones</h1>
				</div>
				<div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
					<Button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-1.5 align-middle shadow"
						variant="outline"
					>
						<PlusIcon className="h-4 w-4 mr-2" />
						Cargar Anulación
					</Button>
				</div>
			</header>
			<div className="border shadow-sm rounded-lg">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Spinner />
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="pl-8 w-1/6">ID</TableHead>
								<TableHead className="w-1/6">Tipo</TableHead>
								<TableHead className="w-1/6">Metodo</TableHead>
								<TableHead className="w-1/6">Hora</TableHead>
								<TableHead className="w-1/6">Monto</TableHead>
								<TableHead className="w-1/6">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cancellations.length === 0 ? (
								<TableRow>
									<TableCell colSpan="6" className="text-center">No hay anulaciones</TableCell>
								</TableRow>
							) : (
								cancellations.map(cancellation => (
									<TableRow key={cancellation.id}>
										<TableCell className="font-medium pl-8 w-1/6">{cancellation.id}</TableCell>
										<TableCell className="w-1/6">{translateType(cancellation.type)}</TableCell>
										<TableCell className="w-1/6">{cancellation.method}</TableCell>
										<TableCell className="w-1/6">{cancellation.time}</TableCell>
										<TableCell className="w-1/6">${cancellation.amount}</TableCell>
										<TableCell className="w-1/6">
											<Button variant="outline" size="icon" onClick={() => handleEdit(cancellation)}>
												<FilePenIcon className="h-4 w-4" />
												<span className="sr-only">Modificar</span>
											</Button>
											<Button variant="outline" size="icon" onClick={() => handleDelete(cancellation.id)}>
												<TrashIcon className="h-4 w-4" />
												<span className="sr-only">Eliminar</span>
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				)}
			</div>
			{isModalOpen && (
				<Dialog onOpenChange={handleModalClose} open={isModalOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editingCancellation ? 'Editar Anulación' : 'Crear Nueva Anulación'}</DialogTitle>
							<DialogDescription>Complete el formulario para {editingCancellation ? 'editar la' : 'crear una nueva'} anulación.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit}>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<label className="text-sm font-medium">Tipo</label>
									<Tabs defaultValue={newCancellation.type} onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}>
										<TabsList className="border w-full h-14 p-1 shadow">
											<TabsTrigger value="cancellation" className="w-1/2 h-full">Anulación</TabsTrigger>
											<TabsTrigger value="return" className="w-1/2 h-full">Devolución</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>
								<div className="grid gap-2">
									<label className="text-sm font-medium" htmlFor="method">Metodo</label>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												aria-expanded={open}
												id="method"
												className="justify-between"
											>
												{selectedTerminal
													? `${selectedTerminal.description}`
													: "Seleccione un metodo..."}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-[450px] p-0">
											<Command>
												<CommandInput placeholder="Buscar metodo..." />
												<CommandList>
													<CommandEmpty>Metodo no encontrado</CommandEmpty>
													<CommandGroup>
														{terminals.map((terminal) => (
															<CommandItem
																key={terminal.id}
																value={terminal.id}
																onSelect={() => handleSelectChange(terminal.id)}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		selectedTerminal?.id === terminal.id ? "opacity-100" : "opacity-0"
																	)}
																/>
																{`${terminal.description}`}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</div>
								<div className="grid gap-2">
									<label className="text-sm font-medium" htmlFor="amount">Monto</label>
									<Input
										type="number"
										id="amount"
										name="amount"
										min="0"
										step="0.01"
										value={newCancellation.amount}
										onChange={handleInputChange}
										required
										placeholder="$0.00"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="submit"
									className="mt-4"
									disabled={!newCancellation.type || !newCancellation.method || !newCancellation.amount}
								>Guardar</Button>
								<Button variant="outline" onClick={handleModalClose} className="mt-4">Cancelar</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

// function FilePenIcon(props) {
// 	return (
// 		<svg
// 			{...props}
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="24"
// 			height="24"
// 			viewBox="0 0 24 24"
// 			fill="none"
// 			stroke="currentColor"
// 			strokeWidth="2"
// 			strokeLinecap="round"
// 			strokeLinejoin="round"
// 		>
// 			<path d="M12 20h9" />
// 			<path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
// 		</svg>
// 	);
// }

// function TrashIcon(props) {
// 	return (
// 		<svg
// 			{...props}
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="24"
// 			height="24"
// 			viewBox="0 0 24 24"
// 			fill="none"
// 			stroke="currentColor"
// 			strokeWidth="2"
// 			strokeLinecap="round"
// 			strokeLinejoin="round"
// 		>
// 			<polyline points="3 6 5 6 21 6" />
// 			<path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
// 			<path d="M10 11v6" />
// 			<path d="M14 11v6" />
// 			<path d="M5 6l1-2h12l1 2" />
// 		</svg>
// 	);
// }

// function PlusIcon(props) {
// 	return (
// 		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// 			<path d="M5 12h14" />
// 			<path d="M12 5v14" />
// 		</svg>
// 	);
// }


// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { createCancellation, deleteCancellation, getCancellations, updateCancellation, /* updateCancellation, deleteCancellation */ } from "@/service/cancellationService";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogDescription,
// 	DialogFooter
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getLastCashRegister } from "@/service/cashRegisterService";
// import { getTerminals } from "@/service/terminalService";

// export default function Cancellations() {
// 	const [cancellations, setCancellations] = useState([]);
// 	const [cashRegisterId, setCashRegisterId] = useState(null);
// 	const [terminals, setTerminals] = useState([]);
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [editingCancellation, setEditingCancellation] = useState(null);
// 	const [newCancellation, setNewCancellation] = useState({
// 		type: '',
// 		method: '',
// 		amount: '',
// 		cashRegisterId: '',
// 	});

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			try {
// 				const cancellations = await getCancellations();
// 				setCancellations(cancellations);

// 				const cashRegisters = await getLastCashRegister();
// 				setCashRegisterId(cashRegisters.id);

// 				const terminals = await getTerminals();
// 				setTerminals(terminals);
// 			} catch (error) {
// 				console.error('Error fetching data:', error);
// 			}
// 		};
// 		fetchData();
// 	}, []);

// 	const handleInputChange = (e) => {
// 		const { name, value } = e.target;
// 		setNewCancellation({ ...newCancellation, [name]: value });
// 	};

// 	const handleModalClose = () => {
// 		setIsModalOpen(false);
// 		setNewCancellation({
// 			type: '',
// 			method: '',
// 			amount: '',
// 			cashRegisterId: '',
// 		});
// 		setEditingCancellation(null);
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		try {
// 			if (editingCancellation) {
// 				await updateCancellation(editingCancellation.id, newCancellation);
// 			} else {
// 				newCancellation.cashRegisterId = cashRegisterId;
// 				await createCancellation(newCancellation);
// 			}
// 			const cancellationsData = await getCancellations();

// 			setCancellations(cancellationsData);
// 			handleModalClose();
// 		} catch (error) {
// 			console.error('Error creating or updating cancellation:', error);
// 		}
// 	};

// 	const handleEdit = (cancellation) => {
// 		setEditingCancellation(cancellation);
// 		setNewCancellation({
// 			type: cancellation.type,
// 			method: cancellation.method,
// 			amount: cancellation.amount,
// 		});
// 		setIsModalOpen(true);
// 	};

// 	const handleDelete = async (id) => {
// 		try {
// 			await deleteCancellation(id);
// 			const cancellationsData = await getCancellations();
// 			setCancellations(cancellationsData);
// 		} catch (error) {
// 			console.error('Error deleting cancellation:', error);
// 		}
// 	};

// 	return (
// 		<div className="w-1/2">
// 			<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
// 				<div className="flex-1">
// 					<h1 className="font-semibold text-lg">Anulaciones</h1>
// 				</div>
// 				<div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
// 					<Button
// 						onClick={() => setIsModalOpen(true)}
// 						className="flex items-center gap-1.5 align-middle"
// 					>
// 						<PlusIcon className="h-4 w-4 mr-2" />
// 						Cargar Anulación
// 					</Button>
// 				</div>
// 			</header>
// 			<div className="border shadow-sm rounded-lg">
// 				<Table>
// 					<TableHeader>
// 						<TableRow>
// 							<TableHead className="pl-8 w-1/6">ID</TableHead>
// 							<TableHead className="w-1/6">Tipo</TableHead>
// 							<TableHead className="w-1/6">Metodo</TableHead>
// 							<TableHead className="w-1/6">Hora</TableHead>
// 							<TableHead className="w-1/6">Monto</TableHead>
// 							<TableHead className="w-1/6">Acciones</TableHead>
// 						</TableRow>
// 					</TableHeader>
// 					<TableBody>
// 						{cancellations.length === 0 ? (
// 							<TableRow>
// 								<TableCell colSpan="6" className="text-center">No hay anulaciones</TableCell>
// 							</TableRow>
// 						) : (
// 							cancellations.map(cancellation => (
// 								<TableRow key={cancellation.id}>
// 									<TableCell className="font-medium pl-8 w-1/6">{cancellation.id}</TableCell>
// 									<TableCell className="w-1/6">{cancellation.type}</TableCell>
// 									<TableCell className="w-1/6">{cancellation.method}</TableCell>
// 									<TableCell className="w-1/6">{cancellation.time}</TableCell>
// 									<TableCell className="w-1/6">${cancellation.amount}</TableCell>
// 									<TableCell className="w-1/6">
// 										<Button variant="outline" size="icon" onClick={() => handleEdit(cancellation)}>
// 											<FilePenIcon className="h-4 w-4" />
// 											<span className="sr-only">Modificar</span>
// 										</Button>
// 										<Button variant="outline" size="icon" onClick={() => handleDelete(cancellation.id)}>
// 											<TrashIcon className="h-4 w-4" />
// 											<span className="sr-only">Eliminar</span>
// 										</Button>
// 									</TableCell>
// 								</TableRow>
// 							))
// 						)}
// 					</TableBody>
// 				</Table>
// 			</div>
// 			{isModalOpen && (
// 				<Dialog onOpenChange={handleModalClose} open={isModalOpen}>
// 					<DialogContent>
// 						<DialogHeader>
// 							<DialogTitle>{editingCancellation ? 'Editar Anulación' : 'Crear Nueva Anulación'}</DialogTitle>
// 							<DialogDescription>Complete el formulario para {editingCancellation ? 'editar la' : 'crear una nueva'} anulación.</DialogDescription>
// 						</DialogHeader>
// 						<form onSubmit={handleSubmit}>
// 							<div className="grid gap-4">
// 								<div className="grid gap-2">
// 									<label className="text-sm font-medium">Tipo</label>
// 									<Tabs defaultValue={newCancellation.type} onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}>
// 										<TabsList className="border w-full h-14 p-1 shadow">
// 											<TabsTrigger value="cancellation" className="w-1/2 h-full">Anulación</TabsTrigger>
// 											<TabsTrigger value="return" className="w-1/2 h-full">Devolución</TabsTrigger>
// 										</TabsList>
// 									</Tabs>
// 								</div>
// 								<div className="grid gap-2">
// 									<label className="text-sm font-medium" htmlFor="method">Metodo</label>
// 									<Input
// 										type="text"
// 										id="method"
// 										name="method"
// 										value={newCancellation.method}
// 										onChange={handleInputChange}
// 										required
// 									/>
// 								</div>
// 								<div className="grid gap-2">
// 									<label className="text-sm font-medium" htmlFor="amount">Monto</label>
// 									<Input
// 										type="number"
// 										id="amount"
// 										name="amount"
// 										min="0"
// 										step="0.01"
// 										value={newCancellation.amount}
// 										onChange={handleInputChange}
// 										required
// 									/>
// 								</div>
// 							</div>
// 							<DialogFooter>
// 								<Button variant="outline" onClick={handleModalClose} className="mt-4">Cancelar</Button>
// 								<Button
// 									type="submit"
// 									className="mt-4"
// 									disabled={!newCancellation.type || !newCancellation.method || !newCancellation.amount}
// 								>Guardar</Button>
// 							</DialogFooter>
// 						</form>
// 					</DialogContent>
// 				</Dialog>
// 			)}
// 		</div>
// 	);
// }

// function FilePenIcon(props) {
// 	return (
// 		<svg
// 			{...props}
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="24"
// 			height="24"
// 			viewBox="0 0 24 24"
// 			fill="none"
// 			stroke="currentColor"
// 			strokeWidth="2"
// 			strokeLinecap="round"
// 			strokeLinejoin="round"
// 		>
// 			<path d="M12 20h9" />
// 			<path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
// 		</svg>
// 	);
// }

// function TrashIcon(props) {
// 	return (
// 		<svg
// 			{...props}
// 			xmlns="http://www.w3.org/2000/svg"
// 			width="24"
// 			height="24"
// 			viewBox="0 0 24 24"
// 			fill="none"
// 			stroke="currentColor"
// 			strokeWidth="2"
// 			strokeLinecap="round"
// 			strokeLinejoin="round"
// 		>
// 			<polyline points="3 6 5 6 21 6" />
// 			<path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
// 			<path d="M10 11v6" />
// 			<path d="M14 11v6" />
// 			<path d="M5 6l1-2h12l1 2" />
// 		</svg>
// 	);
// }

// function PlusIcon(props) {
// 	return (
// 		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// 			<path d="M5 12h14" />
// 			<path d="M12 5v14" />
// 		</svg>
// 	);
// }
