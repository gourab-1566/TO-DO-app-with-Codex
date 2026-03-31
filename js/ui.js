// ui.js
// This file handles only UI rendering and DOM interaction.
// It does not store data or manage business logic.

// ============================================================
// DOM Elements
// ============================================================

// Main task input controls
const taskInput = document.querySelector("#task-input");
const prioritySelect = document.querySelector("#task-priority");
const dueDateInput = document.querySelector("#task-due-date");
const addTaskButton = document.querySelector(".task-form__button");

// Task list and empty state
const taskList = document.querySelector(".task-list");
const emptyState = document.querySelector(".task-list__empty-state");

// Filter buttons
const filterButtons = document.querySelectorAll(".task-filters__button");

// Keep track of the active filter in the UI
let activeFilter = "all";

// ============================================================
// Public Render Functions
// ============================================================

/**
 * Render all tasks in the task list.
 * Applies the current active filter before displaying tasks.
 * @param {Array} tasks - Array of task objects
 */
export function renderTasks(tasks = []) {
    if (!taskList) return;

    const filteredTasks = filterTasks(tasks, activeFilter);

    // Clear the current list before rendering again
    taskList.innerHTML = "";

    // Show empty state if there are no tasks to display
    if (filteredTasks.length === 0) {
        showEmptyState(true);
        return;
    }

    showEmptyState(false);

    // Create and append each task item
    filteredTasks.forEach((task) => {
        const taskElement = renderSingleTask(task);
        taskList.appendChild(taskElement);
    });
}

/**
 * Create a single task element.
 * Includes checkbox, title, priority, due date, delete button, and subtasks.
 * @param {Object} task - Task object
 * @returns {HTMLLIElement} Rendered task element
 */
export function renderSingleTask(task) {
    const taskItem = document.createElement("li");
    taskItem.className = "task-list__item";
    taskItem.dataset.taskId = task.id;

    const isCompletedClass = task.completed ? " task-card--completed" : "";
    const formattedDueDate = formatDueDate(task.dueDate);

    taskItem.innerHTML = `
    <article class="task-card${isCompletedClass}">
      <div class="task-card__main">
        <div class="task-card__status">
          <input
            class="task-card__checkbox"
            type="checkbox"
            ${task.completed ? "checked" : ""}
            aria-label="Mark task as completed"
          />
          <span class="task-card__label">${escapeHTML(task.title)}</span>
        </div>

        <div class="task-card__meta">
          <span class="task-card__priority task-card__priority--${task.priority}">
            ${capitalize(task.priority)}
          </span>
          ${
            task.dueDate
              ? `<time class="task-card__due-date" datetime="${task.dueDate}">
                  Due: ${formattedDueDate}
                </time>`
              : ""
          }
        </div>
      </div>

      <div class="task-card__actions">
        <button class="task-card__subtask-button" type="button">
          Subtasks
        </button>
        <button class="task-card__delete-button" type="button">
          Delete
        </button>
      </div>

      <section class="task-card__subtasks">
        <h3 class="task-card__subtasks-title">Subtasks</h3>
        ${renderSubtasks(task.subtasks)}
      </section>
    </article>
  `;

  updateTaskUI(taskItem, task);
  return taskItem;
}

/**
 * Update a task's visual state in the DOM.
 * Useful when a task changes without reloading the whole page.
 * @param {HTMLElement} taskElement - Existing task DOM element
 * @param {Object} task - Updated task object
 */
export function updateTaskUI(taskElement, task) {
  if (!taskElement) return;

  const card = taskElement.querySelector(".task-card");
  const checkbox = taskElement.querySelector(".task-card__checkbox");
  const label = taskElement.querySelector(".task-card__label");

  if (checkbox) {
    checkbox.checked = task.completed;
  }

  if (label) {
    label.textContent = task.title;
    label.style.textDecoration = task.completed ? "line-through" : "none";
    label.style.opacity = task.completed ? "0.65" : "1";
  }

  if (card) {
    card.classList.toggle("task-card--completed", task.completed);
  }
}

/**
 * Remove a task element from the DOM using its task id.
 * @param {string} taskId - Task id
 */
export function deleteTaskUI(taskId) {
  const taskElement = taskList?.querySelector(`[data-task-id="${taskId}"]`);

  if (taskElement) {
    taskElement.remove();
  }

  // Check whether the list is now empty
  const remainingTasks = taskList?.children.length || 0;
  showEmptyState(remainingTasks === 0);
}

/**
 * Render nested subtasks for a task.
 * @param {Array} subtasks - Array of subtask objects or strings
 * @returns {string} HTML string
 */
