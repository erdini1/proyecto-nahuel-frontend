import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon, ListPlusIcon, FilePenIcon } from '@/components/icons';
import { useToast } from "@/components/ui/use-toast"
import { createSector, deleteSector, updateSector } from '@/service/sectorService';

// TODO: Agregar validación para no poder eliminar terminales si hay transacciones asociadas
const ModalSectors = ({ sectors, onSectorsChange }) => {
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);

	const { toast } = useToast()

	const handleAdd = async () => {
		setLoading(true);
		try {
			const newSector = await createSector({
				name,
			});
			onSectorsChange([...sectors, newSector]);
			setName('');
		} catch (error) {
			console.error('Error adding terminal:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al agregar la terminal",
			})
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async (sectorId) => {
		setLoading(true);
		try {
			await deleteSector(sectorId);
			onSectorsChange(sectors.filter(sector => sector.id !== sectorId));
			toast({
				title: "Sector eliminado",
				description: "El sector fue eliminado correctamente",
			})
		} catch (error) {
			console.error('Error removing terminal:', error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Ocurrió un error al eliminar el sector",
			})
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog className="max-h-96">
			<DialogTrigger asChild>
				<Button
					variant="outline"
				>
					<ListPlusIcon className="h-4 w-4 mr-2" />
					Crear sector
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crear Sector</DialogTitle>
				</DialogHeader>
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Nuevo Sector..."
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Button onClick={handleAdd} disabled={loading || !name}>
						{loading ? 'Agregando...' : 'Agregar'}
					</Button>
				</div>
				<div className="border shadow-sm rounded-lg mt-4">
					<ScrollArea className="h-[300px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-3/4">Nombre</TableHead>
									<TableHead className="w-1/4">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sectors.length === 0 ? (
									<TableRow>
										<TableCell colSpan="2" className="text-center">No hay sectores</TableCell>
									</TableRow>
								) : (
									sectors.map((sector, index) => (
										<TableRow key={index}>
											<TableCell className="w-3/4 capitalize">{sector.name}</TableCell>
											{sector.name !== "caja" && (
												<TableCell className="w-1/4">
													<Button variant="outline" size="icon" onClick={() => handleRemove(sector.id)}>
														<TrashIcon className="h-4 w-4" />
														<span className="sr-only">Eliminar</span>
													</Button>
												</TableCell>
											)}
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</ScrollArea>
				</div>
				<DialogClose asChild>
					<Button>Cerrar</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
};

export default ModalSectors;
