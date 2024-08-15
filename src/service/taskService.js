import axios from "../config/axios";

// REVISADO - OBTIENE LAS TAREAS DEL USUARIO LOGUEADO O DE UN USUARIO ESPECIFICO
export const getUserTaskByTaskSet = async (userId) => {
	try {
		const response = await axios.get(`/checklist/user/task-set?${userId ? `&userId=${userId}` : ''}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
};

// Obtener las usertasks a traves de un taskSetId
export const getUserTasksByTaskSetId = async (taskSetId) => {
	try {
		const response = await axios.get(`/checklist/task-set/${taskSetId}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
}


// REVISADO
export const completeTask = async (taskId, kilos) => {
	try {
		const response = await axios.put(`/checklist/${taskId}/completed`, { kilos });
		return response.data;
	} catch (error) {
		console.error('Failed to complete task:', error);
		throw new Error('Failed to get tasks');
	}
};

export const markTaskAsOptional = async (userTaskId, isOptional) => {
	try {
		const response = await axios.put(`/checklist/${userTaskId}/optional`, { isOptional });
		return response.data;
	} catch (error) {
		console.error('Failed to mark task as optional:', error);
		throw new Error('Failed to mark task as optional');
	}
}

export const markTaskAsShouldDo = async (userTaskId, shouldDo) => {
	try {
		const response = await axios.put(`/checklist/${userTaskId}/should-do`, { shouldDo });
		return response.data;
	} catch (error) {
		console.error('Failed to mark task as should do:', error);
		throw new Error('Failed to mark task as should do');
	}
}

// REVISADO - OBTIENE TODAS LAS TAREAS DE TODOS LOS USUARIOS POR TASK SETS (TURNO) 
export const getUserTasksByTaskSets = async () => {
	try {
		const response = await axios.get(`/checklist/task-set`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
}

// REVISADO - OBTIENE LAS TAREAS DE UN USUARIO POR RANGO DE FECHAS
export const getUserTasksByRange = async (userId, startDate, endDate) => {
	try {
		const response = await axios.get(`/checklist/date/range?startDate=${startDate}&endDate=${endDate}&userId=${userId}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
}

export const disableUserTask = async (userTaskId, isActive) => {
	try {
		const response = await axios.put(`/checklist/${userTaskId}`, { isActive });
		return response.data;
	} catch (error) {
		console.error('Failed to delete task:', error);
		throw new Error('Failed to delete task');
	}
}

export const createTask = async (task) => {
	try {
		const response = await axios.post('/task', task);
		return response.data;
	} catch (error) {
		console.error('Failed to create task:', error);
		throw new Error('Failed to create task');
	}
}

export const getAllTasks = async () => {
	try {
		const response = await axios.get('/task');
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
}

// REVISADO
export const assignTask = async (taskIds, userId, periodicity) => {
	try {
		const response = await axios.post('/checklist', {
			taskIds,
			userId,
			periodicity
		});
		return response.data;
	} catch (error) {
		console.error('Failed to assign task:', error);
		throw new Error('Failed to assign task');
	}
}

export const deleteTask = async (taskId) => {
	try {
		const response = await axios.delete(`/task/${taskId}`);
		return response.data;
	} catch (error) {
		console.error('Failed to delete task:', error);
		throw new Error('Failed to delete task');
	}
}

export const updateTask = async (taskId, task) => {
	try {
		const response = await axios.put(`/task/${taskId}`, task);
		return response.data;
	} catch (error) {
		console.error('Failed to update task:', error);
		throw new Error('Failed to update task');
	}
}

export const saveTaskOrder = async (taskIdsInOrder, userId) => {
	try {
		const response = await axios.post(`/checklist/order/${userId}`, taskIdsInOrder);
		return response.data;
	} catch (error) {
		console.error('Failed to save task order:', error);
		throw new Error('Failed to save task order');
	}
}