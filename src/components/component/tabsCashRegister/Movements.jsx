"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getCashMovements, createCashMovement, updateCashMovement, deleteCashMovement } from "@/service/cashMovementsService";
import { getProviders } from "@/service/providerService";
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
import { translateType } from "@/helpers/movement.helper";
import Spinner from "@/components/component/Spinner";
import { FilePenIcon, TrashIcon, PlusIcon } from "@/components/icons";

export default function Movements({ cashRegisterId }) {
	const [cashMovements, setCashMovements] = useState([]);
	const [providers, setProviders] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState(null);
	const [editingMovement, setEditingMovement] = useState(null);
	const [newMovement, setNewMovement] = useState({
		type: 'payment',
		amount: '',
		providerId: '',
		cashRegisterId: ""
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const movements = await getCashMovements();
				setCashMovements(movements);

				const providers = await getProviders();
				setProviders(providers);

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
		setNewMovement({ ...newMovement, [name]: value });
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setNewMovement({
			type: 'payment',
			amount: '',
			providerId: '',
			cashRegisterId: ""
		});
		setSelectedProvider(null);
		setEditingMovement(null);
	};

	const handleSelectChange = (value) => {
		const selected = providers.find(provider => provider.id === value);
		setNewMovement({ ...newMovement, providerId: value });
		setSelectedProvider(selected);
		setOpen(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		newMovement.cashRegisterId = cashRegisterId;
		try {
			if (editingMovement) {
				await updateCashMovement(editingMovement.id, newMovement);
			} else {
				await createCashMovement(newMovement);
			}
			const movements = await getCashMovements();
			setCashMovements(movements);
			handleModalClose();
		} catch (error) {
			console.error('Error creating or updating movement:', error);
		}
	};

	const handleEdit = (movement) => {
		setEditingMovement(movement);
		setNewMovement({
			type: movement.type,
			amount: movement.amount,
			providerId: movement.Provider.id,
			cashRegisterId: movement.CashRegister.id
		});
		setSelectedProvider(movement.Provider);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		try {
			await deleteCashMovement(id);
			const movements = await getCashMovements();
			setCashMovements(movements);
		} catch (error) {
			console.error('Error deleting movement:', error);
		}
	};

	// TODO: Ver si esta bien tener el campo proveedor para los retiros 

	return (
		<div className="w-1/2 max-h-40">
			<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
				<div className="flex-1">
					<h1 className="font-semibold text-lg">Movimientos de caja</h1>
				</div>
				<div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
					<Button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-1.5 align-middle shadow"
						variant="outline"
					>
						<PlusIcon className="h-4 w-4 mr-2" />
						Cargar Movimiento
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
								<TableHead className="w-1/6">Proveedor</TableHead>
								<TableHead className="w-1/6">Hora</TableHead>
								<TableHead className="w-1/6">Monto</TableHead>
								<TableHead className="w-1/6">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cashMovements.length === 0 ? (
								<TableRow>
									<TableCell colSpan="6" className="text-center">No hay movimientos</TableCell>
								</TableRow>
							) :
								(cashMovements.map(movement => (
									<TableRow key={movement.id}>
										<TableCell className="font-medium pl-8 w-1/6">{movement.id}</TableCell>
										<TableCell className="w-1/6">{translateType(movement.type)}</TableCell>
										<TableCell className="w-1/6">{movement.Provider.name}</TableCell>
										<TableCell className="w-1/6">{movement.time}</TableCell>
										<TableCell className="w-1/6">${movement.amount}</TableCell>
										<TableCell className="w-1/6">
											<Button variant="outline" size="icon" onClick={() => handleEdit(movement)}>
												<FilePenIcon className="h-4 w-4" />
												<span className="sr-only">Modificar</span>
											</Button>
											<Button variant="outline" size="icon" onClick={() => handleDelete(movement.id)}>
												<TrashIcon className="h-4 w-4" />
												<span className="sr-only">Eliminar</span>
											</Button>
										</TableCell>
									</TableRow>
								)))}
						</TableBody>
					</Table>
				)}
			</div>
			{isModalOpen && (
				<Dialog onOpenChange={handleModalClose} open={isModalOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editingMovement ? 'Editar Movimiento' : 'Crear Nuevo Novimiento'}</DialogTitle>
							<DialogDescription>Complete el formulario para {editingMovement ? 'editar el' : 'crear un nuevo'} movimiento.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit}>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<label className="text-sm font-medium">Tipo</label>
									<Tabs defaultValue={newMovement.type} onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}>
										<TabsList className="border w-full h-14 p-1 shadow">
											<TabsTrigger value="payment" className="w-1/2 h-full">Pago</TabsTrigger>
											<TabsTrigger value="withdrawal" className="w-1/2 h-full">Retiro</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium" htmlFor="provider">Proveedor</label>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												aria-expanded={open}
												id="provider"
												className="justify-between"
											>
												{selectedProvider
													? `${selectedProvider.name}`
													: "Seleccione un proveedor..."}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-[450px] p-0">
											<Command>
												<CommandInput placeholder="Buscar proveedor..." />
												<CommandList>
													<CommandEmpty>Proveedor no encontrado</CommandEmpty>
													<CommandGroup>
														{providers.map((provider) => (
															<CommandItem
																key={provider.id}
																value={provider.id}
																onSelect={() => handleSelectChange(provider.id)}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		selectedProvider?.id === provider.id ? "opacity-100" : "opacity-0"
																	)}
																/>
																{`${provider.name}`}
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
										name="amount"
										id="amount"
										min="0"
										step="0.01"
										value={newMovement.amount}
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
									disabled={!newMovement.type || !newMovement.providerId || !newMovement.amount}
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