"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TaskCrudTable from "@/components/component/task/TaskCrudTable";
import TaskCrudDialog from "@/components/component/task/TaskCrudDialog";
import { getAllTasks, createTask, updateTask, deleteTask } from "@/service/taskService";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Spinner from "@/components/component/Spinner";
import { SearchIcon, PlusIcon } from "@/components/icons/index";
import { useToast } from "@/components/ui/use-toast";
import { getAllSectors } from "@/service/sectorService";

export default function TaskCrud() {
    const [tasks, setTasks] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newTask, setNewTask] = useState({
        id: null,
        description: "",
        sector: "",
        type: "general"
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sectorFilter, setSectorFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();

    useEffect(() => {
        const fetchTasks = async () => {
            try {

                const [
                    tasks,
                    sectors,
                ] = await Promise.all([
                    getAllTasks(),
                    getAllSectors()
                ]);

                setTasks(tasks);
                setSectors(sectors.filter(sector => sector.isActive) || []);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Ocurrió un error al mostrar las tareas",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasksBySector = useMemo(() => {
        return tasks.filter((task) => {
            const matchesDescription = task.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = sectorFilter === 'all' ? true : task.Sector.id === sectorFilter;
            return matchesDescription && matchesSector;
        });
    }, [tasks, searchQuery, sectorFilter]);

    const handleCreateTask = () => {
        setNewTask({ description: "", sector: "", type: "general" });
        setIsEditing(false);
        setShowCreateDialog(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleSaveTask = async () => {
        try {
            if (isEditing) {
                await updateTask(newTask.id, newTask);
                toast({
                    title: "Tarea actualizada",
                    description: "La tarea ha sido actualizada correctamente",
                });
            } else {
                await createTask(newTask);
                toast({
                    title: "Tarea creada",
                    description: "La tarea ha sido creada correctamente",
                });
            }
            const updatedTasks = await getAllTasks();
            setTasks(updatedTasks);
            setShowCreateDialog(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Ocurrió un error al guardar la tarea",
            });
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter((task) => task.id !== id));
            toast({
                title: "Tarea eliminada",
                description: "La tarea ha sido eliminada correctamente",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Ocurrió un error al eliminar la tarea",
            });
        }
    };

    const handleUpdateTask = (id) => {
        const taskToUpdate = tasks.find((task) => task.id === id);
        setNewTask(taskToUpdate);
        setIsEditing(true);
        setShowCreateDialog(true);
    };

    return (
        <div className="">
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                    <div className="flex-1">
                        <h1 className="font-semibold text-lg">Tareas</h1>
                    </div>
                    <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">
                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    className="pl-8 w-[150px] md:w-[200px] lg:w-[300px] bg-white"
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
                                {sectors.map(sector => (
                                    <SelectItem key={sector.id} value={sector.id} className="capitalize">
                                        {sector.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleCreateTask} className="w-full">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Crear tarea
                        </Button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : (
                        <TaskCrudTable
                            tasks={filteredTasksBySector}
                            handleUpdateTask={handleUpdateTask}
                            handleDeleteTask={handleDeleteTask}
                        />
                    )}
                </main>
            </div>
            {showCreateDialog && (
                <TaskCrudDialog
                    isEditing={isEditing}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    sectors={sectors}
                    handleSaveTask={handleSaveTask}
                    handleInputChange={handleInputChange}
                    setShowCreateDialog={setShowCreateDialog}
                    filteredTasks={tasks.filter((task) => task.description.toLowerCase().includes(newTask.description.toLowerCase())).slice(0, 3)}
                />
            )}
        </div>
    );
}
