"use client"
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableHead, TableRow, TableHeader, TableBody, Table } from "@/components/ui/table";
import { DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createTask, getAllTasks } from "@/service/taskService";
import { TableCell } from "@material-ui/core";


// TODO: agregar validaciones para los campos del formulario
export function TableTask() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [taskDescription, setTaskDescription] = useState('');
    const [sector, setSector] = useState('');
    const [tasks, setTasks] = useState([]);
    const [sectorFilter, setSectorFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getAllTasks();
                setTasks(tasks);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => task.description.toLowerCase().includes(taskDescription.toLowerCase())).slice(0, 3);
    }, [tasks, taskDescription]);

    const filteredTasksBySector = useMemo(() => {
        return tasks.filter((task) => {
            const matchesDescription = task.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = sectorFilter === 'all' ? true : task.sector === sectorFilter;
            return matchesDescription && matchesSector;
        });
    }, [tasks, searchQuery, sectorFilter]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newTask = {
            description: taskDescription,
            sector,
        };
        try {
            const createdTask = await createTask(newTask);
            console.log('Tarea creada:', createdTask);
            // TODO: Cambiar por un toast
            alert('Tarea creada correctamente');
            setTasks(prevTasks => [...prevTasks, createdTask]);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            alert('Error al crear la tarea. Por favor, inténtalo de nuevo.');
        }
        setTaskDescription('');
        setSector('');
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };


    // TODO: Agregar la opción para eliminar una tarea
    return (
        <div className="">
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                    <Link className="lg:hidden" href="#">
                        <ClipboardListIcon className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                    <div className="flex-1">
                        <h1 className="font-semibold text-lg">Tareas</h1>
                    </div>
                    <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">
                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
                                    placeholder="Buscar tarea..."
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                        <Select id="sectorFilter" value={sectorFilter} onValueChange={(value) => setSectorFilter(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filtrar por sector" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">- Sectores -</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="caja">Caja</SelectItem>
                                <SelectItem value="polleria">Polleria</SelectItem>
                                <SelectItem value="repositor">Repositor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleOpenDialog}>Crear Tarea</Button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="border shadow-sm rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[800px]">Descripción</TableHead>
                                    <TableHead>Sector</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasksBySector.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.description}</TableCell>
                                        <TableCell>{task.sector}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <form className="py-3" onSubmit={handleSubmit}>
                        <DialogHeader className={`py-3`}>
                            <DialogTitle>Crear Tarea</DialogTitle>
                            <DialogDescription>Complete el formulario para crear una tarea.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-3">
                                <Label htmlFor="description">Descripción</Label>
                                <div className="relative">
                                    <SearchIcon
                                        className="absolute left-2.5 top-2.5 h-5 w-4 text-gray-500" />
                                    <Input
                                        className="pl-8 "
                                        id="taskDescription"
                                        placeholder="Ingrese la descripción"
                                        type="text"
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                    />
                                </div>
                                {taskDescription ? (
                                    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-2 ">
                                        <div className="text-sm text-gray-500 mb-2">Tareas similares:</div>
                                        <ul className="space-y-1">
                                            {filteredTasks.map((task) => (
                                                <li key={task.id}>{task.description}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : ""}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sector">Sector</Label>
                                <Select id="sector" value={sector} onValueChange={(value) => setSector(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar sector" />
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
                            <div>
                                <Button variant="outline" type="button" onClick={handleCloseDialog}>Cancelar</Button>
                            </div>
                            <Button
                                disabled={!taskDescription || !sector}
                            >Crear Tarea</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ClipboardListIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <path d="M8 11h.01" />
            <path d="M8 16h.01" />
        </svg>
    );
}

function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}