export function renderSubtasks(subtasks = []) {
  if (!Array.isArray(subtasks) || subtasks.length === 0) {
    return `<p class="subtask-list__empty">No subtasks</p>`;
  }

  const subtaskItems = subtasks
    .map((subtask, index) => {
      const subtaskTitle =
        typeof subtask === "string" ? subtask : subtask.title || `Subtask ${index + 1}`;

      const subtaskCompleted =
        typeof subtask === "object" && subtask !== null ? Boolean(subtask.completed) : false;

      return `
        <li class="subtask-list__item">
          <div class="subtask-card">
            <input
              class="subtask-card__checkbox"
              type="checkbox"
              ${subtaskCompleted ? "checked" : ""}
              disabled
              aria-label="Subtask status"
            />
            <span
              class="subtask-card__label"
              style="text-decoration: ${subtaskCompleted ? "line-through" : "none"};"
            >
              ${escapeHTML(subtaskTitle)}
            </span>
          </div>
        </li>
      `;
    })
    .join("");

  return `<ul class="subtask-list">${subtaskItems}</ul>`;
}

// ============================================================
// Empty State + Filter UI
// ============================================================

/**
 * Show or hide the empty state message.
 * @param {boolean} shouldShow - Whether the empty state should be visible
 */
export function showEmptyState(shouldShow) {
  if (!emptyState) return;
  emptyState.hidden = !shouldShow;
}

/**
 * Set the active task filter and update button styles.
 * @param {string} filter - all | completed | pending
 */
export function setActiveFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("task-filters__button--active", isActive);
  });
}

/**
 * Return the current active filter.
 * @returns {string}
 */
export function getActiveFilter() {
  return activeFilter;
}

/**
 * Bind filter button clicks.
 * Sends the selected filter back to the main app logic.
 * @param {Function} handler - Callback receiving the selected filter
 */
export function bindFilterHandler(handler) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";
      setActiveFilter(selectedFilter);
      handler(selectedFilter);
    });
  });
}

// ============================================================
// Form Helpers
// ============================================================

/**
 * Read the current form values.
 * @returns {{title: string, priority: string, dueDate: string}}
 */
export function getTaskFormValues() {
  return {
    title: taskInput?.value.trim() || "",
    priority: prioritySelect?.value || "medium",
    dueDate: dueDateInput?.value || "",
  };
}

/**
 * Clear the task input after a task is added.
 */
export function clearTaskInput() {
  if (taskInput) {
    taskInput.value = "";
    taskInput.focus();
  }

  if (prioritySelect) {
    prioritySelect.value = "medium";
  }

  if (dueDateInput) {
    dueDateInput.value = "";
  }
}

/**
 * Bind add-task actions.
 * Supports both button click and Enter key press in the task input.
 * @param {Function} handler - Callback for adding a task
 */
export function bindAddTaskHandler(handler) {
  if (addTaskButton) {
    addTaskButton.addEventListener("click", (event) => {
      event.preventDefault();
      handler();
    });
  }

  if (taskInput) {
    taskInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handler();
      }
    });
  }
}

// ============================================================
// Event Delegation
// ============================================================

/**
 * Bind events on the task list using event delegation.
 * This keeps event handling efficient, even when tasks are re-rendered.
 * @param {Object} handlers - Event callbacks
 * @param {Function} handlers.onToggleTask - Called when checkbox changes
 * @param {Function} handlers.onDeleteTask - Called when delete button is clicked
 * @param {Function} [handlers.onSubtaskClick] - Optional callback for subtask button
 */
export function bindTaskListEvents({
  onToggleTask,
  onDeleteTask,
  onSubtaskClick,
}) {
  if (!taskList) return;

  taskList.addEventListener("click", (event) => {
    const target = event.target;
    const taskItem = target.closest(".task-list__item");

    if (!taskItem) return;

    const taskId = taskItem.dataset.taskId;

    if (target.classList.contains("task-card__delete-button")) {
      onDeleteTask?.(taskId);
    }

    if (target.classList.contains("task-card__subtask-button")) {
      onSubtaskClick?.(taskId);
    }
  });

  taskList.addEventListener("change", (event) => {
    const target = event.target;
    const taskItem = target.closest(".task-list__item");

    if (!taskItem) return;

    const taskId = taskItem.dataset.taskId;

    if (target.classList.contains("task-card__checkbox")) {
      onToggleTask?.(taskId);
    }
  });
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Filter tasks based on the selected filter.
 * @param {Array} tasks - Full task array
 * @param {string} filter - all | completed | pending
 * @returns {Array}
 */
function filterTasks(tasks, filter) {
  switch (filter) {
    case "completed":
      return tasks.filter((task) => task.completed);

    case "pending":
      return tasks.filter((task) => !task.completed);

    case "all":
    default:
      return tasks;
  }
}

/**
 * Format a datetime string for display.
 * @param {string} value - ISO date string
 * @returns {string}
 */
function formatDueDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

/**
 * Capitalize the first letter of a word.
 * @param {string} value
 * @returns {string}
 */
function capitalize(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Escape HTML characters to keep rendered text safe.
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value = "") {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}