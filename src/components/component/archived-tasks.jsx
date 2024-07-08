// TODO: Poner grafico de varios usuarios con el progreso o desempeño semanal de las tareas realizadas en el dashboard
// TODO: Poner que no se cree una caja nueva hasta que se cierre. luego de cerrar se puede crear una nueva y sacar que solo se puede crear por dia

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CalendarDaysIcon } from "@/components/icons/index";
import { getUserTasksByRange } from "@/service/taskService";
import { eachDayOfInterval, format, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { Progress } from "../ui/progress";
import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
import TaskChart from "@/components/component/TaskChart";
import LineChart from "@/components/component/LineChart";
import SummaryCard from "@/components/component/SummaryCard";
import Spinner from "@/components/component/Spinner";

export default function ArchivedTasks() {
    const [employee, setEmployee] = useState(null);
    const [date, setDate] = useState({ from: null, to: null });
    const [tasks, setTasks] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelection = (selectedEmployee, selectedDate) => {
        setEmployee(selectedEmployee);
        setDate(selectedDate);
        fetchTasks(selectedEmployee.id, selectedDate);
    };

    const handleResetSelection = () => {
        setEmployee(null);
        setDate({ from: null, to: null });
        setTasks([]);
        setChartData([]);
        setIsLoading(false);
    };

    const fetchTasks = async (employeeId, dateRange) => {
        setIsLoading(true);
        const { from, to } = dateRange;
        const allUserTasks = await getUserTasksByRange(employeeId, from, to);
        const userTasks = allUserTasks.filter(task => task.isActive);
        const timeZone = 'America/Argentina/Ushuaia';

        const formattedTasks = userTasks.map(task => {
            const createdAtZoned = toZonedTime(task.createdAt, timeZone);
            return {
                id: task.id,
                title: task.Task.description,
                shift: task.TaskSet.shift,
                completed: task.isCompleted,
                isClosed: task.TaskSet.isClosed,
                date: format(createdAtZoned, 'yyyy-MM-dd'),
                displayDate: format(createdAtZoned, 'dd/MM'),
            };
        });

        setTasks(formattedTasks);
        processChartData(formattedTasks, from, to);
        setIsLoading(false);
    };

    const processChartData = (tasks, from, to) => {
        const completedTasks = tasks.filter(task => task.completed);
        const incompleteTasks = tasks.filter(task => !task.completed);

        const dates = eachDayOfInterval({ start: new Date(from), end: new Date(to) }).map(date =>
            format(toZonedTime(date, 'America/Argentina/Ushuaia'), 'yyyy-MM-dd')
        );

        const chartData = dates.map(date => {
            return {
                date: format(toZonedTime(date, 'America/Argentina/Ushuaia'), 'dd/MM'),
                completadas_mañana: completedTasks.filter(task => task.date === date && task.shift === 'Mañana').length,
                incompletas_mañana: incompleteTasks.filter(task => task.date === date && task.shift === 'Mañana').length,
                completadas_tarde: completedTasks.filter(task => task.date === date && task.shift === 'Tarde').length,
                incompletas_tarde: incompleteTasks.filter(task => task.date === date && task.shift === 'Tarde').length,
                completadas_noche: completedTasks.filter(task => task.date === date && task.shift === 'Noche').length,
                incompletas_noche: incompleteTasks.filter(task => task.date === date && task.shift === 'Noche').length,
            };
        });

        setChartData(chartData);
    };

    const groupedTasksByDateAndShift = tasks.reduce((acc, task) => {
        const key = `${task.displayDate}-${task.shift}`;
        if (!acc[key]) {
            acc[key] = { completadas: [], incompletas: [], shift: task.shift, displayDate: task.displayDate, isClosed: task.isClosed };
        }
        if (task.completed) {
            acc[key].completadas.push(task);
        } else {
            acc[key].incompletas.push(task);
        }
        return acc;
    }, {});

    const percentage = Object.keys(groupedTasksByDateAndShift).reduce((acc, key) => {
        const group = groupedTasksByDateAndShift[key];
        return acc + ((group.completadas.length / (group.completadas.length + group.incompletas.length)) * 100);
    }, 0) / Object.keys(groupedTasksByDateAndShift).length;

    return (
        <div className="min-h-screen">
            {!employee ? (
                <div>
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 mb-5">
                        <div className="flex-1">
                            <h1 className="font-semibold text-lg">Historial de Tareas</h1>
                        </div>
                    </header>
                    <EmployeeDateSelector onSelection={handleSelection} />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                        <div className="flex-1">
                            <h1 className="font-semibold text-lg">Historial de Tareas</h1>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <CalendarDaysIcon className="h-4 w-4" />
                                    <span>{format(date.from, 'd/MM', { locale: es })} - {format(date.to, 'd/MM', { locale: es })}</span>
                                </div>
                            </div>
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
                        </div>
                    </header>
                    <main className="flex gap-8 p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center w-full">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="flex flex-col gap-4 row-span-12 ">
                                    <div className="bg-card rounded-lg border p-6 shadow-md">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h2 className="text-xl font-bold">Desempeño de {employee.firstName} {employee.lastName}</h2>
                                                <p className="text-sm text-gray-400 mb-2">(Dentro del rango indicado)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-4xl font-bold">
                                                {Math.round(percentage || 0)}%
                                            </div>
                                            <Progress value={
                                                Math.round((percentage || 0))
                                            } className="flex-1 ml-6 border" />
                                        </div>
                                    </div>
                                    {/* <LineChart data={chartData} /> */}
                                    <TaskChart data={chartData} />
                                </div>
                                {Object.keys(groupedTasksByDateAndShift).length === 0 && (
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="bg-card rounded-lg border p-6 shadow-md">
                                            <h2 className="text-xl font-bold">No hay tareas para mostrar</h2>
                                        </div>
                                    </div>
                                )}
                                <div className={`${Object.keys(groupedTasksByDateAndShift).length > 3 ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"} gap-4 w-full`}>
                                    {Object.keys(groupedTasksByDateAndShift).map(key => {
                                        const group = groupedTasksByDateAndShift[key];
                                        const completedTasks = group.completadas.length;
                                        const incompleteTasks = group.incompletas.length;
                                        const totalTasks = completedTasks + incompleteTasks;

                                        const parsedDate = parse(group.displayDate, 'dd/MM', new Date());
                                        const formattedDate = format(parsedDate, 'yyyy-MM-dd');

                                        return (
                                            <SummaryCard
                                                key={key}
                                                name={`${group.displayDate}`}
                                                shift={group.shift}
                                                isClosed={group.isClosed}
                                                completedTasks={completedTasks}
                                                totalTasks={totalTasks}
                                                linkUrl={`/admin/tasks/archived/${employee.id}?date=${formattedDate}&shift=${group.shift}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
}


// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowLeftIcon, CalendarDaysIcon } from "@/components/icons/index";
// import { getUserTasksByRange } from "@/service/taskService";
// import { eachDayOfInterval, format, parse } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';
// import { es } from 'date-fns/locale';
// import { Progress } from "../ui/progress";
// import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
// import TaskChart from "@/components/component/TaskChart";
// import LineChart from "@/components/component/LineChart";
// import SummaryCard from "@/components/component/SummaryCard";
// import Spinner from "@/components/component/Spinner";

// // TODO: Agregar isLoading
// export default function ArchivedTasks() {
//     const [employee, setEmployee] = useState(null);
//     const [date, setDate] = useState({ from: null, to: null });
//     const [tasks, setTasks] = useState([]);
//     const [chartData, setChartData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSelection = (selectedEmployee, selectedDate) => {
//         setEmployee(selectedEmployee);
//         setDate(selectedDate);
//         fetchTasks(selectedEmployee.id, selectedDate);
//     };

//     const handleResetSelection = () => {
//         setEmployee(null);
//         setDate({ from: null, to: null });
//         setTasks([]);
//         setChartData([]);
//         setIsLoading(false);
//     };

//     const fetchTasks = async (employeeId, dateRange) => {
//         setIsLoading(true);
//         const { from, to } = dateRange;
//         const allUserTasks = await getUserTasksByRange(employeeId, from, to);
//         const userTasks = allUserTasks.filter(task => task.isActive);
//         const timeZone = 'America/Argentina/Ushuaia';

//         const formattedTasks = userTasks.map(task => {
//             const createdAtZoned = toZonedTime(task.createdAt, timeZone);
//             console.log(task)
//             return {
//                 id: task.id,
//                 title: task.Task.description,
//                 shift: task.TaskSet.shift,
//                 completed: task.isCompleted,
//                 taskSetId: task.TaskSet.id,
//                 date: format(createdAtZoned, 'yyyy-MM-dd'),
//                 displayDate: format(createdAtZoned, 'dd/MM'),
//             };
//         });

//         setTasks(formattedTasks);
//         processChartData(formattedTasks, from, to);
//         setIsLoading(false);
//     };

//     const processChartData = (tasks, from, to) => {
//         const completedTasks = tasks.filter(task => task.completed);
//         const incompleteTasks = tasks.filter(task => !task.completed);

//         const dates = eachDayOfInterval({ start: new Date(from), end: new Date(to) }).map(date =>
//             format(toZonedTime(date, 'America/Argentina/Ushuaia'), 'yyyy-MM-dd')
//         );

//         const chartData = dates.map(date => ({
//             date: format(toZonedTime(date, 'America/Argentina/Ushuaia'), 'dd/MM'),
//             completadas: completedTasks.filter(task => task.date === date).length,
//             incompletas: incompleteTasks.filter(task => task.date === date).length,
//         }));

//         setChartData(chartData);
//     };

//     const groupedTasksByDate = tasks.reduce((acc, task) => {
//         if (!acc[task.displayDate]) {
//             acc[task.displayDate] = { completadas: [], incompletas: [] };
//         }
//         if (task.completed) {
//             acc[task.displayDate].completadas.push(task);
//         } else {
//             acc[task.displayDate].incompletas.push(task);
//         }
//         return acc;
//     }, {});

//     const percentage = Object.keys(groupedTasksByDate).reduce((acc, date) => acc + ((groupedTasksByDate[date].completadas.length / (groupedTasksByDate[date].completadas.length + groupedTasksByDate[date].incompletas.length)) * 100), 0) / Object.keys(groupedTasksByDate).length;

//     return (
//         <div className="min-h-screen">
//             {!employee ? (
//                 <div>
//                     <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 mb-5">
//                         <div className="flex-1">
//                             <h1 className="font-semibold text-lg">Historial de Tareas</h1>
//                         </div>
//                     </header>
//                     <EmployeeDateSelector onSelection={handleSelection} />
//                 </div>
//             ) : (
//                 <div className="flex flex-col w-full">
//                     <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
//                         <div className="flex-1">
//                             <h1 className="font-semibold text-lg">Historial de Tareas</h1>
//                         </div>
//                         <div className="grid grid-cols-[1fr_auto] items-center gap-4">
//                             <div className="flex items-center gap-4">
//                                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                                     <CalendarDaysIcon className="h-4 w-4" />
//                                     <span>{format(date.from, 'd/MM', { locale: es })} - {format(date.to, 'd/MM', { locale: es })}</span>
//                                 </div>
//                             </div>
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
//                         </div>
//                     </header>
//                     <main className="flex gap-8 p-6">
//                         {isLoading ? (
//                             <div className="flex justify-center items-center w-full">
//                                 <Spinner />
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-2 gap-4 w-full">
//                                 <div className="flex flex-col gap-4">
//                                     <div className="bg-card rounded-lg border p-6 shadow-md">
//                                         <div className="flex justify-between items-center">
//                                             <div>
//                                                 <h2 className="text-xl font-bold">Desempeño de {employee.firstName} {employee.lastName}</h2>
//                                                 <p className="text-sm text-gray-400 mb-2">(Dentro del rango indicado)</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center justify-between">
//                                             <div className="text-4xl font-bold">
//                                                 {Math.round(percentage || 0)}%
//                                             </div>
//                                             <Progress value={
//                                                 Math.round((percentage || 0))
//                                             } className="flex-1 ml-6 border" />
//                                         </div>
//                                     </div>
//                                     {/* <LineChart data={chartData} /> */}
//                                     <TaskChart data={chartData} />
//                                 </div>
//                                 {Object.keys(groupedTasksByDate).length === 0 && (
//                                     <div className="flex flex-col gap-4 w-full">
//                                         <div className="bg-card rounded-lg border p-6 shadow-md">
//                                             <h2 className="text-xl font-bold">No hay tareas para mostrar</h2>
//                                         </div>
//                                     </div>
//                                 )}
//                                 <div className={`${Object.keys(groupedTasksByDate).length > 3 ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"} gap-4 w-full`}>
//                                     {Object.keys(groupedTasksByDate).map(date => {
//                                         const completedTasks = groupedTasksByDate[date].completadas.length;
//                                         const incompleteTasks = groupedTasksByDate[date].incompletas.length;
//                                         const totalTasks = completedTasks + incompleteTasks;

//                                         console.log('groupedTasksByDate completadas', groupedTasksByDate[date].completadas)
//                                         console.log('groupedTasksByDate incompletas', groupedTasksByDate[date].incompletas)

//                                         const parsedDate = parse(date, 'dd/MM', new Date());
//                                         const formattedDate = format(parsedDate, 'yyyy-MM-dd');

//                                         return (
//                                             <SummaryCard
//                                                 key={date}
//                                                 name={date}
//                                                 shift={groupedTasksByDate[date].completadas[0]?.shift || groupedTasksByDate[date].incompletas[0]?.shift || 'Sin turno'}
//                                                 completedTasks={completedTasks}
//                                                 totalTasks={totalTasks}
//                                                 linkUrl={`/admin/tasks/archived/${employee.id}?date=${formattedDate}`}
//                                             />
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         )}
//                     </main>
//                 </div>
//             )}
//         </div>
//     );
// }

// TODO: NO BORRAR ESTE CODIGO - muestra 1 card con la cantidad de tareas completadas e incompletas - 2
// "use client";
// import { useState } from "react";
// import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
// import { Button } from "@/components/ui/button";
// import { ArrowLeftIcon, CheckIcon, XIcon } from "@/components/icons/index";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import TaskChart from "@/components/component/TaskChart";
// import { getUserTasksByRange } from "@/service/taskService";
// import { eachDayOfInterval, format } from 'date-fns';

// export default function ArchivedTasks() {
//     const [employee, setEmployee] = useState(null);
//     const [date, setDate] = useState({ from: null, to: null });
//     const [tasks, setTasks] = useState([]);
//     const [chartData, setChartData] = useState([]);

//     const handleSelection = (selectedEmployee, selectedDate) => {
//         setEmployee(selectedEmployee);
//         setDate(selectedDate);
//         fetchTasks(selectedEmployee.id, selectedDate);
//     };

//     const handleResetSelection = () => {
//         setEmployee(null);
//         setDate({ from: null, to: null });
//         setTasks([]);
//         setChartData([]);
//     };

//     const fetchTasks = async (employeeId, dateRange) => {
//         const { from, to } = dateRange;
//         const userTasks = await getUserTasksByRange(employeeId, from, to);

//         const formattedTasks = userTasks.map(task => ({
//             id: task.id,
//             title: task.Task.description,
//             completed: task.isCompleted,
//             date: task.createdAt.split("T")[0],
//         }));

//         setTasks(formattedTasks);
//         processChartData(formattedTasks, from, to);
//     };

//     const processChartData = (tasks, from, to) => {
//         const completedTasks = tasks.filter(task => task.completed);
//         const incompleteTasks = tasks.filter(task => !task.completed);

//         const dates = eachDayOfInterval({ start: new Date(from), end: new Date(to) }).map(date =>
//             format(date, 'yyyy-MM-dd')
//         );

//         const chartData = dates.map(date => ({
//             date,
//             completed: completedTasks.filter(task => task.date === date).length,
//             incomplete: incompleteTasks.filter(task => task.date === date).length,
//         }));

//         setChartData(chartData);
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
//                 <div className="flex flex-col w-full">
//                     <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
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
//                         </div>
//                     </header>
//                     <main className="flex  gap-8 p-6 ">
//                         <div className="w-1/2">
//                             <TaskChart data={chartData} height={300} /> {/* Altura fija para el gráfico */}
//                         </div>
//                         <Card className="w-1/2">
//                             <CardHeader>
//                                 <CardTitle>Tareas por Fecha</CardTitle>
//                             </CardHeader>
//                             <CardContent className="overflow-auto">
//                                 {chartData.map(({ date, completed, incomplete }) => (
//                                     <div key={date} className="mb-4">
//                                         <div className="flex items-center justify-between">
//                                             <h3 className="font-semibold mb-2">{date}</h3>
//                                             <Button variant="link" className="text-blue-500 font-semibold mb-2">Ir al checklist</Button>
//                                         </div>
//                                         <p>Completadas: {completed}</p>
//                                         <p>Incompletas: {incomplete}</p>
//                                     </div>
//                                 ))}
//                             </CardContent>
//                         </Card>
//                     </main>
//                 </div>
//             )}
//         </div>
//     );
// }

// TODO: NO BORRAR ESTE CODIGO - muestra 2 cards, una con las tareas completadas y otra con las tareas incompletas - 1
// "use client";
// import { useState } from "react";
// import EmployeeDateSelector from "@/components/component/EmployeeDateSelector";
// import { Button } from "@/components/ui/button";
// import { ArrowLeftIcon, CheckIcon, XIcon } from "@/components/icons/index";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import TaskChart from "@/components/component/TaskChart";
// import { getUserTasksByRange } from "@/service/taskService";
// import { eachDayOfInterval, format } from 'date-fns';

// export default function ArchivedTasks() {
//     const [employee, setEmployee] = useState(null);
//     const [date, setDate] = useState({ from: null, to: null });
//     const [tasks, setTasks] = useState([]);
//     const [chartData, setChartData] = useState([]);

//     const handleSelection = (selectedEmployee, selectedDate) => {
//         setEmployee(selectedEmployee);
//         setDate(selectedDate);
//         fetchTasks(selectedEmployee.id, selectedDate);
//     };

//     const handleResetSelection = () => {
//         setEmployee(null);
//         setDate({ from: null, to: null });
//         setTasks([]);
//         setChartData([]);
//     };

//     const fetchTasks = async (employeeId, dateRange) => {
//         const { from, to } = dateRange;
//         const userTasks = await getUserTasksByRange(employeeId, from, to);

//         const formattedTasks = userTasks.map(task => ({
//             id: task.id,
//             title: task.Task.description,
//             completed: task.isCompleted,
//             date: task.createdAt.split("T")[0],
//         }));

//         setTasks(formattedTasks);
//         processChartData(formattedTasks, from, to);
//     };

//     const processChartData = (tasks, from, to) => {
//         const completedTasks = tasks.filter(task => task.completed);
//         const incompleteTasks = tasks.filter(task => !task.completed);

//         const dates = eachDayOfInterval({ start: new Date(from), end: new Date(to) }).map(date =>
//             format(date, 'yyyy-MM-dd')
//         );

//         const chartData = dates.map(date => ({
//             date,
//             completed: completedTasks.filter(task => task.date === date).length,
//             incomplete: incompleteTasks.filter(task => task.date === date).length,
//         }));

//         setChartData(chartData);
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
//                 <div className="flex flex-col w-full">
//                     <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
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
//                         </div>
//                     </header>
//                     <main className="flex gap-8 p-6">
//                         <div className="grid grid-cols-2 gap-4 w-full">
//                             <div className="flex">
//                                 <TaskChart data={chartData} />
//                             </div>
//                             <div className="flex flex-col gap-4 w-full">
//                                 <Card className="flex flex-col">
//                                     <CardHeader>
//                                         <CardTitle>Tareas Completadas</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="flex-1 overflow-auto">
//                                         <ul className="grid gap-2">
//                                             {tasks.filter(task => task.completed).map(task => (
//                                                 <li key={task.id} className="flex items-center justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <CheckIcon className="h-4 w-4 fill-primary" />
//                                                         <span>{task.title}</span>
//                                                     </div>
//                                                     <div className="text-sm text-muted-foreground">{task.date}</div>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </CardContent>
//                                 </Card>
//                                 <Card className="flex flex-col">
//                                     <CardHeader>
//                                         <CardTitle>Tareas Incompletas</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="flex-1 overflow-auto">
//                                         <ul className="grid gap-2">
//                                             {tasks.filter(task => !task.completed).map(task => (
//                                                 <li key={task.id} className="flex items-center justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <XIcon className="h-4 w-4 fill-red-500" />
//                                                         <span>{task.title}</span>
//                                                     </div>
//                                                     <div className="text-sm text-muted-foreground">{task.date}</div>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         </div>
//                     </main>
//                 </div>
//             )}
//         </div>
//     );
// }
