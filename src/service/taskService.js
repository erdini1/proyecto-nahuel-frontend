import axios from "../config/axios";

// NO VA
export const getUserTasks = async (date, userId) => { // TODO: Eliminar cuando no se use mas
	try {
		const response = await axios.get(`/checklist/date?${userId ? `&userId=${userId}` : ''}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
};

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

// Obtener las usertasks con un userId, date and shift
export const getUserTasksByDateAndShift = async (userId, date, shift) => {
	try {
		const response = await axios.get(`/checklist/date/shift?userId=${userId}&date=${date}&shift=${shift}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
	}
}


// REVISADO
export const completeTask = async (taskId) => {
	try {
		const response = await axios.put(`/checklist/${taskId}/completed`);
		return response.data;
	} catch (error) {
		console.error('Failed to complete task:', error);
		throw new Error('Failed to get tasks');
	}
};

// NO VA
export const getUserTasksByDate = async (date) => { // TODO: Eliminar cuando no se use mas
	try {
		const response = await axios.get(`/checklist/date/all?date=${date}`);
		return response.data;
	} catch (error) {
		console.error('Failed to get tasks:', error);
		throw new Error('Failed to get tasks');
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

export const deleteUserTask = async (taskId) => {
	try {
		const response = await axios.delete(`/checklist/${taskId}`);
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
export const assignTask = async (taskIds, userId) => {
	try {
		const response = await axios.post('/checklist', {
			taskIds,
			userId,
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