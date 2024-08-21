/**
 * Displays a task's detailed view in the "show-task" section.
 * This function reveals the task's content, including category, title, description,
 * due date, priority, assigned contacts, and subtasks. It also adjusts the layout
 * and animations.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function showTask(taskIndex) {
  let showContent = document.getElementById("show-task");
  showContent.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  showContent.innerHTML = "";
  showContent.innerHTML += generateShowTask(taskIndex);
  changeColorOfCategoryTitleShow(taskIndex);
  contactsShowLetterRender(taskIndex);
  contactsShowNameRender(taskIndex);
  subtasksShowRender(taskIndex);
  slideInTask();
  heightOfShowTaskAdjust();
}

/**
 * Moves a task to a new category.
 * This function updates the category of a task and hides the dropdown menu.
 * 
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @param {string} newCategory - The new category to assign to the task.
 * @returns {void}
 */
function moveToCategory(taskIndex, newCategory) {
  moveToPhase(taskIndex, newCategory);

  // Hide the dropdown menu after selection
  document.getElementById(`dropdown${taskIndex}`).classList.remove("show");
}

/**
 * Toggles the visibility of the dropdown menu for moving a task.
 * This function shows or hides the dropdown menu and sets up an event listener
 * to close the menu if a click occurs outside of it.
 * @param {number} id - The index of the task in the `tasks` array.
 * @returns {void}
 */
function toggleDropdown(id) {
  const dropdown = document.getElementById(`dropdown${id}`);
  dropdown.classList.add("show");
  
  window.removeEventListener('click', closeDropdownMenu);

  window.addEventListener('click', function(event) {
    closeDropdownMenu(event, id);
  });
}

/**
 * Updates the phase of a task and refreshes the displayed tasks.
 * This function sets the phase of a task and updates the UI accordingly.
 * @param {number} currentDraggedElement - The index of the task being moved.
 * @param {string} phase - The new phase to assign to the task.
 * @returns {void}
 */
function moveToPhase(currentDraggedElement, phase) {
  tasks[currentDraggedElement]["phases"] = phase;
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  styleOfNoTaskDone();
  putData("/tasks", tasks);
}

/**
 * Closes the dropdown menu if a click occurs outside of it.
 * This function hides the dropdown menu when clicking outside of the menu and
 * the card menu.
 * @param {Event} event - The click event object.
 * @param {number} id - The index of the task in the `tasks` array.
 * @returns {void}
 */
