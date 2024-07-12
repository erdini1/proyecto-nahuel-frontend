import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CheckIcon, XIcon, TrashIcon } from "@/components/icons/index";
import { Button } from "@/components/ui/button";
import { WeightIcon } from "@/components/icons/index"

const AssignTaskTable = ({ tasks, handleDeleteUserTask, isArchived }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-4/6">Descripción</TableHead>
                <TableHead className="w-1/6">Completado</TableHead>
                {!isArchived && <TableHead className="w-1/6">Acciones</TableHead>}
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
                        <TableCell className={`${!task.isActive ? "text-gray-400" : ""}`}>
                            {task.Task.description}
                            {task.Task.type === "elaboration" && (
                                task.kilos && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground text-gray-500 mt-1">
                                        <WeightIcon className="h-4 w-4" />
                                        {task.kilos} kg
                                    </div>
                                )
                            )}
                        </TableCell>
                        <TableCell>
                            {task.isCompleted ? (
                                <div className="flex items-center gap-2">
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                    <span>Si</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <XIcon className="h-4 w-4 text-red-500" />
                                    {task.isActive ? <span>No</span> : <span className="text-gray-400">Deshabiltado</span>}
                                </div>
                            )}
                        </TableCell>
                        {!isArchived && (
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteUserTask(task.id)}
                                    disabled={task.isCompleted || !task.isActive}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                )))}
        </TableBody>
    </Table>
);

export default AssignTaskTable;
