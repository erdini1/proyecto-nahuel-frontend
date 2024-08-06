import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { TrashIcon, CheckIcon, XIcon, FilePenIcon, ArrowLeftIcon, PlusIcon, SearchIcon } from '@/components/icons';
import { useToast } from "@/components/ui/use-toast";
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const GeneralTable = ({ data, onAdd, onEdit, onRemove, placeholder, tableName, usedData }) => {
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [editId, setEditId] = useState(null);
	const [editName, setEditName] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [isDialogOpen, setIsDialogOpen] = useState(false); 
	const [searchTerm, setSearchTerm] = useState('');

	const itemsPerPage = 10;

	const { toast } = useToast();

	const handleAdd = async () => {
		setLoading(true);
		try {
			await onAdd({ name });
			setName('');
			toast({
				title: `${tableName === "sector" ? "Sector" : "Proveedor"} creado`,
				description: `El ${tableName} se creó correctamente.`,
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error adding item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: `Hubo un error al agregar el ${tableName}.`,
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
				title: `${tableName === "sector" ? "Sector" : "Proveedor"} eliminado`,
				description: `El ${tableName} se eliminó correctamente.`,
			});
		} catch (error) {
			console.error('Error removing item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: `Hubo un error al eliminar el ${tableName}.`,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async (id) => {
		setLoading(true);
		try {
			await onEdit(id, { name: editName });
			setEditId(null);
			setEditName('');
			toast({
				title: `${tableName === "sector" ? "Sector" : "Proveedor"} editado`,
				description: `El ${tableName} se editó correctamente.`,
			});
		} catch (error) {
			console.error('Error editing item:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: `Hubo un error al editar el ${tableName}.`,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setEditId(null);
		setEditName('');
	};

	const filteredData = data.filter(d => {
		const matchesName = d.name.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesName;
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
			<div className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 lg:px-4 md:px-2">
				<div className="flex-1">
					<p className="mb-2"><span className="font-semibold">{tableName === "sector" ? "Sectores" : "Proveedores"}</span></p>
				</div>

				<div className="relative">
					<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						className="pl-8 w-full bg-white"
						id="search"
						placeholder={`Buscar ${tableName}...`}
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>

				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 w-auto">
							<PlusIcon className="h-4 w-4" />
							Nuevo {tableName}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Agregar {tableName}</DialogTitle>
						</DialogHeader>
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder={placeholder}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<Button onClick={handleAdd} disabled={loading || !name}>
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
								<TableHead className="w-3/4 capitalize">{tableName}</TableHead>
								<TableHead className="w-1/4">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentData.length === 0 ? (
								<TableRow>
									<TableCell colSpan="2" className="text-center">No se encontraron {tableName}es</TableCell>
								</TableRow>
							) : (
								currentData.map((item, index) => (
									<TableRow key={index}>
										<TableCell className={`w-3/4 capitalize ${item.isActive ? "" : "text-gray-500 line-through"}`}>
											{editId === item.id ? (
												<Input
													type="text"
													value={editName}
													onChange={(e) => setEditName(e.target.value)}
												/>
											) : (
												item.name
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
															setEditName(item.name);
														}}
														disabled={item.name === "caja" || item.isActive === false}
														className="h-8 w-8"
													>
														<FilePenIcon className="h-4 w-4" />
														<span className="sr-only">Editar</span>
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleRemove(item.id)}
														disabled={item.name === "caja" || item.isActive === false || usedData?.includes(item.id)}
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

export default GeneralTable;