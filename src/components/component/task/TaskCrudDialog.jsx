import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TaskCrudDialog({ isEditing, newTask, setNewTask, sectors, handleSaveTask, handleInputChange, setShowCreateDialog, filteredTasks }) {
	const [isTyping, setIsTyping] = useState(false);
	const isDuplicate = filteredTasks.some(task => task.description.toLowerCase() === newTask.description.toLowerCase());

	return (
		<Dialog open={true} onOpenChange={setShowCreateDialog}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{isEditing ? 'Actualizar Tarea' : 'Nueva Tarea'}</DialogTitle>
					<DialogDescription>
						{isEditing ? 'Actualiza los campos para modificar la tarea existente.' : 'Completa los campos para crear una nueva tarea.'}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2 relative">
						<Label htmlFor="description">Descripción</Label>
						<Input
							id="description"
							value={newTask.description}
							onChange={(e) => {
								setNewTask({ ...newTask, description: e.target.value });
								setIsTyping(true);
							}}
							onBlur={() => setIsTyping(false)}
							placeholder="Descripción de la tarea"
						/>
						{isTyping && filteredTasks.length > 0 && (
							<div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded shadow-md z-10">
								<Label className="mb-2">Tareas Similares</Label>
								<ul className="max-h-40 overflow-y-auto">
									{filteredTasks.map(task => (
										<li key={task.id} className="py-1 border-t hover:bg-gray-100/40">
											{task.description}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="sector">Sector</Label>
						<Select
							value={newTask.sector}
							onValueChange={(value) => setNewTask({ ...newTask, sector: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un sector" />
							</SelectTrigger>
							<SelectContent>
								{sectors.map(sector => (
									<SelectItem key={sector.id} value={sector.id}>
										{sector.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<label className="text-sm font-medium">Tipo</label>
						<Tabs defaultValue={newTask.type} onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}>
							<TabsList className="border w-full h-14 p-1 shadow">
								<TabsTrigger value="general" className="w-1/2 h-full">General</TabsTrigger>
								<TabsTrigger value="elaboration" className="w-1/2 h-full">Elaboración</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="submit"
						onClick={handleSaveTask}
						disabled={isEditing ? !newTask.description : !newTask.description || !newTask.sector || isDuplicate}
						className="w-1/4"
					>
						{isEditing ? 'Actualizar' : 'Crear'}
					</Button>
					<Button
						variant="outline"
						onClick={() => setShowCreateDialog(false)}
						className="w-1/4 border shadow"
					>
						Cancelar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}





// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
// 	Tooltip,
// 	TooltipContent,
// 	TooltipProvider,
// 	TooltipTrigger,
//   } from "@/components/ui/tooltip"

// export default function TaskCrudDialog({ isEditing, newTask, setNewTask, handleSaveTask, setShowCreateDialog, filteredTasks }) {
// 	const [isTyping, setIsTyping] = useState(false);
// 	const isDuplicate = filteredTasks.some(task => task.description.toLowerCase() === newTask.description.toLowerCase());

// 	return (
// 		<Dialog open={true} onOpenChange={setShowCreateDialog}>
// 			<DialogContent className="sm:max-w-[550px]">
// 				<DialogHeader>
// 					<DialogTitle>{isEditing ? 'Actualizar Tarea' : 'Nueva Tarea'}</DialogTitle>
// 					<DialogDescription>
// 						{isEditing ? 'Actualiza los campos para modificar la tarea existente.' : 'Completa los campos para crear una nueva tarea.'}
// 					</DialogDescription>
// 				</DialogHeader>
// 				<div className="grid gap-4 py-4">
// 					<div className="grid gap-2">
// 						<Label htmlFor="description">Descripción</Label>
// 						<Input
// 							id="description"
// 							value={newTask.description}
// 							onChange={(e) => {
// 								setNewTask({ ...newTask, description: e.target.value });
// 								setIsTyping(true);
// 							}}
// 							onBlur={() => setIsTyping(false)}
// 							placeholder="Descripción de la tarea"
// 						/>
// 					</div>
// 					<div className="grid gap-2">
// 						<Label htmlFor="sector">Sector</Label>
// 						<Select
// 							value={newTask.sector}
// 							onValueChange={(value) => setNewTask({ ...newTask, sector: value })}
// 						>
// 							<SelectTrigger>
// 								<SelectValue placeholder="Selecciona un sector" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								<SelectItem value="general">General</SelectItem>
// 								<SelectItem value="caja">Caja</SelectItem>
// 								<SelectItem value="polleria">Polleria</SelectItem>
// 								<SelectItem value="repositor">Repositor</SelectItem>
// 							</SelectContent>
// 						</Select>
// 					</div>
// 					{isTyping && filteredTasks.length > 0 && (
// 						<div className="grid gap-2">
// 							<Label>Tareas Similares</Label>
// 							<ul className="bg-gray-100 p-2 rounded-lg">
// 								{filteredTasks.map(task => (
// 									<li key={task.id} className="p-2 border-b last:border-0">
// 										{task.description} - {task.sector}
// 									</li>
// 								))}
// 							</ul>
// 						</div>
// 					)}
// 				</div>
// 				<DialogFooter>
// 					<Button
// 						type="submit"
// 						onClick={handleSaveTask}
// 						disabled={!newTask.description || !newTask.sector || isDuplicate}
// 						className="w-1/4"
// 					>
// 						{isEditing ? 'Actualizar' : 'Crear'}
// 					</Button>
// 					<Button
// 						variant="outline"
// 						onClick={() => setShowCreateDialog(false)}
// 						className="w-1/4 border shadow"
// 					>
// 						Cancelar
// 					</Button>
// 				</DialogFooter>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }

// -----------------

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// export default function TaskCrudDialog({ isEditing, newTask, setNewTask, handleSaveTask, setShowCreateDialog, filteredTasks }) {
// 	return (
// 		<Dialog open={true} onOpenChange={setShowCreateDialog}>
// 			<DialogContent className="sm:max-w-[550px]">
// 				<DialogHeader>
// 					<DialogTitle>{isEditing ? 'Actualizar Tarea' : 'Nueva Tarea'}</DialogTitle>
// 					<DialogDescription>
// 						{isEditing ? 'Actualiza los campos para modificar la tarea existente.' : 'Completa los campos para crear una nueva tarea.'}
// 					</DialogDescription>
// 				</DialogHeader>
// 				<div className="grid gap-4 py-4">
// 					<div className="grid gap-2">
// 						<Label htmlFor="description">Descripción</Label>
// 						<Input
// 							id="description"
// 							value={newTask.description}
// 							onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
// 							placeholder="Descripción de la tarea"
// 						/>
// 					</div>
// 					<div className="grid gap-2">
// 						<Label htmlFor="sector">Sector</Label>
// 						<Select
// 							value={newTask.sector}
// 							onValueChange={(value) => setNewTask({ ...newTask, sector: value })}
// 						>
// 							<SelectTrigger>
// 								<SelectValue placeholder="Selecciona un sector" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								<SelectItem value="general">General</SelectItem>
// 								<SelectItem value="caja">Caja</SelectItem>
// 								<SelectItem value="polleria">Polleria</SelectItem>
// 								<SelectItem value="repositor">Repositor</SelectItem>
// 							</SelectContent>
// 						</Select>
// 					</div>
// 				</div>
// 				<DialogFooter>
// 					<Button
// 						type="submit"
// 						onClick={handleSaveTask}
// 						disabled={!newTask.description || !newTask.sector}
// 						className="w-1/4"
// 					>
// 						{isEditing ? 'Actualizar' : 'Crear'}
// 					</Button>
// 					<Button
// 						variant="outline"
// 						onClick={() => setShowCreateDialog(false)}
// 						className="w-1/4 border shadow"
// 					>
// 						Cancelar
// 					</Button>
// 				</DialogFooter>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
