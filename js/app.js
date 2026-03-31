// app.js
// Main application logic for the Todo List app.
// This file handles task creation, deletion, completion toggling,
// loading from storage, saving to storage, and connecting to the UI layer.

import { getTasks, saveTasks } from "./storage.js";
import { renderTasks } from "./ui.js";
import { generateID } from "./utils.js";
import sampleData from "../data/sample-data.json" assert { type: "json" };

console.log(sampleData);

import {
    renderTasks,
    clearTaskInput,
    getTaskFormValues,
    bindAddTaskHandler,
    bindTaskListEvents,
} from "./ui.js";
import { loadTasks, saveTasks } from "./storage.js";

// Store all tasks in memory while the app is running.
let tasks = [];

/**
 * Initialize the app when the page loads.
 * - Load saved tasks from localStorage
 * - Render them in the UI
 * - Attach all event listeners
 */
function initApp() {
    tasks = loadTasks();
    renderTasks(tasks);

    bindEvents();
}

/**
 * Attach all UI event listeners.
 * UI event binding is kept separate from app logic
 * so the code stays modular and easier to understand.
 */
function bindEvents() {
    // Handle add-task actions such as button click or Enter key
    bindAddTaskHandler(handleAddTask);

    // Handle task list events such as checkbox change or delete click
    bindTaskListEvents({
        onToggleTask: handleToggleTask,
        onDeleteTask: handleDeleteTask,
    });
}

/**
 * Create a new task object using form values from the UI.
 * @returns {object|null} A task object or null if title is empty
 */
function createTask() {
    const { title, priority, dueDate } = getTaskFormValues();

    // Prevent adding empty tasks
    if (!title.trim()) {
        return null;
    }

    return {
        id: generateUniqueId(),
        title: title.trim(),
        completed: false,
        priority: priority || "medium",
        dueDate: dueDate || "",
        subtasks: [],
    };
}

/**
 * Add a new task to the list, then save and re-render.
 */
function handleAddTask() {
    const newTask = createTask();

    // Stop if the task is invalid
    if (!newTask) {
        return;
    }

    tasks.push(newTask);
    updateAppState();
    clearTaskInput();
}

/**
 * Delete a task by its id.
 * @param {string} taskId - The id of the task to remove
 */
function handleDeleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    updateAppState();
}

/**
 * Toggle the completed state of a task.
 * @param {string} taskId - The id of the task to update
 */
function handleToggleTask(taskId) {
    tasks = tasks.map((task) =>
        task.id === taskId ? {...task, completed: !task.completed } :
        task
    );

    updateAppState();
}

/**
 * Save tasks and re-render the UI.
 * This keeps all updates consistent in one place.
 */
function updateAppState() {
    saveTasks(tasks);
    renderTasks(tasks);
}

/**
 * Generate a unique id for each task.
 * Combines the current timestamp with a random string.
 * @returns {string} Unique task id
 */
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Start the app
initApp();

// Export functions if other modules need them later.
// This keeps the file modular and ready to scale.
export {
    initApp,
    createTask,
    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
};