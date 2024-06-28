"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
import AssignTaskDialog from "@/components/component/AssignTaskDialog";
import AssignTaskTable from "@/components/component/AssignTaskTable";
import { getUserTasks, getAllTasks, assignTask } from "@/service/taskService";
import { Button } from "@/components/ui/button";
import ProgressChecklist from "./progressChecklist";
import { ClipboardListIcon, PlusIcon, ArrowLeftIcon, UserIcon, CalendarDaysIcon, ClockIcon } from "@/components/icons/index";
import { useToast } from "@/components/ui/use-toast"

export default function ArchivedTasks() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    const { toast } = useToast()

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const allTasks = await getAllTasks();
                setTasks(allTasks);
            } catch (error) {
                console.log('Failed to fetch all tasks:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Ocurrió un error al mostrar las tareas",
                })
            }
        };
        fetchAllTasks();
    }, []);

    useEffect(() => {
        if (employee && date) {
            fetchUserTasks();
        }
    }, [employee, date]);

    useEffect(() => {
        filterUnassignedTasks();
    }, [tasks, userTasks]);

    const fetchUserTasks = async () => {
        try {
            const formattedDate = date.toLocaleDateString('en-CA');
            // setDate(formattedDate);
            const data = await getUserTasks(formattedDate, employee.id);
            setUserTasks(data);
        } catch (error) {
            console.log('Failed to fetch tasks:', error);
        }
    };

    const filterUnassignedTasks = () => {
        const assignedTaskIds = userTasks.map(usertTask => usertTask.Task.id);
        const unassignedTasks = tasks.filter(task => !assignedTaskIds.includes(task.id));
        setFilteredTasks(unassignedTasks);
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleSelection = (selectedEmployee, selectedDate) => {
        setEmployee(selectedEmployee);
        setDate(selectedDate);
    };

    const handleResetSelection = () => {
        setEmployee(null);
        setDate(new Date());
        setUserTasks([]);
    };

    const handleAssignTasks = async (selectedTasks) => {
        try {
            await assignTask(selectedTasks, employee.id);
            toast({
                title: "Tareas Asignadas",
                description: "Tareas asignadas correctamente",
            })
            await fetchUserTasks();
        } catch (error) {
            console.log('Failed to assign tasks:', error);
        }
        handleCloseDialog();
    };

    // TODO: Agregar validación para que solo se pueda asignar tareas en el dia actual
    // TODO: Hacer que se pueda seleccionar todas las tareas de un sector, para que no deba ser una por una
    // TODO: Permitir eliminar tareas asignadas
    // TODO: Poner grafico de varios usuarios con el progreso o desempeño semanal de las tareas realizadas
    // TODO: Poner que no se cree una caja nueva hasta que se cierre. luego de cerrar se puede crear una nueva y sacar que solo se puede crear por dia
    // TODO: Poner que las tareas se actualicen cada 12 horas. cuando se indique un nuevo turno se actualice 
    return (
        <div className="min-h-screen">
            {!employee ? (
                <div>
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 mb-5">
                        <div className="flex-1">
                            <h1 className="font-semibold text-lg">Tareas</h1>
                        </div>
                    </header>
                    <EmployeeDateSelector onSelection={handleSelection} />
                </div>
            ) : (
                <div className="flex flex-col">
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                        <div className="flex-1">
                            <h1 className="font-semibold text-lg">Tareas</h1>
                        </div>
                        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                            <Button
                                onClick={handleResetSelection}
                                variant="outline"
                                className="flex items-center gap-1.5"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                Seleccionar otro empleado
                            </Button>
                            <Button
                                onClick={handleOpenDialog}
                                className="flex items-center gap-1.5"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Asignar Tareas
                            </Button>
                        </div>
                    </header>
                    <main className="flex gap-4 p-4 md:gap-8 md:p-6">
                        <div className="border shadow-sm rounded-lg w-3/4">
                            <div className="flex items-center justify-between bg-gray-100/40 px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="font-semibold flex items-center gap-2">
                                        <UserIcon className="h-4 w-4" />
                                        {`${employee.firstName} ${employee.lastName}`}
                                    </div>
                                    <div className="text-gray-500 flex items-center gap-2">
                                        <CalendarDaysIcon className="h-4 w-4" />
                                        {date.toLocaleDateString()}
                                    </div>
                                    <div className="text-gray-500 flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4" />
                                        {userTasks[0]?.shift}
                                    </div>
                                </div>
                            </div>
                            <AssignTaskTable tasks={userTasks} />
                        </div>
                        <div className="w-1/4">
                            <ProgressChecklist
                                tasksCompleted={userTasks.filter(task => task.isCompleted).length}
                                totalTasks={userTasks.length}
                            />
                        </div>
                    </main>
                    <AssignTaskDialog
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        tasks={filteredTasks}
                        onAssignTasks={handleAssignTasks}
                    />
                </div>
            )}
        </div>
    );
}