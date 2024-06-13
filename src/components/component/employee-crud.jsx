"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmployeeCrudTable from "@/components/component/EmployeeCrudTable";
import EmployeeCrudModal from "@/components/component/EmployeeCrudModal";
import { getUsers, createUser, updateUser, deleteUser } from "@/service/userService";

export default function EmployeeCrud() {
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
                    <EmployeeCrudTable
                        employees={employees}
                        handleUpdateEmployee={handleUpdateEmployee}
                        handleDeleteEmployee={handleDeleteEmployee}
                    />
                </main>
            </div>
            {showCreateModal && (
                <EmployeeCrudModal
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
