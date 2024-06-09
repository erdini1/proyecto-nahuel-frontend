"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getUserTasks } from "@/service/taskService";

export default function AssignTasks() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [sector, setSector] = useState("");
    const [employee, setEmployee] = useState("all");
    const [date, setDate] = useState(new Date());
    const [shift, setShift] = useState("Morning");
    const [tasks, setTasks] = useState([
        { id: 1, description: "Prepare monthly financial report", sector: "General", completed: false },
        { id: 2, description: "Conduct employee performance reviews", sector: "Caja", completed: true },
        { id: 3, description: "Organize team building event", sector: "Polleria", completed: false },
        { id: 4, description: "Implement new CRM system", sector: "Repositor", completed: true },
        { id: 5, description: "Update company website", sector: "General", completed: false },
    ]);
    const [selectedTasks, setSelectedTasks] = useState([])
    const [userTasks, setUserTasks] = useState([]);

    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                const data = await getUserTasks(date.toISOString().split('T')[0]);
                console.log('Fetched tasks:', data);
                setUserTasks(data);
            } catch (error) {
                console.log('Failed to fetch tasks:', error);
            }
        };
        fetchUserTasks();
    }, [date]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(
            (task) =>
                task.description.toLowerCase().includes(description.toLowerCase()) &&
                task.sector.toLowerCase().includes(sector.toLowerCase()) &&
                (employee === "all" || task.sector.toLowerCase().includes(employee.toLowerCase())) // Cambiado a "all"
        );
    }, [tasks, description, sector, employee]);

    const filteredTasksUserTasks = userTasks.filter(userTask =>
		userTask.Task.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

    const handleAssignTasks = () => {
        console.log("Assigning tasks:", selectedTasks)
        setSelectedTasks([])
        setIsDialogOpen(false)
    }
    const handleTaskSelection = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
        } else {
            setSelectedTasks([...selectedTasks, taskId])
        }
    }

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="">
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
                    <Link href="#" className="lg:hidden" prefetch={false}>
                        <ClipboardListIcon className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                    <div className="flex-1">
                        <h1 className="font-semibold text-lg">Tasks</h1>
                    </div>
                    <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <Select value={employee} className="w-[200px] bg-white" onValueChange={setEmployee}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Employees</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="caja">Caja</SelectItem>
                                <SelectItem value="polleria">Polleria</SelectItem>
                                <SelectItem value="repositor">Repositor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2 h-9">
                                    <CalendarDaysIcon className="h-4 w-4" />
                                    <span className="font-normal">{date.toLocaleDateString()}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-w-[276px]">
                                <Calendar value={date} onChange={setDate} />
                            </PopoverContent>
                        </Popover>
                        <div className="flex gap-2">
                            <Button onClick={handleOpenDialog}>
                                <SearchIcon className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                            <Button onClick={handleOpenDialog}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Assign Tasks
                            </Button>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="border shadow-sm rounded-lg">
                        <div className="flex items-center justify-between bg-gray-100/40 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="font-semibold">{employee || "All Employees"}</div>
                                <div className="text-gray-500">
                                    {date.toLocaleDateString()} - {shift}
                                </div>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Completed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.description}</TableCell>
                                        <TableCell>
                                            {task.completed ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                                    <span>Yes</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <XIcon className="h-4 w-4 text-red-500" />
                                                    <span>No</span>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleOpenDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign Tasks</DialogTitle>
                        <DialogDescription>Select the tasks you want to assign to an employee.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="description">Search Tasks</Label>
                            <div className="relative">
                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input
                                    id="description"
                                    type="text"
                                    placeholder="Enter task description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            {filteredTasks.length > 0 && (
                                <div className="bg-white border rounded-md shadow-sm p-2 mt-2">
                                    <div className="text-sm text-gray-500 mb-2">Select tasks to assign:</div>
                                    <ul className="space-y-1">
                                        {filteredTasks.map((task) => (
                                            <li
                                                key={task.id}
                                                className="hover:bg-gray-100 p-1 rounded-md flex items-center justify-between"
                                            >
                                                <span>{task.description}</span>
                                                <Checkbox
                                                    checked={selectedTasks.includes(task.id)}
                                                    onCheckedChange={() => handleTaskSelection(task.id)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="sector">Assign To</Label>
                            <Select id="sector" value={sector} onValueChange={setSector}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select employee" />
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
                        <Button onClick={handleAssignTasks}>Assign Tasks</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


function CalendarDaysIcon(props) {
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
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
        </svg>
    )
}


function CheckIcon(props) {
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
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
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
    )
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
    )
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
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}


function XIcon(props) {
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}