function closeDropdownMenu(event, id) {
  const dropdown = document.getElementById(`dropdown${id}`);
  const cardMenu = document.querySelector(`.card-menu`);
  
  if (!cardMenu.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
}

/**
 * Applies a slide-in animation to the task details.
 * This function triggers a CSS animation to slide in the task details from the side.
 * @returns {void}
 */
function slideInTask() {
  let dialog = document.querySelector('.show-task');
  dialog.classList.remove('slide-in');
  setTimeout(() => {
    dialog.classList.add('slide-in');
  }, 50);
}

/**
 * Adjusts the height of the task display container.
 * This function ensures that the height of the task display container is either
 * adjusted automatically if its content is too tall or restricted to a maximum height.
 * @returns {void}
 */
function heightOfShowTaskAdjust() {
  let showContent = document.getElementById('show-task');
  if (showContent.scrollHeight > 650) {
  } else {
    showContent.style.maxHeight = '650px';
  }
}

/**
 * Renders the subtasks for a specific task in the display container.
 * This function generates HTML for each subtask and displays it in the "subtask-show" section.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function subtasksShowRender(taskIndex) {
  let content = document.getElementById('subtask-show');
  content.innerHTML = '';

  if (!Array.isArray(tasks[taskIndex]['subtasks'])) {
    tasks[taskIndex]['subtasks'] = [];
  }

  for (let subtaskIndex = 0; subtaskIndex < tasks[taskIndex]['subtasks'].length; subtaskIndex++) {
      content.innerHTML += `<div class="checkbox-show-content">
          <input type="checkbox" onclick="toggleSubtask(${taskIndex}, ${subtaskIndex})" ${tasks[taskIndex]['subtasks'][subtaskIndex].completed ? 'checked' : ''} id="checkbox${subtaskIndex}">
          <label class="subtask-show-text">${tasks[taskIndex]['subtasks'][subtaskIndex].name}</label>
      </div>`;
  }
}

/**
 * Toggles the completion status of a subtask and updates the progress.
 * This function marks a subtask as completed or not completed and updates the progress bar.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @param {number} subtaskIndex - The index of the subtask in the `subtasks` array.
 * @returns {void}
 */
function toggleSubtask(taskIndex, subtaskIndex) {
  tasks[taskIndex]['subtasks'][subtaskIndex].completed = !tasks[taskIndex]['subtasks'][subtaskIndex].completed;
  UpdateProgress(taskIndex);
}

/**
 * Updates the progress bar for the subtasks of a specific task.
 * This function calculates and displays the progress of completed subtasks in a progress bar.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function UpdateProgress(taskIndex) {
  let subtasks = tasks[taskIndex]['subtasks'];
  if (!Array.isArray(subtasks)) {
    subtasks = [];
  }
  let checkedCount = subtasks.filter(subtask => subtask.completed).length;
  let totalSubtasks = subtasks.length;

  let progress = document.getElementById(`progress-bar${taskIndex}`);
  let numberOfSubtask = document.getElementById(`number-of-subtask${taskIndex}`);

  if (progress && numberOfSubtask) {
    if (totalSubtasks > 0) {
      let progressValue = (checkedCount / totalSubtasks) * 100;
      progress.value = progressValue;
      numberOfSubtask.textContent = `${checkedCount}/${totalSubtasks}`;
    } else {
      progress.value = 0;
      numberOfSubtask.textContent = `0/0`;
    }

    putData(`/tasks/${taskIndex}`, tasks[taskIndex]);
  }
}

/**
 * Renders the initials of assigned contacts in the task details.
 * This function creates HTML elements for each assigned contact's initials and displays them.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function contactsShowLetterRender(taskIndex) {
  let content = document.getElementById('user-show-letter');
  content.innerHTML = ""; // Clear the content first
  if (tasks[taskIndex]['contacts'] && Array.isArray(tasks[taskIndex]['contacts'])) {
    for (let j = 0; j < tasks[taskIndex]['contacts'].length; j++) {
      let letter = tasks[taskIndex]['contacts'][j]['name'].split(" ");
      let result = "";
      for (let name = 0; name < letter.length; name++) {
        result += letter[name].charAt(0).toUpperCase();
      }
      content.innerHTML += `<div class="user-task-content-show" style="background-color:${tasks[taskIndex]['contacts'][j]['color']};">${result}</div>`;
    }
  }
}

/**
 * Renders the names of assigned contacts in the task details.
 * This function creates HTML elements for each assigned contact's name and displays them.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function contactsShowNameRender(taskIndex) {
  let content = document.getElementById('user-show-name');
  content.innerHTML = "";
  if (tasks[taskIndex]['contacts'] && Array.isArray(tasks[taskIndex]['contacts'])) {
    for (let j = 0; j < tasks[taskIndex]['contacts'].length; j++) {
      content.innerHTML += `<div class="user-show-name">${tasks[taskIndex]['contacts'][j]['name']}</div>`;
    }
  }
}

/**
 * Changes the color of the category title based on the task's category.
 * This function adds a CSS class to the category title element based on the category
 * of the task to style it appropriately.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function changeColorOfCategoryTitleShow(taskIndex) {
  let content = document.getElementById(`card-category-title-show${taskIndex}`);
  let category = tasks[taskIndex]["category"];
  if (category.includes("User")) {
    content.classList.add("blue");
  } else if (category.includes("Technical")) {
    content.classList.add("green");
  }
}