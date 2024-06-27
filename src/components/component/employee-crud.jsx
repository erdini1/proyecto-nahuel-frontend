"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import EmployeeCrudTable from "@/components/component/EmployeeCrudTable";
import EmployeeCrudModal from "@/components/component/EmployeeCrudModal";
import { getUsers, createUser, updateUser, deleteUser } from "@/service/userService";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/component/Spinner";
import { SearchIcon, PlusIcon } from "@/components/icons/index";
import { useToast } from "@/components/ui/use-toast"

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
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast()

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employees = await getUsers();
                setEmployees(employees.filter((employee) => employee.role !== "admin"));
            } catch (error) {
                console.log('Failed to fetch employees:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        });
    }, [employees, searchQuery]);

    const handleCreateEmployee = () => {
        setNewEmployee({ firstName: "", lastName: "", number: "", role: "", password: "" });
        setIsEditing(false);
        setShowCreateModal(true);
    };

    const handleSaveEmployee = async () => {
        try {
            if (isEditing) {
                await updateUser(newEmployee.id, newEmployee);
                toast({
                    title: "Empleado actualizado",
                    description: "El empleado ha sido actualizado correctamente",
                })
            } else {
                await createUser(newEmployee);
                toast({
                    title: "Empleado creado",
                    description: "El empleado ha sido creado correctamente",
                })
            }
            const updatedEmployees = await getUsers();
            setEmployees(updatedEmployees.filter((employee) => employee.role !== "admin"))
            setShowCreateModal(false);
        } catch (error) {
            console.log('Failed to save employee:', error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await deleteUser(id);
            setEmployees(employees.filter((employee) => employee.id !== id));
            toast({
                title: "Empleado eliminado",
                description: "El empleado ha sido eliminado correctamente",
            })
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
                    <div className="flex-1">
                        <h1 className="font-semibold text-lg">Empleados</h1>
                    </div>
                    <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">
                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
                                    placeholder="Buscar empleado..."
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                        <Button onClick={handleCreateEmployee}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Crear empleado
                        </Button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : (
                        <EmployeeCrudTable
                            employees={filteredEmployees}
                            handleUpdateEmployee={handleUpdateEmployee}
                            handleDeleteEmployee={handleDeleteEmployee}
                        />
                    )}
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