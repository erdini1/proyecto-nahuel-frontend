import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function TaskCrudDialog({ isEditing, newTask, setNewTask, handleSaveTask, setShowCreateDialog }) {
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
					<div className="grid gap-2">
						<Label htmlFor="description">Descripción</Label>
						<Input
							id="description"
							value={newTask.description}
							onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
							placeholder="Descripción de la tarea"
						/>
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
								<SelectItem value="general">General</SelectItem>
								<SelectItem value="caja">Caja</SelectItem>
								<SelectItem value="polleria">Polleria</SelectItem>
								<SelectItem value="repositor">Repositor</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="submit"
						onClick={handleSaveTask}
						disabled={!newTask.description || !newTask.sector}
					>
						{isEditing ? 'Actualizar' : 'Crear'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
