"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TaskCrudTable from "@/components/component/TaskCrudTable";
import TaskCrudDialog from "@/components/component/TaskCrudDialog";
import { getAllTasks, createTask, updateTask, deleteTask } from "@/service/taskService";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function TaskCrud() {
    const [tasks, setTasks] = useState([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newTask, setNewTask] = useState({
        id: null,
        description: "",
        sector: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sectorFilter, setSectorFilter] = useState("all");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getAllTasks();
                setTasks(tasks);
            } catch (error) {
                console.log('Failed to fetch tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    // TODO: Hacer un buscador para no repetir tareas
    // const filteredTasks = useMemo(() => {
    //     return tasks.filter((task) => task.description.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3);
    // }, [tasks, searchQuery]);

    const filteredTasksBySector = useMemo(() => {
        return tasks.filter((task) => {
            const matchesDescription = task.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = sectorFilter === 'all' ? true : task.sector === sectorFilter;
            return matchesDescription && matchesSector;
        });
    }, [tasks, searchQuery, sectorFilter]);


    const handleCreateTask = () => {
        setNewTask({ description: "", sector: "" });
        setIsEditing(false);
        setShowCreateDialog(true);
    };

    const handleSaveTask = async () => {
        try {
            if (isEditing) {
                await updateTask(newTask.id, newTask);
                alert('Tarea actualizada');
            } else {
                await createTask(newTask);
            }
            const updatedTasks = await getAllTasks();
            setTasks(updatedTasks);
            setShowCreateDialog(false);
        } catch (error) {
            console.log('Failed to save task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter((task) => task.id !== id));
            alert('Tarea eliminada');
        } catch (error) {
            console.log('Failed to delete task:', error);
        }
    };

    const handleUpdateTask = (id) => {
        const taskToUpdate = tasks.find((task) => task.id === id);
        setNewTask(taskToUpdate);
        setIsEditing(true);
        setShowCreateDialog(true);
    };


    // TODO: Poner un desplegable para visualizar quien tiene asignada la tarea
    // TODO: Agregar paginación
    return (
        <div className="">
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                    <Link href="#" className="lg:hidden" prefetch={false}>
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
                        <Button onClick={handleCreateTask} className="w-full">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Crear tarea
                        </Button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <TaskCrudTable
                        tasks={filteredTasksBySector}
                        handleUpdateTask={handleUpdateTask}
                        handleDeleteTask={handleDeleteTask}
                    />
                </main>
            </div>
            {showCreateDialog && (
                <TaskCrudDialog
                    isEditing={isEditing}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    handleSaveTask={handleSaveTask}
                    setShowCreateDialog={setShowCreateDialog}
                />
            )}
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
            strokeLinejoin="round"
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <path d="M8 11h.01" />
            <path d="M8 16h.01" />
        </svg>
    );
}

function PlusIcon(props) {
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
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
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