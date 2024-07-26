import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { TrashIcon, CheckIcon, XIcon, FilePenIcon, ArrowLeftIcon, PlusIcon } from '@/components/icons';
import { useToast } from "@/components/ui/use-toast";
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SearchIcon } from 'lucide-react';

const CashBoxTable = ({ data, onAdd, onEdit, onRemove, usedData }) => {
	const [description, setDescription] = useState('');
	const [hasCheckingAccount, setHasCheckingAccount] = useState(false);
	const [loading, setLoading] = useState(false);
	const [editId, setEditId] = useState(null);
	const [editDescription, setEditDescription] = useState('');
	const [editHasCheckingAccount, setEditHasCheckingAccount] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const itemsPerPage = 10;

	const { toast } = useToast();

	const handleAdd = async () => {
		setLoading(true);
		try {
			await onAdd({ description: description.toUpperCase(), hasCheckingAccount });
			setDescription('');
			setHasCheckingAccount(false);
			toast({
				title: "Caja creada",
				description: "La caja se creó correctamente.",
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error adding item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Hubo un error al agregar la caja.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async (id) => {
		setLoading(true);
		try {
			await onRemove(id);
			toast({
				title: "Caja eliminada",
				description: "La caja se eliminó correctamente.",
			});
		} catch (error) {
			console.error('Error removing item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Hubo un error al eliminar la caja.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async (id) => {
		setLoading(true);
		try {
			await onEdit(id, { description: editDescription.toUpperCase(), hasCheckingAccount: editHasCheckingAccount });
			setEditId(null);
			setEditDescription('');
			setEditHasCheckingAccount(false);
			toast({
				title: "Caja editada",
				description: "La caja se editó correctamente.",
			});
		} catch (error) {
			console.error('Error editing item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Hubo un error al editar la caja.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setEditId(null);
		setEditDescription('');
		setEditHasCheckingAccount(false);
	};

	
	const filteredData = data.filter(d => {
		const matchesDescription = d.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesDescription;
	});
	
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	const currentData = filteredData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const goToPreviousPage = () => {
		setCurrentPage((prev) => Math.max(prev - 1, 1));
	};

	const goToNextPage = () => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	};

	return (
		<div>
			<div className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
				<div className="flex-1">
					<p className="mb-2"><span className="font-semibold">Cajas</span></p>
				</div>

				<div className="relative">
					<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[200px] bg-white"
						id="search"
						placeholder="Buscar caja..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>

				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
							<PlusIcon className="h-4 w-4" />
							Agregar caja
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Agregar nueva caja</DialogTitle>
							<DialogDescription>
								Por favor ingrese la descripción y si tiene cuenta corriente.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-6 flex flex-col">
							<Input
								type="text"
								placeholder="Descripción"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<div className="flex flex-col gap-3">
								<label className='text-sm'>
									Tiene cuenta corriente:
								</label>
								<Tabs
									value={hasCheckingAccount ? "true" : "false"}
									onValueChange={(value) => setHasCheckingAccount(value === "true")}
									className="w-full"
								>
									<TabsList className="border w-full h-14 p-1 shadow">
										<TabsTrigger value="false" className="w-1/2 h-full">No</TabsTrigger>
										<TabsTrigger value="true" className="w-1/2 h-full">Sí</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
							<Button onClick={handleAdd} disabled={loading || !description} className="w-full">
								{loading ? 'Agregando...' : 'Agregar'}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div className="border shadow-sm rounded-lg mt-4 h-[400px]">
				<ScrollArea className="h-[400px]">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-1/3">Descripción</TableHead>
								<TableHead className="w-1/3">Cuenta corriente</TableHead>
								<TableHead className="w-1/3">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentData.length === 0 ? (
								<TableRow>
									<TableCell colSpan="3" className="text-center">No se encontraron cajas</TableCell>
								</TableRow>
							) : (
								currentData.map((item, index) => (
									<TableRow key={index}>
										<TableCell className={`w-1/3 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
											{editId === item.id ? (
												<Input
													type="text"
													value={editDescription}
													onChange={(e) => setEditDescription(e.target.value)}
												/>
											) : (
												item.description
											)}
										</TableCell>
										<TableCell className={`w-1/3 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
											{editId === item.id ? (
												<Checkbox
													checked={editHasCheckingAccount}
													onCheckedChange={setEditHasCheckingAccount} // TODO: modificar esto que no me anda
												/>
											) : (
												item.hasCheckingAccount ? 'Sí' : 'No'
											)}
										</TableCell>
										<TableCell className={`w-1/3`}>
											{editId === item.id ? (
												<div className='flex gap-2'>
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleEdit(item.id)}
														className="h-8 w-8"
													>
														<CheckIcon className="h-4 w-4" />
														<span className="sr-only">Guardar</span>
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={handleCancelEdit}
														className="h-8 w-8"
													>
														<XIcon className="h-4 w-4" />
														<span className="sr-only">Cancelar</span>
													</Button>
												</div>
											) : (
												<div className='flex gap-2'>
													<Button
														variant="outline"
														size="icon"
														onClick={() => {
															setEditId(item.id);
															setEditDescription(item.description);
															setEditHasCheckingAccount(item.hasCheckingAccount);
														}}
														disabled={item.isActive === false}
														className="h-8 w-8"
													>
														<FilePenIcon className="h-4 w-4" />
														<span className="sr-only">Editar</span>
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleRemove(item.id)}
														disabled={item.isActive === false || usedData?.includes(item.id)}
														className="h-8 w-8"
													>
														<TrashIcon className="h-4 w-4" />
														<span className="sr-only">Eliminar</span>
													</Button>
												</div>
											)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</ScrollArea>
			</div>
			<div className="flex justify-between p-2">
				<Button
					variant="outline"
					size="icon"
					onClick={goToPreviousPage}
					disabled={currentPage === 1}
				>
					<ArrowLeftIcon className="h-4 w-4" />
					<span className="sr-only">Anterior</span>
				</Button>
				<span>{currentPage} de {totalPages}</span>
				<Button
					variant="outline"
					size="icon"
					onClick={goToNextPage}
					disabled={currentPage === totalPages}
				>
					<ArrowRightIcon className="h-4 w-4" />
					<span className="sr-only">Siguiente</span>
				</Button>
			</div>
		</div>
	);
};

export default CashBoxTable;


// import React, { useState } from 'react';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Checkbox } from '@/components/ui/checkbox';
// import { TrashIcon, CheckIcon, XIcon, FilePenIcon, ArrowLeftIcon, PlusIcon } from '@/components/icons';
// import { useToast } from "@/components/ui/use-toast";
// import { ArrowRightIcon } from '@radix-ui/react-icons';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// const CashBoxTable = ({ data, onAdd, onEdit, onRemove, usedData }) => {
// 	const [description, setDescription] = useState('');
// 	const [hasCheckingAccount, setHasCheckingAccount] = useState(false);
// 	const [loading, setLoading] = useState(false);
// 	const [editId, setEditId] = useState(null);
// 	const [editDescription, setEditDescription] = useState('');
// 	const [editHasCheckingAccount, setEditHasCheckingAccount] = useState(false);
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [isDialogOpen, setIsDialogOpen] = useState(false);
// 	const itemsPerPage = 10;

// 	const { toast } = useToast();

// 	const handleAdd = async () => {
// 		setLoading(true);
// 		try {
// 			await onAdd({ description: description.toUpperCase(), hasCheckingAccount });
// 			setDescription('');
// 			setHasCheckingAccount(false);
// 			toast({
// 				title: "Caja creada",
// 				description: "La caja se creó correctamente.",
// 			});
// 			setIsDialogOpen(false);
// 		} catch (error) {
// 			console.error('Error adding item:', error);
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Hubo un error al agregar la caja.",
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleRemove = async (id) => {
// 		setLoading(true);
// 		try {
// 			await onRemove(id);
// 			toast({
// 				title: "Caja eliminada",
// 				description: "La caja se eliminó correctamente.",
// 			});
// 		} catch (error) {
// 			console.error('Error removing item:', error);
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Hubo un error al eliminar la caja.",
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleEdit = async (id) => {
// 		setLoading(true);
// 		try {
// 			await onEdit(id, { description: editDescription.toUpperCase(), hasCheckingAccount: editHasCheckingAccount });
// 			setEditId(null);
// 			setEditDescription('');
// 			setEditHasCheckingAccount(false);
// 			toast({
// 				title: "Caja editada",
// 				description: "La caja se editó correctamente.",
// 			});
// 		} catch (error) {
// 			console.error('Error editing item:', error);
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Hubo un error al editar la caja.",
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleCancelEdit = () => {
// 		setEditId(null);
// 		setEditDescription('');
// 		setEditHasCheckingAccount(false);
// 	};

// 	const totalPages = Math.ceil(data.length / itemsPerPage);

// 	const currentData = data.slice(
// 		(currentPage - 1) * itemsPerPage,
// 		currentPage * itemsPerPage
// 	);

// 	const goToPreviousPage = () => {
// 		setCurrentPage((prev) => Math.max(prev - 1, 1));
// 	};

// 	const goToNextPage = () => {
// 		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
// 	};

// 	return (
// 		<div>
// 			<div className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
// 				<div className="flex-1">
// 					<p className="mb-2"><span className="font-semibold">Cajas</span></p>
// 				</div>
// 				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// 					<DialogTrigger asChild>
// 						<Button variant="outline" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
// 							<PlusIcon className="h-4 w-4" />
// 							Agregar caja
// 						</Button>
// 					</DialogTrigger>
// 					<DialogContent>
// 						<DialogHeader>
// 							<DialogTitle>Agregar nueva caja</DialogTitle>
// 							<DialogDescription>
// 								Por favor ingrese la descripción y si tiene cuenta corriente.
// 							</DialogDescription>
// 						</DialogHeader>
// 						<div className="space-y-6 flex flex-col">
// 							<Input
// 								type="text"
// 								placeholder="Descripción"
// 								value={description}
// 								onChange={(e) => setDescription(e.target.value)}
// 							/>
// 							<div className="flex flex-col gap-3">
// 								<label className='text-sm'>
// 									Tiene cuenta corriente:
// 								</label>
// 									<Tabs className="w-full" >
// 										<TabsList className="border w-full h-14 p-1 shadow">
// 											<TabsTrigger value="false" className="w-1/2 h-full">No</TabsTrigger>
// 											<TabsTrigger value="true" className="w-1/2 h-full">Si</TabsTrigger>
// 										</TabsList>
// 									</Tabs>
// 							</div>
// 							<Button onClick={handleAdd} disabled={loading || !description} className="w-full">
// 								{loading ? 'Agregando...' : 'Agregar'}
// 							</Button>
// 						</div>
// 					</DialogContent>
// 				</Dialog>
// 			</div>

// 			<div className="border shadow-sm rounded-lg mt-4 h-[400px]">
// 				<ScrollArea className="h-[400px]">
// 					<Table>
// 						<TableHeader>
// 							<TableRow>
// 								<TableHead className="w-1/3">Descripción</TableHead>
// 								<TableHead className="w-1/3">Cuenta corriente</TableHead>
// 								<TableHead className="w-1/3">Acciones</TableHead>
// 							</TableRow>
// 						</TableHeader>
// 						<TableBody>
// 							{currentData.length === 0 ? (
// 								<TableRow>
// 									<TableCell colSpan="3" className="text-center">No se encontraron cajas</TableCell>
// 								</TableRow>
// 							) : (
// 								currentData.map((item, index) => (
// 									<TableRow key={index}>
// 										<TableCell className={`w-1/3 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
// 											{editId === item.id ? (
// 												<Input
// 													type="text"
// 													value={editDescription}
// 													onChange={(e) => setEditDescription(e.target.value)}
// 												/>
// 											) : (
// 												item.description
// 											)}
// 										</TableCell>
// 										<TableCell className={`w-1/3 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
// 											{editId === item.id ? (
// 												<Checkbox
// 													checked={editHasCheckingAccount}
// 													onCheckedChange={setEditHasCheckingAccount}
// 												/>
// 											) : (
// 												item.hasCheckingAccount ? 'Sí' : 'No'
// 											)}
// 										</TableCell>
// 										<TableCell className={`w-1/3`}>
// 											{editId === item.id ? (
// 												<div className='flex gap-2'>
// 													<Button
// 														variant="outline"
// 														size="icon"
// 														onClick={() => handleEdit(item.id)}
// 														className="h-8 w-8"
// 													>
// 														<CheckIcon className="h-4 w-4" />
// 														<span className="sr-only">Guardar</span>
// 													</Button>
// 													<Button
// 														variant="outline"
// 														size="icon"
// 														onClick={handleCancelEdit}
// 														className="h-8 w-8"
// 													>
// 														<XIcon className="h-4 w-4" />
// 														<span className="sr-only">Cancelar</span>
// 													</Button>
// 												</div>
// 											) : (
// 												<div className='flex gap-2'>
// 													<Button
// 														variant="outline"
// 														size="icon"
// 														onClick={() => {
// 															setEditId(item.id);
// 															setEditDescription(item.description);
// 															setEditHasCheckingAccount(item.hasCheckingAccount);
// 														}}
// 														disabled={item.isActive === false}
// 														className="h-8 w-8"
// 													>
// 														<FilePenIcon className="h-4 w-4" />
// 														<span className="sr-only">Editar</span>
// 													</Button>
// 													<Button
// 														variant="outline"
// 														size="icon"
// 														onClick={() => handleRemove(item.id)}
// 														disabled={item.isActive === false || usedData?.includes(item.id)}
// 														className="h-8 w-8"
// 													>
// 														<TrashIcon className="h-4 w-4" />
// 														<span className="sr-only">Eliminar</span>
// 													</Button>
// 												</div>
// 											)}
// 										</TableCell>
// 									</TableRow>
// 								))
// 							)}
// 						</TableBody>
// 					</Table>
// 				</ScrollArea>
// 			</div>
// 			<div className="flex justify-between p-2">
// 				<Button
// 					variant="outline"
// 					size="icon"
// 					onClick={goToPreviousPage}
// 					disabled={currentPage === 1}
// 				>
// 					<ArrowLeftIcon className="h-4 w-4" />
// 					<span className="sr-only">Anterior</span>
// 				</Button>
// 				<span>{currentPage} de {totalPages}</span>
// 				<Button
// 					variant="outline"
// 					size="icon"
// 					onClick={goToNextPage}
// 					disabled={currentPage === totalPages}
// 				>
// 					<ArrowRightIcon className="h-4 w-4" />
// 					<span className="sr-only">Siguiente</span>
// 				</Button>
// 			</div>
// 		</div>
// 	);
// };

// export default CashBoxTable;
