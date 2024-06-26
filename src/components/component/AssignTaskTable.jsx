import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CheckIcon, XIcon } from "@/components/icons/index";

const AssignTaskTable = ({ tasks }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Completado</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {tasks.length === 0 ? (
                <TableRow>
                    <TableCell colSpan="2" className="text-center">No posee tareas asignadas</TableCell>
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
                    </TableRow>
                )))}
        </TableBody>
    </Table>
);

export default AssignTaskTable;
