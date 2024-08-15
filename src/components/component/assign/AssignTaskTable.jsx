import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckIcon, XIcon, TrashIcon, ReloadIcon } from "@/components/icons/index";
import { Button } from "@/components/ui/button";
import { markTaskAsOptional, saveTaskOrder } from '@/service/taskService';
import { useToast } from "@/components/ui/use-toast"
import { PinOffIcon, PinIcon } from 'lucide-react';

function SortableTask({ task, handleDisableUserTask, isArchived, handleMarkAsOptional, taskStatus }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`flex border-b border-gray-200 p-4 hover:bg-gray-100 text-sm ${isArchived ? "cursor-default" : ""}`}>
            <div className={`w-4/6 py-2 ${!task.shouldDo ? "text-gray-400" : ""} ${!task.isActive ? "text-gray-400 line-through" : ""}`}>
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
                        {taskStatus(task)}
                    </div>
                )}
            </div>
            {!isArchived && (
                <div className="w-1/6 flex items-center justify-center">
                    {task.isActive ? (
                        <div className='flex items-center'>
                            <Button
                                variant="outline"
                                size="icon"
                                onPointerDown={() => handleDisableUserTask(task.id, false)}
                                disabled={task.isCompleted}
                                className={`mr-2 ring-1 ring-gray-200 ${task.isCompleted ? 'hidden' : ''}`}
                            >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onPointerDown={() => handleMarkAsOptional(task.id)}
                                disabled={task.isCompleted}
                                className={`mr-2 ring-1 ring-gray-200 ${task.isCompleted ? 'hidden' : ''} ${task.isOptional ? "bg-gray-300 hover:bg-gray-400 " : ""}`}
                            >
                                {!task.isOptional ? (
                                    <PinIcon className="h-4 w-4" />
                                ) : (
                                    <PinOffIcon className="h-4 w-4" />
                                )}
                                <span className="sr-only">Aplica</span>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="icon"
                            onPointerDown={() => handleDisableUserTask(task.id, true)}
                            disabled={task.isCompleted}
                            className="ring-1 ring-gray-200"
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

    const { toast } = useToast()

    const handleTaskMove = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = userTasks.findIndex(task => task.id === active.id);
            const newIndex = userTasks.findIndex(task => task.id === over.id);

            const newOrder = arrayMove(userTasks, oldIndex, newIndex);
            setUserTasks(newOrder);

            await saveTaskOrder(newOrder.map(userTask => userTask.id), userId);
        }
    };

    const handleMarkAsOptional = async (userTaskId) => {
        try {
            const { isOptional } = userTasks.find(userTask => userTask.id === userTaskId);
            await markTaskAsOptional(userTaskId, !isOptional);
            setUserTasks(userTasks.map(userTask =>
                userTask.id === userTaskId ? { ...userTask, isOptional: !userTask.isOptional } : userTask
            ));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Ocurrió un error al marcar la tarea como opcional",
            });
        }
    };

    const taskStatus = (task) => {
        if (!task.isActive) {
            return (
                <span className="text-gray-400">Deshabilitado</span>
            )
        } else if (!task.shouldDo) {
            return (
                <span className="text-gray-400">No aplica</span>
            )
        } else {
            return (
                <span>No</span>
            )

        }
    }

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
                            taskStatus={taskStatus}
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
                                    handleMarkAsOptional={handleMarkAsOptional}
                                    taskStatus={taskStatus}
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