// storage.js
// This file handles all task data operations using browser localStorage.
// It does not include any UI or DOM-related code.

/**
 * Storage key used to save and retrieve tasks from localStorage.
 */
const STORAGE_KEY = "todo_tasks";

/**
 * Check if the provided value is a valid tasks array.
 * @param {unknown} tasks - Value to validate
 * @returns {boolean} True if value is an array
 */
function isValidTaskArray(tasks) {
    return Array.isArray(tasks);
}

/**
 * Save the full tasks array to localStorage.
 * Converts the array into a JSON string before saving.
 * @param {Array} tasks - List of task objects
 * @returns {boolean} True if save was successful, otherwise false
 */
export function saveTasks(tasks) {
    try {
        if (!isValidTaskArray(tasks)) {
            throw new Error("Invalid tasks data: expected an array.");
        }

        const tasksJson = JSON.stringify(tasks);
        localStorage.setItem(STORAGE_KEY, tasksJson);

        return true;
    } catch (error) {
        console.error("Error saving tasks:", error);
        return false;
    }
}

/**
 * Get all tasks from localStorage.
 * Parses the saved JSON string back into a JavaScript array.
 * Returns an empty array if no data exists or parsing fails.
 * @returns {Array} Array of task objects
 */
export function getTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);

        if (!storedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(storedTasks);

        return isValidTaskArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

/**
 * Add a new task to the existing task list in localStorage.
 * @param {Object} newTask - Task object to add
 * @returns {Array} Updated tasks array
 */
export function addTask(newTask) {
    try {
        const tasks = getTasks();

        if (!newTask || typeof newTask !== "object") {
            throw new Error("Invalid task data: expected an object.");
        }

        tasks.push(newTask);
        saveTasks(tasks);

        return tasks;
    } catch (error) {
        console.error("Error adding task:", error);
        return getTasks();
    }
}

/**
 * Delete a task by its unique id.
 * @param {string} taskId - ID of the task to remove
 * @returns {Array} Updated tasks array
 */
export function deleteTask(taskId) {
    try {
        const tasks = getTasks();
        const updatedTasks = tasks.filter((task) => task.id !== taskId);

        saveTasks(updatedTasks);

        return updatedTasks;
    } catch (error) {
        console.error("Error deleting task:", error);
        return getTasks();
    }
}

/**
 * Update a task by its id.
 * Can be used to toggle completed status or update other fields
 * like priority, dueDate, or title.
 * @param {string} taskId - ID of the task to update
 * @param {Object} updates - Object containing updated task fields
 * @returns {Array} Updated tasks array
 */
export function updateTask(taskId, updates = {}) {
    try {
        const tasks = getTasks();

        const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,
                ...updates,
            };
        });

        saveTasks(updatedTasks);

        return updatedTasks;
    } catch (error) {
        console.error("Error updating task:", error);
        return getTasks();
    }
}

/**
 * Toggle the completed state of a task by its id.
 * @param {string} taskId - ID of the task to toggle
 * @returns {Array} Updated tasks array
 */
export function toggleTaskCompleted(taskId) {
    try {
        const tasks = getTasks();

        const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,
                completed: !task.completed,
            };
        });

        saveTasks(updatedTasks);

        return updatedTasks;
    } catch (error) {
        console.error("Error toggling task completion:", error);
        return getTasks();
    }
}

/**
 * Remove all tasks from localStorage.
 * @returns {boolean} True if successful, otherwise false
 */
export function clearAllTasks() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error("Error clearing tasks:", error);
        return false;
    }
}

/**
 * Export the storage key in case other modules need it.
 */
export { STORAGE_KEY };