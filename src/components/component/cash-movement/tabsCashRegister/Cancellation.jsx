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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { FilePenIcon, TrashIcon, PlusIcon } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast"

export default function Cancellations({ cashRegisterId, cancellations, handleUpdateCancellations, refreshCancellations, terminals }) {
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
	const [isAccordionOpen, setIsAccordionOpen] = useState(false);

	const { toast } = useToast();

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
				toast({
					title: "Anulación actualizada",
					description: "La anulación fue actualizada correctamente",
				})
			} else {
				await createCancellation(newCancellation);
				toast({
					title: "Anulación cargada",
					description: "La anulación fue cargada correctamente",
				})
			}
			refreshCancellations();
			handleModalClose();
		} catch (error) {
			console.error('Error creating or updating cancellation:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al guardar la anulación",
			})
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
			handleUpdateCancellations(cancellations.filter(cancellation => cancellation.id !== id));
			toast({
				title: "Anulación eliminada",
				description: "La anulación fue eliminada correctamente",
			})
		} catch (error) {
			console.error('Error deleting cancellation:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al eliminar la anulación",
			})
		}
	};

	const handleAccordionToggle = () => {
		setIsAccordionOpen(prev => !prev);
	};

	return (
		<Accordion type="single" collapsible className="">
			<AccordionItem value="item-1">
				<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
					<div className="flex-grow">
						<AccordionTrigger className="w-full" onClick={handleAccordionToggle}>
							<div className="flex items-center gap-2 w-full">
								<h1 className="font-semibold text-lg">Anulaciones</h1>
							</div>
						</AccordionTrigger>
					</div>
					{isAccordionOpen && (
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
					)}
				</header>
				<AccordionContent>
					<div className="border shadow-sm rounded-lg mt-4">
						<Table className="border border-gray-200 shadow-sm bg-gray-50">
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
										<TableRow key={cancellation.id} className="odd:bg-gray-100 even:bg-white">
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

												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button variant="outline" size="icon" >
															<TrashIcon className="h-4 w-4" />
															<span className="sr-only">Eliminar</span>
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>¿Está seguro que desea eliminarla?</AlertDialogTitle>
															<AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancelar</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(cancellation.id)}
															>Continuar</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</AccordionContent>
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
										<div className="relative text-black">
											<span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">$</span>
											<Input
												type="number"
												id="amount"
												name="amount"
												min="0"
												step="0.01"
												value={newCancellation.amount}
												onChange={handleInputChange}
												placeholder="0.00"
												className="border w-full pl-5"
												required
											/>
										</div>
									</div>
								</div>
								<DialogFooter>
									<Button
										type="submit"
										className="mt-4"
										disabled={!newCancellation.type || (editingCancellation ? false : !newCancellation.method) || !newCancellation.amount}
									>Guardar</Button>
									<Button variant="outline" onClick={handleModalClose} className="mt-4">Cancelar</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				)}
			</AccordionItem>
		</Accordion >
	);
}