// utils.js
// Reusable helper functions for the Todo List web app.
// These functions are pure and do not interact with the DOM or localStorage.

/**
 * Generate a unique ID using the current timestamp and a random string.
 * @returns {string} A unique task ID
 */
export function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Format a raw date value into a readable date string.
 * Example: "2026-04-01" -> "Apr 1, 2026"
 * @param {string} rawDate - Raw date or datetime string
 * @returns {string} Formatted date string
 */
export function formatDate(rawDate) {
    if (!rawDate) return "";

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

/**
 * Format a raw date/time value into a user-friendly time string.
 * Example: "2026-04-01T10:30" -> "10:30 AM"
 * @param {string} rawDateTime - Raw datetime string
 * @returns {string} Formatted time string
 */
export function formatTime(rawDateTime) {
    if (!rawDateTime) return "";

    const date = new Date(rawDateTime);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}

/**
 * Validate task input text.
 * Returns true if the input has enough meaningful characters.
 * @param {string} text - Task title input
 * @param {number} minLength - Minimum allowed length after trimming
 * @returns {boolean} Whether the input is valid
 */
export function validateInput(text, minLength = 2) {
    if (typeof text !== "string") {
        return false;
    }

    return text.trim().length >= minLength;
}

/**
 * Capitalize the first letter of a string.
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalizeText(text = "") {
    if (typeof text !== "string" || text.length === 0) {
        return "";
    }

    const trimmedText = text.trim();

    if (!trimmedText) {
        return "";
    }

    return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
}

/**
 * Return a reusable priority class name based on task priority.
 * @param {string} priority - low, medium, or high
 * @returns {string} Class name for styling
 */
export function getPriorityColor(priority = "medium") {
    const priorityMap = {
        low: "priority--low",
        medium: "priority--medium",
        high: "priority--high",
    };

    return priorityMap[priority] || priorityMap.medium;
}

/**
 * Filter tasks based on the selected filter type.
 * @param {Array} tasks - Array of task objects
 * @param {string} filter - all, completed, or pending
 * @returns {Array} Filtered task array
 */
export function filterTasks(tasks = [], filter = "all") {
    if (!Array.isArray(tasks)) {
        return [];
    }

    switch (filter) {
        case "completed":
            return tasks.filter((task) => task.completed === true);

        case "pending":
            return tasks.filter((task) => task.completed === false);

        case "all":
        default:
            return [...tasks];
    }
}