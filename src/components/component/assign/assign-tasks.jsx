"use client"
import { useState, useEffect } from "react";
import { getUserTasksByTaskSets } from "@/service/taskService";
import { getUsers } from "@/service/userService";
import SummaryCard from "@/components/component/SummaryCard"
import { format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { CalendarDaysIcon } from "@/components/icons";
import Spinner from "@/components/component/Spinner";
import { useToast } from "@/components/ui/use-toast";

export default function AssignTasks() {
    const [employees, setEmployees] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const [
                    userTasks,
                    employees,
                ] = await Promise.all([
                    getUserTasksByTaskSets(),
                    getUsers(),
                ]);

                setUserTasks(userTasks.filter(userTask => userTask.isActive));
                setEmployees(employees.filter((employee) => employee.role !== "admin"));
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Ocurrió un error al cargar los datos",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                    <div className="">
                        <h1 className="font-semibold text-lg">Asignación de tareas</h1>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>{format(toZonedTime(new Date(), 'America/Argentina/Ushuaia'), 'dd/MM')}</span>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
                            {employees.map((employee) => {
                                const tasksForEmployee = userTasks.filter(userTask => (userTask.User.id === employee.id));
                                const completedTasks = tasksForEmployee.filter(userTask => userTask.isCompleted).length;
                                const totalTasks = tasksForEmployee.length;

                                return (
                                    <SummaryCard
                                        key={employee.id}
                                        name={`${employee.firstName} ${employee.lastName}`}
                                        shift={tasksForEmployee[0]?.TaskSet.shift}
                                        isClosed={tasksForEmployee[0]?.TaskSet.isClosed}
                                        completedTasks={completedTasks}
                                        totalTasks={totalTasks}
                                        linkUrl={`/admin/tasks/assign/${employee.id}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
