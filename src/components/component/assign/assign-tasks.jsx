"use client"
import { useState, useEffect } from "react";
import { getUserTaskByTaskSet, getUserTasksByTaskSets } from "@/service/taskService";
import { getUsers } from "@/service/userService";
import SummaryCard from "@/components/component/SummaryCard"
import { format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { CalendarDaysIcon } from "@/components/icons";


export default function AssignTasks() {
    const [employees, setEmployees] = useState([]);
    const [userTasks, setUserTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userTasks = await getUserTasksByTaskSets();
                setUserTasks(userTasks.filter(userTask => userTask.isActive));

                const employees = await getUsers();
                setEmployees(employees.filter((employee) => employee.role !== "admin"));
            } catch (error) {
                console.log('Failed to fetch all tasks:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                    <div className="">
                        <h1 className="font-semibold text-lg">Asginación de tareas</h1>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>{format(toZonedTime(new Date(), 'America/Argentina/Ushuaia'), 'dd/MM')}</span>
                    </div>
                </header>
                <main className="flex gap-4 p-4 md:gap-8 md:p-6">
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
                </main>
            </div>
        </div>
    );
}



// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
// import AssignTaskDialog from "@/components/component/AssignTaskDialog";
// import AssignTaskTable from "@/components/component/AssignTaskTable";
// import { getUserTasks, getAllTasks, assignTask } from "@/service/taskService";
// import { Button } from "@/components/ui/button";
// import ProgressChecklist from "./progressChecklist";
// import { ClipboardListIcon, PlusIcon, ArrowLeftIcon, UserIcon, CalendarDaysIcon, ClockIcon } from "@/components/icons/index";
// import { useToast } from "@/components/ui/use-toast"

// export default function AssignTasks() {
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [employee, setEmployee] = useState(null);
//     const [date, setDate] = useState(new Date());
//     const [tasks, setTasks] = useState([]);
//     const [userTasks, setUserTasks] = useState([]);
//     const [filteredTasks, setFilteredTasks] = useState([]);

//     const { toast } = useToast()

//     useEffect(() => {
//         const fetchAllTasks = async () => {
//             try {
//                 const allTasks = await getAllTasks();
//                 setTasks(allTasks);
//             } catch (error) {
//                 console.log('Failed to fetch all tasks:', error);
//                 toast({
//                     variant: "destructive",
//                     title: "Error",
//                     description: "Ocurrió un error al mostrar las tareas",
//                 })
//             }
//         };
//         fetchAllTasks();
//     }, []);

//     useEffect(() => {
//         if (employee && date) {
//             fetchUserTasks();
//         }
//     }, [employee, date]);

//     useEffect(() => {
//         filterUnassignedTasks();
//     }, [tasks, userTasks]);

//     const fetchUserTasks = async () => {
//         try {
//             const formattedDate = date.toLocaleDateString('en-CA');
//             const data = await getUserTasks(formattedDate, employee.id);
//             setUserTasks(data);
//         } catch (error) {
//             console.log('Failed to fetch tasks:', error);
//             toast({
//                 variant: "destructive",
//                 title: "Error",
//                 description: "Ocurrió un error al mostrar las tareas",
//             })
//         }
//     };

//     const filterUnassignedTasks = () => {
//         const assignedTaskIds = userTasks.map(usertTask => usertTask.Task.id);
//         const unassignedTasks = tasks.filter(task => !assignedTaskIds.includes(task.id));
//         setFilteredTasks(unassignedTasks);
//     };

//     const handleOpenDialog = () => {
//         setIsDialogOpen(true);
//     };

//     const handleCloseDialog = () => {
//         setIsDialogOpen(false);
//     };

//     const handleSelection = (selectedEmployee, selectedDate) => {
//         setEmployee(selectedEmployee);
//         setDate(selectedDate);
//     };

//     const handleResetSelection = () => {
//         setEmployee(null);
//         setDate(new Date());
//         setUserTasks([]);
//     };

//     const handleAssignTasks = async (selectedTasks) => {
//         try {
//             await assignTask(selectedTasks, employee.id);
//             toast({
//                 title: "Tareas Asignadas",
//                 description: "Tareas asignadas correctamente",
//             })
//             await fetchUserTasks();
//         } catch (error) {
//             console.log('Failed to assign tasks:', error);
//         }
//         handleCloseDialog();
//     };

//     return (
//         <div className="min-h-screen">
//             {!employee ? (
//                 <div>
//                     <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 mb-5">
//                         <div className="flex-1">
//                             <h1 className="font-semibold text-lg">Tareas</h1>
//                         </div>
//                     </header>
//                     <EmployeeDateSelector onSelection={handleSelection} />
//                 </div>
//             ) : (
//                 <div className="flex flex-col">
//                     <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
//                         <Link href="#" className="lg:hidden" prefetch={false}>
//                             <ClipboardListIcon className="h-6 w-6" />
//                             <span className="sr-only">Home</span>
//                         </Link>
//                         <div className="flex-1">
//                             <h1 className="font-semibold text-lg">Tareas</h1>
//                         </div>
//                         <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
//                             <Button
//                                 onClick={handleResetSelection}
//                                 variant="outline"
//                                 className="flex items-center gap-1.5"
//                             >
//                                 <ArrowLeftIcon className="h-4 w-4" />
//                                 Seleccionar otro empleado
//                             </Button>
//                             <Button
//                                 onClick={handleOpenDialog}
//                                 className="flex items-center gap-1.5"
//                             >
//                                 <PlusIcon className="h-4 w-4 mr-2" />
//                                 Asignar Tareas
//                             </Button>
//                         </div>
//                     </header>
//                     <main className="flex gap-4 p-4 md:gap-8 md:p-6">
//                         <div className="border shadow-sm rounded-lg w-3/4">
//                             <div className="flex items-center justify-between bg-gray-100/40 px-6 py-4">
//                                 <div className="flex items-center gap-4">
//                                     <div className="font-semibold flex items-center gap-2">
//                                         <UserIcon className="h-4 w-4" />
//                                         {`${employee.firstName} ${employee.lastName}`}
//                                     </div>
//                                     <div className="text-gray-500 flex items-center gap-2">
//                                         <CalendarDaysIcon className="h-4 w-4" />
//                                         {new Date().toLocaleDateString()}
//                                     </div>
//                                     <div className="text-gray-500 flex items-center gap-2">
//                                         <ClockIcon className="h-4 w-4" />
//                                         {userTasks[0]?.shift}
//                                     </div>
//                                 </div>
//                             </div>
//                             <AssignTaskTable tasks={userTasks} />
//                         </div>
//                         <div className="w-1/4">
//                             <ProgressChecklist
//                                 tasksCompleted={userTasks.filter(task => task.isCompleted).length}
//                                 totalTasks={userTasks.length}
//                             />
//                         </div>
//                     </main>
//                     <AssignTaskDialog
//                         isOpen={isDialogOpen}
//                         onClose={handleCloseDialog}
//                         tasks={filteredTasks}
//                         onAssignTasks={handleAssignTasks}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }