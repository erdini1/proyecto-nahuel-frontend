import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckIcon, XIcon, TrashIcon, ReloadIcon } from "@/components/icons/index";
import { Button } from "@/components/ui/button";
import { saveTaskOrder } from '@/service/taskService';

function SortableTask({ task, handleDisableUserTask, isArchived }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`flex border-b border-gray-200 p-4 hover:bg-gray-100 text-sm ${isArchived ? "cursor-default" : ""}`}>
            <div className={`w-4/6 py-2 ${!task.isActive ? "text-gray-400" : ""}`}>
                {task.Task.description}
                <span className="text-gray-400 text-sm">{task.periodicity === "daily" ? " (Solo por hoy)" : ""}</span>
                {task.Task.type === "elaboration" && task.kilos && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground text-gray-500 mt-1">
                        Cantidad elaborada: {task.kilos} kg
                    </div>
                )}
            </div>
            <div className={`${!isArchived ? "w-1/6" : "w-2/6"} flex items-center px-6`}>
                {task.isCompleted ? (
                    <div className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        <span>Si</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <XIcon className="h-4 w-4 text-red-500" />
                        {task.isActive ? <span>No</span> : <span className="text-gray-400">Deshabilitado</span>}
                    </div>
                )}
            </div>
            {!isArchived && (
                <div className="w-1/6 flex items-center justify-center">
                    {task.isActive ? (
                        <Button
                            variant="outline"
                            size="icon"
                            onPointerDown={() => handleDisableUserTask(task.id, false)}
                            disabled={task.isCompleted}
                        >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="icon"
                            onPointerDown={() => handleDisableUserTask(task.id, true)}
                            disabled={task.isCompleted}
                        >
                            <ReloadIcon className="h-4 w-4" />
                            <span className="sr-only">Habilitar</span>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

const AssignTaskTable = ({ userTasks, setUserTasks, handleDisableUserTask, userId, isArchived }) => {
    const handleTaskMove = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = userTasks.findIndex(task => task.id === active.id);
            const newIndex = userTasks.findIndex(task => task.id === over.id);

            const newOrder = arrayMove(userTasks, oldIndex, newIndex);
            setUserTasks(newOrder);

            // Llamar a la API para guardar la nueva orden
            // console.log("Nueva orden de tareas:", newOrder.map(userTask => userTask.id));
            await saveTaskOrder(newOrder.map(userTask => userTask.id), userId);
        }
    };

    return (
        <div className="w-full">
            <div className="flex bg-gray-100 border-2 border-gray-200 text-sm">
                <div className="w-4/6 p-4 font-medium text-gray-500">Descripción</div>
                <div className={`${!isArchived ? "w-1/6" : "w-2/6"} p-4 font-medium text-gray-500`}>Completado</div>
                {!isArchived && <div className="w-1/6 p-4 font-medium text-gray-500">Acciones</div>}
            </div>
            <div>
                {userTasks.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">No posee tareas asignadas</div>
                ) : isArchived ? (
                    userTasks.map((task) => (
                        <SortableTask
                            key={task.id}
                            task={task}
                            handleDisableUserTask={handleDisableUserTask}
                            isArchived={isArchived}
                        />
                    ))
                ) : (
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleTaskMove}
                    >
                        <SortableContext
                            items={userTasks}
                            strategy={verticalListSortingStrategy}
                        >
                            {userTasks.map((task) => (
                                <SortableTask
                                    key={task.id}
                                    task={task}
                                    handleDisableUserTask={handleDisableUserTask}
                                    isArchived={isArchived}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
};

export default AssignTaskTable;


// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { CheckIcon, XIcon, TrashIcon, ReloadIcon } from "@/components/icons/index";
// import { Button } from "@/components/ui/button";

// const AssignTaskTable = ({ tasks, handleDisableUserTask, isArchived }) => (
//     <Table>
//         <TableHeader>
//             <TableRow>
//                 <TableHead className="w-4/6">Descripción</TableHead>
//                 <TableHead className="w-1/6">Completado</TableHead>
//                 {!isArchived && <TableHead className="w-1/6">Acciones</TableHead>}
//             </TableRow>
//         </TableHeader>
//         <TableBody>
//             {tasks.length === 0 ? (
//                 <TableRow>
//                     <TableCell colSpan="3" className="text-center">No posee tareas asignadas</TableCell>
//                 </TableRow>
//             ) : (
//                 tasks.map((task) => (
//                     <TableRow key={task.id}>
//                         <TableCell className={`${!task.isActive ? "text-gray-400" : ""}`}>
//                             {task.Task.description}
//                             <span className="text-gray-400 text-sm">{(task.periodicity === "daily" ? " (Solo por hoy)" : "")}</span>
//                             {task.Task.type === "elaboration" && (
//                                 task.kilos && (
//                                     <div className="flex items-center gap-1 text-sm text-muted-foreground text-gray-500 mt-1">
//                                         Cantidad elaborada: {task.kilos} kg
//                                     </div>
//                                 )
//                             )}
//                         </TableCell>
//                         <TableCell>
//                             {task.isCompleted ? (
//                                 <div className="flex items-center gap-2">
//                                     <CheckIcon className="h-4 w-4 text-green-500" />
//                                     <span>Si</span>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-2">
//                                     <XIcon className="h-4 w-4 text-red-500" />
//                                     {task.isActive ? <span>No</span> : <span className="text-gray-400">Deshabiltado</span>}
//                                 </div>
//                             )}
//                         </TableCell>
//                         {!isArchived && (
//                             <TableCell>
//                                 {task.isActive ? (
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         onClick={() => handleDisableUserTask(task.id, false)}
//                                         disabled={task.isCompleted}
//                                     >
//                                         <TrashIcon className="h-4 w-4" />
//                                         <span className="sr-only">Eliminar</span>
//                                     </Button>
//                                 ) : (
//                                     <Button
//                                         variant="outline"
//                                         size="icon"
//                                         onClick={() => handleDisableUserTask(task.id, true)}
//                                         disabled={task.isCompleted}
//                                     >
//                                         <ReloadIcon className="h-4 w-4" />
//                                         <span className="sr-only">Habilitar</span>
//                                     </Button>
//                                 )}
//                             </TableCell>
//                         )}
//                     </TableRow>
//                 )))}
//         </TableBody>
//     </Table>
// );

// export default AssignTaskTable;
