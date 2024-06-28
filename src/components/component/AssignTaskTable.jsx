import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CheckIcon, XIcon, TrashIcon } from "@/components/icons/index";
import { Button } from "@/components/ui/button";

const AssignTaskTable = ({ tasks, handleDeleteUserTask }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-4/6">Descripción</TableHead>
                <TableHead className="w-1/6">Completado</TableHead>
                <TableHead className="w-1/6">Acciones</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {tasks.length === 0 ? (
                <TableRow>
                    <TableCell colSpan="3" className="text-center">No posee tareas asignadas</TableCell>
                </TableRow>
            ) : (
                tasks.map((task) => (
                    <TableRow key={task.id}>
                        <TableCell>{task.Task.description}</TableCell>
                        <TableCell>
                            {task.isCompleted ? (
                                <div className="flex items-center gap-2">
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                    <span>Si</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <XIcon className="h-4 w-4 text-red-500" />
                                    <span>No</span>
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            {/* <div className="flex items-center gap-2"> */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteUserTask(task.id)}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                            {/* </div> */}
                        </TableCell>
                    </TableRow>
                )))}
        </TableBody>
    </Table>
);

export default AssignTaskTable;
