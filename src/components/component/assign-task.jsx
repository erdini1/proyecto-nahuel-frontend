"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
import AssignTaskDialog from "@/components/component/AssignTaskDialog";
import AssignTaskTable from "@/components/component/AssignTaskTable";
import { getUserTasks, getAllTasks, assignTask } from "@/service/taskService";
import { Button } from "@/components/ui/button";

export default function AssignTasks() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const allTasks = await getAllTasks();
                setTasks(allTasks);
            } catch (error) {
                console.log('Failed to fetch all tasks:', error);
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
            alert("Tareas asignadas correctamente");
            await fetchUserTasks();
        } catch (error) {
            console.log('Failed to assign tasks:', error);
        }
        handleCloseDialog();
    };

    // TODO: Agregar validación para que solo se pueda asignar tareas en el dia actual
    return (
        <div className="min-h-screen">
            {!employee ? (
                <EmployeeDateSelector onSelection={handleSelection} />
            ) : (
                <div className="flex flex-col">
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                        <Link href="#" className="lg:hidden" prefetch={false}>
                            <ClipboardListIcon className="h-6 w-6" />
                            <span className="sr-only">Home</span>
                        </Link>
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
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                        <div className="border shadow-sm rounded-lg">
                            <div className="flex items-center justify-between bg-gray-100/40 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold">{`${employee.firstName} ${employee.lastName}`}</div>
                                    <div className="text-gray-500">
                                        {date.toLocaleDateString()} - {userTasks[0]?.shift}
                                    </div>
                                </div>
                            </div>
                            <AssignTaskTable tasks={userTasks} />
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

function ClipboardListIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}

function ArrowLeftIcon(props) {
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    );
}

