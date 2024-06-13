"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmployeeTable from "@/components/component/EmployeeTable";
import EmployeeModal from "@/components/component/EmployeeModal";
import { getUsers, createUser, updateUser, deleteUser } from "@/service/userService";

export default function UserTable() {
    const [employees, setEmployees] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        id: null,
        firstName: "",
        lastName: "",
        number: "",
        role: "",
        password: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employees = await getUsers();
                setEmployees(employees.filter((employee) => employee.role !== "admin"));
            } catch (error) {
                console.log('Failed to fetch employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    const handleCreateEmployee = () => {
        setNewEmployee({ firstName: "", lastName: "", number: "", role: "", password: "" });
        setIsEditing(false);
        setShowCreateModal(true);
    };

    const handleSaveEmployee = async () => {
        try {
            if (isEditing) {
                await updateUser(newEmployee.id, newEmployee);
                alert('Empleado actualizado')
            } else {
                await createUser(newEmployee);
            }
            const updatedEmployees = await getUsers();
            setEmployees(updatedEmployees);
            setShowCreateModal(false);
        } catch (error) {
            console.log('Failed to save employee:', error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await deleteUser(id);
            setEmployees(employees.filter((employee) => employee.id !== id));
            alert('Empleado eliminado')
        } catch (error) {
            console.log('Failed to delete employee:', error);
        }
    };

    const handleUpdateEmployee = (id) => {
        const employeeToUpdate = employees.find((emp) => emp.id === id);
        setNewEmployee(employeeToUpdate);
        setIsEditing(true);
        setShowCreateModal(true);
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
                        <h1 className="font-semibold text-lg">Empleados</h1>
                    </div>
                    <Button onClick={handleCreateEmployee}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Crear empleado
                    </Button>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <EmployeeTable
                        employees={employees}
                        handleUpdateEmployee={handleUpdateEmployee}
                        handleDeleteEmployee={handleDeleteEmployee}
                    />
                </main>
            </div>
            {showCreateModal && (
                <EmployeeModal
                    isEditing={isEditing}
                    newEmployee={newEmployee}
                    setNewEmployee={setNewEmployee}
                    handleSaveEmployee={handleSaveEmployee}
                    setShowCreateModal={setShowCreateModal}
                    employees={employees}
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


// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//     Table,
//     TableHeader,
//     TableRow,
//     TableHead,
//     TableBody,
//     TableCell
// } from "@/components/ui/table";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectItem
// } from "@/components/ui/select";
// import { getUsers, createUser } from "@/service/userService";

// export default function UserTable() {
//     const [employees, setEmployees] = useState([]);
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [newEmployee, setNewEmployee] = useState({
//         id: null,
//         firstName: "",
//         lastName: "",
//         number: "",
//         role: "",
//         password: ""
//     });
//     const [isEditing, setIsEditing] = useState(false);

//     const roles = {
//         admin: "Admin",
//         employee: "Empleado",
//         cashier: "Cajero"
//     };

//     const translateRole = (role) => {
//         switch (role) {
//             case "admin":
//                 return roles.admin;
//             case "employee":
//                 return roles.employee;
//             case "cashier":
//                 return roles.cashier;
//             default:
//                 return role;
//         }
//     }

//     useEffect(() => {
//         const fetchEmployees = async () => {
//             try {
//                 const employees = await getUsers();
//                 setEmployees(employees);
//             } catch (error) {
//                 console.log('Failed to fetch employees:', error);
//             }
//         };
//         fetchEmployees();
//     }, []);

//     const handleCreateEmployee = () => {
//         setNewEmployee({ firstName: "", lastName: "", number: "", role: "", password: "" });
//         setIsEditing(false);
//         setShowCreateModal(true);
//     };

//     const handleSaveEmployee = async () => {
//         try {
//             if (!isEditing) {
//                 await createUser(newEmployee);
//             } else {
//                 console.log("Editing..."); // Implementar lógica de actualización aquí
//                 // await updateEmployee(newEmployee);
//             }
//             const updatedEmployees = await getUsers();
//             setEmployees(updatedEmployees);
//             setShowCreateModal(false);
//         } catch (error) {
//             console.log('Failed to save employee:', error);
//         }
//     };

//     return (
//         <div className="">
//             <div className="flex flex-col">
//                 <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
//                     <Link href="#" className="lg:hidden" prefetch={false}>
//                         <ClipboardListIcon className="h-6 w-6" />
//                         <span className="sr-only">Home</span>
//                     </Link>
//                     <div className="flex-1">
//                         <h1 className="font-semibold text-lg">Empleados</h1>
//                     </div>
//                     <Button onClick={handleCreateEmployee}>
//                         <PlusIcon className="h-4 w-4 mr-2" />
//                         Crear empleado
//                     </Button>
//                 </header>
//                 <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
//                     <div className="border shadow-sm rounded-lg">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Nombre y Apellido</TableHead>
//                                     <TableHead>Numero de ingreso</TableHead>
//                                     <TableHead>Rol</TableHead>
//                                     <TableHead>Acciones</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {employees.map((employee) => (
//                                     <TableRow key={employee.id}>
//                                         <TableCell>{employee.firstName} {employee.lastName}</TableCell>
//                                         <TableCell>{employee.number}</TableCell>
//                                         <TableCell>{translateRole(employee.role)}</TableCell>
//                                         <TableCell>
//                                             <div className="flex items-center gap-2">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="icon"
//                                                     onClick={() => handleUpdateEmployee(employee.id)}
//                                                 >
//                                                     <FilePenIcon className="h-4 w-4" />
//                                                     <span className="sr-only">Editar</span>
//                                                 </Button>
//                                                 <Button
//                                                     variant="outline"
//                                                     size="icon"
//                                                     onClick={() => handleDeleteEmployee(employee.id)}
//                                                 >
//                                                     <TrashIcon className="h-4 w-4" />
//                                                     <span className="sr-only">Eliminar</span>
//                                                 </Button>
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </main>
//             </div>
//             {showCreateModal && (
//                 <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
//                     <DialogContent className="sm:max-w-[425px]">
//                         <DialogHeader>
//                             <DialogTitle>{isEditing ? "Modificar Empleado" : "Crear Empleado"}</DialogTitle>
//                             <DialogDescription>
//                                 {isEditing ? "Modificar la información del empleado" : "Complete el formulario para crear un nuevo empleado"}
//                             </DialogDescription>
//                         </DialogHeader>
//                         <div className="grid gap-4 py-4">
//                             <div className="grid gap-3">
//                                 <Label htmlFor="firstName">Nombre</Label>
//                                 <Input
//                                     id="firstName"
//                                     type="text"
//                                     placeholder="Ingrese el nombre"
//                                     value={newEmployee.firstName}
//                                     onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
//                                 />
//                             </div>
//                             <div className="grid gap-3">
//                                 <Label htmlFor="lastName">Apellido</Label>
//                                 <Input
//                                     id="lastName"
//                                     type="text"
//                                     placeholder="Ingrese el apellido"
//                                     value={newEmployee.lastName}
//                                     onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
//                                 />
//                             </div>
//                             <div className="grid gap-1.5">
//                                 <Label htmlFor="number">Numero de empleado</Label>
//                                 <Input
//                                     id="number"
//                                     type="number"
//                                     placeholder="Ingrese numero de empleado"
//                                     value={newEmployee.number}
//                                     onChange={(e) => setNewEmployee({ ...newEmployee, number: e.target.value })}
//                                 />
//                             </div>
//                             <div className="grid gap-1.5">
//                                 <Label htmlFor="password">Contraseña</Label>
//                                 <Input
//                                     id="password"
//                                     type="password"
//                                     placeholder="Ingrese la contraseña"
//                                     value={newEmployee.password}
//                                     onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
//                                 />
//                             </div>
//                             <div className="grid gap-1.5">
//                                 <Label htmlFor="role">Rol</Label>
//                                 <Select
//                                     id="role"
//                                     value={newEmployee.role}
//                                     onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
//                                 >
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Seleccionar rol" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="admin">Admin</SelectItem>
//                                         <SelectItem value="employee">Empleado</SelectItem>
//                                         <SelectItem value="cashier">Cajero</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                         <DialogFooter>
//                             <Button onClick={handleSaveEmployee}>{isEditing ? "Actualizar" : "Crear"}</Button>
//                             <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             )}
//         </div>
//     );
// }

// function ClipboardListIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
//             <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
//             <path d="M12 11h4" />
//             <path d="M12 16h4" />
//             <path d="M8 11h.01" />
//             <path d="M8 16h.01" />
//         </svg>
//     );
// }

// function FilePenIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
//             <path d="M14 2v4a2 2 0 0 0 2 2h4" />
//             <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
//         </svg>
//     );
// }

// function PlusIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M5 12h14" />
//             <path d="M12 5v14" />
//         </svg>
//     );
// }

// function TrashIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M3 6h18" />
//             <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//             <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//         </svg>
//     );
// }