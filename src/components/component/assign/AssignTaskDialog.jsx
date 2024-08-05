"use client";
import { useState, useMemo, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AssignTaskDialog({ isOpen, onClose, tasks, sectors, onAssignTasks }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [sectorFilter, setSectorFilter] = useState('all');

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
            setSelectedTasks([]);
        }
    }, [isOpen]);

    const filteredTasksBySector = useMemo(() => {
        return tasks.filter((task) => {
            const matchesDescription = task.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSector = sectorFilter === 'all' ? true : task.Sector.id === sectorFilter;
            return matchesDescription && matchesSector;
        });
    }, [tasks, searchTerm, sectorFilter]);

    const handleTaskSelect = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }
    };

    const handleAssignTasks = (periodicity) => {
        onAssignTasks(selectedTasks, periodicity);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Asignar Tareas</DialogTitle>
                    <DialogDescription>Seleccione tareas para asignar a un empleado.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6">
                    <div>
                        <div className="flex gap-2 mb-3">
                            <Label htmlFor="search" className="sr-only">Buscar tareas</Label>
                            <Input
                                id="search"
                                placeholder="Buscar tareas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-2 w-2/3 shadow-md"
                            />
                            <Select id="sectorFilter" value={sectorFilter} onValueChange={(value) => setSectorFilter(value)}>
                                <SelectTrigger className="w-1/3 shadow-md">
                                    <SelectValue placeholder="Filtrar por sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">- Sectores -</SelectItem>
                                    {sectors.map((sector) => (
                                        <SelectItem key={sector.id} value={sector.id}>{sector.name.charAt(0).toUpperCase() + sector.name.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                className="border shadow-md"
                                onClick={() => {
                                    if (selectedTasks.length === filteredTasksBySector.length) {
                                        setSelectedTasks([]);
                                    } else {
                                        setSelectedTasks(filteredTasksBySector.map((task) => task.id));
                                    }
                                }}
                            >
                                Seleccionar todas
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="flex justify-between items-center">Tarea <span>Sector</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <ScrollArea className="h-[300px]">
                                    {filteredTasksBySector.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan="3" className="text-center">No hay tareas para asignar</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTasksBySector.map((task) => (
                                            <TableRow key={task.id}>
                                                <div
                                                    key={task.id}
                                                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer shadow-sm"
                                                    onClick={() => handleTaskSelect(task.id)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={selectedTasks.includes(task.id)}
                                                            onCheckedChange={() => handleTaskSelect(task.id)}
                                                            className="shadow-md"
                                                        />
                                                        <TableCell colSpan="3">{task.description}</TableCell>
                                                    </div>
                                                    <TableCell>{task?.Sector.name.charAt(0).toUpperCase() + task?.Sector.name.slice(1)}</TableCell>
                                                </div>
                                            </TableRow>
                                        )))}
                                </ScrollArea>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        className="border shadow"
                        onClick={() => handleAssignTasks('daily')}
                        disabled={selectedTasks.length === 0}
                    >
                        Asignar por hoy
                    </Button>
                    <Button
                        onClick={() => handleAssignTasks('recurring')}
                        disabled={selectedTasks.length === 0}
                    >
                        Asignar regularmente
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
