import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { TrashIcon, CheckIcon, XIcon, FilePenIcon, ArrowLeftIcon, PlusIcon, SearchIcon } from '@/components/icons';
import { useToast } from "@/components/ui/use-toast";
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const TerminalTable = ({ data, onAdd, onEdit, onRemove, usedData }) => {
	const [terminalNumber, setTerminalNumber] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [editId, setEditId] = useState(null);
	const [editTerminalNumber, setEditTerminalNumber] = useState('');
	const [editDescription, setEditDescription] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const itemsPerPage = 10;

	const { toast } = useToast();

	const handleAdd = async () => {
		setLoading(true);
		try {
			await onAdd({ terminalNumber, description: description.toUpperCase() });
			setTerminalNumber('');
			setDescription('');
			toast({
				title: "Terminal creada",
				description: "La terminal se creó correctamente.",
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error adding item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Hubo un error al agregar la terminal.",
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
				title: "Terminal eliminada",
				description: "La terminal se eliminó correctamente.",
			});
		} catch (error) {
			console.error('Error removing item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Hubo un error al eliminar la terminal.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async (id) => {
		setLoading(true);
		try {
			await onEdit(id, { terminalNumber: editTerminalNumber, description: editDescription.toUpperCase() });
			setEditId(null);
			setEditTerminalNumber('');
			setEditDescription('');
			toast({
				title: "Terminal editada",
				description: "La terminal se editó correctamente.",
			});
		} catch (error) {
			console.error('Error editing item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Hubo un error al editar la terminal.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setEditId(null);
		setEditTerminalNumber('');
		setEditDescription('');
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
					<p className="mb-2"><span className="font-semibold">Terminales</span></p>
				</div>

				<div className="relative">
					<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[200px] bg-white"
						id="search"
						placeholder="Buscar terminal..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
							<PlusIcon className="h-4 w-4" />
							Agregar terminal
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Agregar nueva terminal</DialogTitle>
							<DialogDescription>
								Por favor ingrese el número de terminal y la descripción.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<Input
								type="text"
								placeholder="Número de terminal"
								value={terminalNumber}
								onChange={(e) => setTerminalNumber(e.target.value)}
							/>
							<Input
								type="text"
								placeholder="Descripción"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<Button onClick={handleAdd} disabled={loading || !terminalNumber || !description} className="w-full">
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
								<TableHead className="w-1/4">ID</TableHead>
								<TableHead className="w-1/2">Descripción</TableHead>
								<TableHead className="w-1/4">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentData.length === 0 ? (
								<TableRow>
									<TableCell colSpan="3" className="text-center">No se encontraron terminales</TableCell>
								</TableRow>
							) : (
								currentData.map((item, index) => (
									<TableRow key={index}>
										<TableCell className={`w-1/4 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
											{editId === item.id ? (
												<Input
													type="text"
													value={editTerminalNumber}
													onChange={(e) => setEditTerminalNumber(e.target.value)}
												/>
											) : (
												item.terminalNumber
											)}
										</TableCell>
										<TableCell className={`w-1/2 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
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
										<TableCell className={`w-1/4`}>
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
															setEditTerminalNumber(item.terminalNumber);
															setEditDescription(item.description);
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
		</div>
	);
};

export default TerminalTable;


// import React, { useState } from 'react';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { TrashIcon, CheckIcon, XIcon, FilePenIcon, ArrowLeftIcon } from '@/components/icons';
// import { useToast } from "@/components/ui/use-toast";
// import { ArrowRightIcon } from '@radix-ui/react-icons';
// import { ScrollArea } from '@/components/ui/scroll-area';

// const TerminalTable = ({ data, onAdd, onEdit, onRemove, usedData }) => {
// 	const [terminalNumber, setTerminalNumber] = useState('');
// 	const [description, setDescription] = useState('');
// 	const [loading, setLoading] = useState(false);
// 	const [editId, setEditId] = useState(null);
// 	const [editTerminalNumber, setEditTerminalNumber] = useState('');
// 	const [editDescription, setEditDescription] = useState('');
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const itemsPerPage = 10;

// 	const { toast } = useToast();

// 	const handleAdd = async () => {
// 		setLoading(true);
// 		try {
// 			await onAdd({ terminalNumber, description: description.toUpperCase() });
// 			setTerminalNumber('');
// 			setDescription('');
// 			toast({
// 				title: "Terminal creada",
// 				description: "La terminal se creó correctamente.",
// 			});
// 		} catch (error) {
// 			console.error('Error adding item:', error);
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Hubo un error al agregar la terminal.",
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
// 				title: "Terminal eliminada",
// 				description: "La terminal se eliminó correctamente.",
// 			});
// 		} catch (error) {
// 			console.error('Error removing item:', error);
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Hubo un error al eliminar la terminal.",
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleEdit = async (id) => {
// 		setLoading(true);
// 		try {
// 			await onEdit(id, { terminalNumber: editTerminalNumber, description: editDescription.toUpperCase() });
// 			setEditId(null);
// 			setEditTerminalNumber('');
// 			setEditDescription('');
// 			toast({
// 				title: "Terminal editada",
// 				description: "La terminal se editó correctamente.",
// 			});
// 		} catch (error) {
// 			console.error('Error editing item:', error);
// 			toast({
// 				variant: "destructive",
// 				title: "Error",
// 				description: "Hubo un error al editar la terminal.",
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleCancelEdit = () => {
// 		setEditId(null);
// 		setEditTerminalNumber('');
// 		setEditDescription('');
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
// 					<p className="mb-2"><span className="font-semibold">Sectores</span></p>

// 					{/* <h3 className="font-semibold text-lg">General</h3> */}
// 				</div>
// 				<Button variant="outline" onClick={() => setIsModalOpen(true)} >Agregar terminal</Button>
// 			</div>
// 			{/* <div className="flex gap-2">
// 				<Input
// 					type="text"
// 					placeholder="Número de terminal"
// 					value={terminalNumber}
// 					onChange={(e) => setTerminalNumber(e.target.value)}
// 				/>
// 				<Input
// 					type="text"
// 					placeholder="Descripción"
// 					value={description}
// 					onChange={(e) => setDescription(e.target.value)}
// 				/>
// 				<Button onClick={handleAdd} disabled={loading || !terminalNumber || !description}>
// 					{loading ? 'Agregando...' : 'Agregar'}
// 				</Button>
// 			</div> */}
// 			<div className="border shadow-sm rounded-lg mt-4 h-auto">
// 				<ScrollArea className="h-[400px]">
// 					<Table>
// 						<TableHeader>
// 							<TableRow>
// 								<TableHead className="w-1/4">Número</TableHead>
// 								<TableHead className="w-1/2">Descripción</TableHead>
// 								<TableHead className="w-1/4">Acciones</TableHead>
// 							</TableRow>
// 						</TableHeader>
// 						<TableBody>
// 							{currentData.length === 0 ? (
// 								<TableRow>
// 									<TableCell colSpan="3" className="text-center">No se encontraron terminales</TableCell>
// 								</TableRow>
// 							) : (
// 								currentData.map((item, index) => (
// 									<TableRow key={index}>
// 										<TableCell className={`w-1/4 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
// 											{editId === item.id ? (
// 												<Input
// 													type="text"
// 													value={editTerminalNumber}
// 													onChange={(e) => setEditTerminalNumber(e.target.value)}
// 												/>
// 											) : (
// 												item.terminalNumber
// 											)}
// 										</TableCell>
// 										<TableCell className={`w-1/2 ${item.isActive ? "" : "text-gray-500 line-through"}`}>
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
// 										<TableCell className={`w-1/4`}>
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
// 															setEditTerminalNumber(item.terminalNumber);
// 															setEditDescription(item.description);
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
// 				<div className="flex justify-between items-center p-4">
// 					<Button
// 						onClick={goToPreviousPage}
// 						disabled={currentPage === 1}
// 					>
// 						<ArrowLeftIcon className="h-5 w-5" />
// 					</Button>
// 					<span>Página {currentPage} de {totalPages}</span>
// 					<Button
// 						onClick={goToNextPage}
// 						disabled={currentPage === totalPages}
// 					>
// 						<ArrowRightIcon className="h-5 w-5" />
// 					</Button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default TerminalTable;
