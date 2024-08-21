let subtask = []
let user = []
tasks = []
prioBtn = ""
let prioIcon = ""
let prioText = ""

/**
 * Initializes the board by loading tasks, rendering contacts, and setting up the board's appearance.
 * This function is asynchronous and waits for the inclusion of external components.
 * @async
 * @function initBoard
 * @returns {Promise<void>}
 */
async function initBoard() {
  await initInclude()
  loadTasksBoard()
  updateHTML()
  renderEditContacts("add-task-contacts-container-edit")
  renderContacts("add-task-contacts-container")
  chooseMedium()
  showUser()
  renderDateInput()
  boardBg()
}

/**
 * Renders the list of contacts in the specified container for editing.
 * This function generates the HTML for each contact and applies the necessary styles if a contact is selected.
 * @function renderEditContacts
 * @param {string} contactContainer - The ID of the HTML container where the contacts will be rendered.
 * @returns {void}
 */
function renderEditContacts(contactContainer) {
  let container = document.getElementById(`${contactContainer}`)
  container.innerHTML = ""
  for (let i = 0; i < contacts.length; i++) {
    let name = contacts[i]["name"]
    let initials = getInitials(name)
    let color = contacts[i]["color"]
    container.innerHTML += templateEditContact(i, name, initials, color)
    if (contacts[i]["selected"] === true) {
      document
        .getElementById(`contact-edit-container${i}`)
        .classList.add("contact-container-edit-focus")
    } else {
      document
        .getElementById(`contact-edit-container${i}`)
        .classList.remove("contact-container-edit-focus")
    }
  }
}

/**
 * Opens the "Add Task" form by making the relevant HTML elements visible and animating the slide-in effect.
 * @function openAddTask
 * @returns {void}
 */
function openAddTask() {
  let content = document.getElementById("add-task")
  content.classList.remove("hidden")
  let overlay = document.getElementsByClassName("overlay")[0]
  overlay.classList.remove("hidden")
  let dialog = document.querySelector(".add-task-board")
  dialog.classList.remove("slide-out")
  setTimeout(() => {
    dialog.classList.add("slide-in")
  }, 50)
}

/**
 * Closes a dialog by applying slide-out animations and hiding the element after a delay.
 * 
 * @param {string} dialogSelector - The CSS selector of the dialog to close.
 * @returns {void}
 */
function closeDialog(dialogSelector) {
  const dialog = document.querySelector(dialogSelector);
  if (dialog) {
    dialog.classList.remove("slide-in");
    dialog.classList.add("slide-out");
  }
}

/**
 * Hides the specified dialog and overlay after a delay.
 * 
 * @param {string[]} dialogSelectors - Array of CSS selectors for dialogs to hide.
 * @param {string} overlaySelector - The CSS selector for the overlay to hide.
 * @returns {void}
 */
function hideDialogsAndOverlay(dialogSelectors, overlaySelector) {
  setTimeout(() => {
    dialogSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add("hidden");
      }
    });

    const overlay = document.querySelector(overlaySelector);
    if (overlay) {
      overlay.classList.add("hidden");
    }
  }, 500);
}

/**
 * Resets the contacts and reloads the data.
 * 
 * @returns {void}
 */
function resetContactsAndLoadData() {
  contacts = [];
  selectedEditContacts = [];
  loadData();
}

/**
 * Closes the "Add Task", "Show Task", and "Edit Task" dialogs by sliding them out and hiding the associated overlay.
 * It also resets the contacts and reloads the data.
 * 
 * @function closeMe
 * @returns {void}
 */
function closeMe() {
  closeDialog("#add-task-edit");
  closeDialog(".add-task-board");
  closeDialog(".show-task");

  hideDialogsAndOverlay(["#add-task", "#show-task", "#add-task-edit"], ".overlay");

  updateHTML();
  resetContactsAndLoadData();
}

/**
 * Changes the color of the category title based on the task's category.
 * This function iterates through the tasks and applies a color class to the category title element.
 * @function changeColorOfCategoryTitle
 * @returns {void}
 */
function changeColorOfCategoryTitle() {
  for (let i = 0; i < tasks.length; i++) {
    let content = document.getElementById(`card-category-title${i}`);
    if (content) {  // Check if the element exists
      let category = tasks[i]["category"];
      if (category.includes("User")) {
        content.classList.add("blue");
      } else if (category.includes("Technical")) {
        content.classList.add("green");
      }
    } else {
      console.warn(`Element with ID card-category-title${i} not found.`);
    }
  }
}

/**
 * Deletes a task from the tasks list based on its index.
 * This function removes the task, reassigns task IDs, updates the data, and refreshes the HTML content.
 * @function deleteTask
 * @param {number} taskIndex - The index of the task to be deleted in the tasks array.
 * @returns {void}
 */
function deleteTask(taskIndex) {
  tasks.splice(taskIndex, 1)
  for (let j = 0; j < tasks.length; j++) {
    tasks[j].ID = j
  }
  putData("/tasks", tasks)
  updateHTML()
  styleOfNoTaskToDo()
  styleOfNoTaskInProgress()
  styleOfNoTaskAwaitFeedback()
  closeMe()
}

/**
 * Searches for tasks based on the user's input.
 * This function filters tasks by title or description and shows/hides task cards accordingly.
 * @function searchTask
 * @returns {void}
 */
function searchTask() {
  let search = document.getElementById("search-input").value.toLowerCase()
  for (let i = 0; i < tasks.length; i++) {
    let TaskCard = document.getElementById(`card-id${i}`)
    const title = tasks[i]["title"].toLowerCase()
    const description = tasks[i]["description"].toLowerCase()
    if (TaskCard) {
      if (title.includes(search) || description.includes(search)) {
        TaskCard.style.display = "block"
      } else {
        TaskCard.style.display = "none"
      }
    } else {
      console.log("Task Card not Found")
    }
  }
}

/**
 * Converts a date string from "YYYY-MM-DD" format to "DD/MM/YYYY" format.
 * @function convertDate
 * @param {string} date - The date string in "YYYY-MM-DD" format.
 * @returns {string} The converted date string in "DD/MM/YYYY" format.
 */
function convertDate(date) {
  let datePart = date.split("-")
  let newDate = datePart[2] + "/" + datePart[1] + "/" + datePart[0]
  return newDate
}

let currentDraggedElement

/**
 * Updates the HTML content for task phases and renders category titles and contacts.
 */
function updateHTML() {
  updateTaskPhase("To Do", "new-task-to-do", styleOfNoTaskToDo);
  updateTaskPhase("In progress", "new-task-in-progress", styleOfNoTaskInProgress);
  updateTaskPhase("Await feedback", "new-task-await", styleOfNoTaskAwaitFeedback);
  updateTaskPhase("Done", "new-task-done", styleOfNoTaskDone);

  changeColorOfCategoryTitle();
  contactsRender();
}

/**
 * Updates the HTML content for a specific task phase.
 * 
 * @param {string} phase - The phase to filter tasks by.
 * @param {string} containerId - The ID of the HTML container element.
 * @param {Function} styleFunction - The function to call for styling the container.
 */
function updateTaskPhase(phase, containerId, styleFunction) {
  const tasksInPhase = tasks.filter(task => task["phases"] === phase);
  const container = document.getElementById(containerId);

  if (container) {
    container.innerHTML = ""; // Clear existing content

    tasksInPhase.forEach(task => {
      container.innerHTML += generateAllTasksHTML(task);
    });

    styleFunction();
  }
}

/**
 * Initiates the dragging process by setting the currentDraggedElement to the task's ID.
 * This function is typically called when a user starts dragging a task.
 * @function startDragging
 * @param {string} id - The ID of the task being dragged.
 * @returns {void}
 */
function startDragging(id) {
  currentDraggedElement = id
}

/**
 * Calculates the progress of a task based on the completion of its subtasks.
 * The progress is returned as a percentage value (0 to 100).
 * @function valueOfProgressBar
 * @param {number} taskIndex - The index of the task in the tasks array.
 * @returns {number} The percentage of subtasks completed, as a value between 0 and 100.
 */
function valueOfProgressBar(taskIndex) {
  const task = tasks[taskIndex];
  if (!task || !Array.isArray(task["subtasks"])) {
    return 0;
  }
  const totalSubtasks = task["subtasks"].length;
  const completedSubtasks = task["subtasks"].filter(subtask => subtask.completed).length;
  if (totalSubtasks === 0) {
    return 0;
  }
  return (completedSubtasks / totalSubtasks) * 100;
}

/**
 * Renders the contacts for each task.
 * Iterates through each task and updates the contact display.
 */
function contactsRender() {
  tasks.forEach((task, index) => {
    const content = document.getElementById(`new-div${index}`);
    const numberOfContacts = document.getElementById(`plus-number-contacts${index}`);

    if (content) {
      content.innerHTML = "";

      if (task["contacts"] && Array.isArray(task["contacts"])) {
        renderContactInitials(task["contacts"], content);
        updateAdditionalContacts(task["contacts"].length, numberOfContacts);
      }
    }
  });
}

/**
 * Renders contact initials as user-task-content elements.
 * 
 * @param {Array<Object>} contacts - Array of contact objects.
 * @param {HTMLElement} container - The HTML element to render contacts into.
 */
function renderContactInitials(contacts, container) {
  const maxContacts = 3;
  contacts.slice(0, maxContacts).forEach(contact => {
    const initials = generateInitialsContact(contact["name"]);
    container.innerHTML += `<div class="user-task-content" style="background-color:${contact["color"]};">${initials}</div>`;
  });
}

/**
 * Generates initials from a full name.
 * 
 * @param {string} name - The full name of the contact.
 * @returns {string} - The initials of the contact.
 */
function generateInitialsContact(name) {
  return name.split(" ")
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * Updates the display of additional contacts if there are more than the maximum allowed.
 * 
 * @param {number} numberOfContacts - Total number of contacts.
 * @param {HTMLElement} element - The HTML element to display additional contacts.
 */
function updateAdditionalContacts(numberOfContacts, element) {
  const maxContacts = 3;
  if (element) {
    if (numberOfContacts > maxContacts) {
      const additionalContacts = numberOfContacts - maxContacts;
      element.innerHTML = `+${additionalContacts}`;
    } else {
      element.innerHTML = "";
    }
  }
}

/**
 * Prevents the default behavior of a drag event, allowing drop operations.
 * @function allowDrop
 * @param {Event} ev - The drag event.
 * @returns {void}
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a different phase and updates the task board and backend data.
 * @function moveTo
 * @param {string} phase - The phase to move the task to (e.g., "To Do", "In progress", "Await feedback", "Done").
 * @returns {void}
 */
function moveTo(phase) {
  tasks[currentDraggedElement]["phases"] = phase;
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  styleOfNoTaskDone();
  putData("/tasks", tasks);
}

/**
 * Toggles the visibility of the "No tasks" message for the "To Do" phase based on the presence of tasks.
 * @function styleOfNoTaskToDo
 * @returns {void}
 */
function styleOfNoTaskToDo() {
  let toDoContent = document.getElementById("new-task-to-do");
  if (toDoContent.childElementCount > 0) {
    document.getElementById("no-task-to-do").classList.add("hidden");
  } else {
    document.getElementById("no-task-to-do").classList.remove("hidden");
  }
}

/**
 * Toggles the visibility of the "No tasks" message for the "In progress" phase based on the presence of tasks.
 * @function styleOfNoTaskInProgress
 * @returns {void}
 */
function styleOfNoTaskInProgress() {
  let inProgressContent = document.getElementById("new-task-in-progress");
  if (inProgressContent.childElementCount > 0) {
    document.getElementById("no-task-in-progress").classList.add("hidden");
  } else {
    document.getElementById("no-task-in-progress").classList.remove("hidden");
  }
}

/**
 * Toggles the visibility of the "No tasks" message for the "Await feedback" phase based on the presence of tasks.
 * @function styleOfNoTaskAwaitFeedback
 * @returns {void}
 */
function styleOfNoTaskAwaitFeedback() {
  let awaitFeedbackContent = document.getElementById("new-task-await");
  if (awaitFeedbackContent.childElementCount > 0) {
    document.getElementById("no-task-await").classList.add("hidden");
  } else {
    document.getElementById("no-task-await").classList.remove("hidden");
  }
}

/**
 * Toggles the visibility of the "No tasks" message for the "Done" phase based on the presence of tasks.
 * @function styleOfNoTaskDone
 * @returns {void}
 */
function styleOfNoTaskDone() {
  let doneContent = document.getElementById("new-task-done");
  if (doneContent.childElementCount > 0) {
    document.getElementById("no-task-done").classList.add("hidden");
  } else {
    document.getElementById("no-task-done").classList.remove("hidden");
  }
}

/**
 * Redirects the user to the "Add Task" page.
 * @function checkwidthForAddTask
 * @returns {void}
 */
function checkwidthForAddTask() {
  window.location.href = "./add_task.html"
}

/**
 * Updates the click event handler for the plus buttons based on the window width.
 * If the window width is less than or equal to 1350 pixels, the button redirects to the "Add Task" page.
 * Otherwise, it opens the "Add Task" dialog.
 * @function updateButtonOnClick
 * @returns {void}
 */
function updateButtonOnClick() {
  let plusButton = document.getElementsByClassName("plus-btn")
  if (plusButton.length > 0) {
    if (window.innerWidth <= 1350) {
      for (let i = 0; i < plusButton.length; i++) {
        plusButton[i].setAttribute(
          "onclick",
          "window.location.href = './add_task.html'"
        )
      }
    } else {
      for (let i = 0; i < plusButton.length; i++) {
        plusButton[i].setAttribute("onclick", "openAddTask()")
      }
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateButtonOnClick()
  window.addEventListener("resize", updateButtonOnClick)
})

/**
 * Adds the "bg-focus" class to the board link element, potentially to highlight it.
 * @function boardBg
 * @returns {void}
 */
function boardBg() {
  document.getElementById("link-board").classList.add("bg-focus")
}

/**
 * Handles the click event on a card.
 * Shows the task details if the window width is greater than 768 pixels.
 * 
 * @param {string} cardId - The ID of the card being clicked.
 */
function handleCardClick(cardId) {
  if (window.innerWidth > 768) {
    showTask(cardId);
  }
}

/**
 * Handles the click event on a top content card.
 * Stops the event from propagating and toggles the dropdown associated with the card.
 * 
 * @param {Event} event - The click event.
 * @param {string} cardId - The ID of the card being clicked.
 */
function handleTopContentCardClick(event, cardId) {
  event.stopPropagation();
  if (!event.target.closest('.dropdown-content')) {
    toggleDropdown(cardId);
  }
}

/**
 * Toggles the visibility of the dropdown menu for the specified card.
 * Closes any other open dropdowns before opening the specified one.
 * 
 * @param {string} cardId - The ID of the card to toggle the dropdown for.
 */
function toggleDropdown(cardId) {
  const allDropdowns = document.querySelectorAll('.dropdown-content');

  allDropdowns.forEach(dropdown => {
    if (dropdown.id !== `dropdown${cardId}`) {
      dropdown.classList.remove('show');
    }
  });
  const dropdown = document.getElementById(`dropdown${cardId}`);
  dropdown.classList.toggle('show');
}

/**
 * Handles the dragenter event.
 * Prevents the default behavior and highlights the drop zone if it's not already highlighted.
 * 
 * @param {Event} event - The dragenter event.
 */
function handleDragEnter(event) {
  event.preventDefault();
  const dropZone = event.target.closest('.inner-management-content');
  if (dropZone && !dropZone.classList.contains('highlight')) {
    dropZone.classList.add('highlight');
  }
}

/**
 * Handles the dragleave event.
 * Removes the highlight from the drop zone if the related target is not contained within it.
 * 
 * @param {Event} event - The dragleave event.
 */
function handleDragLeave(event) {
  const dropZone = event.target.closest('.inner-management-content');
  if (dropZone && !dropZone.contains(event.relatedTarget)) {
    dropZone.classList.remove('highlight');
  }
}

/**
 * Handles the drop event.
 * Prevents the default behavior, performs the drop action by moving the dragged item, and removes the highlight from the drop zone.
 * 
 * @param {Event} event - The drop event.
 */

function handleDrop(event) {
  event.preventDefault();
  const dropZone = event.target.closest('.inner-management-content');
  if (dropZone) {
    moveTo(dropZone.getAttribute('data-phase'));
    dropZone.classList.remove('highlight');
  }
}

/**
 * Handles the dragover event.
 * Prevents the default behavior to allow dropping and sets the drop effect to 'move'.
 * 
 * @param {Event} event - The dragover event.
 */
function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function renderDateInputForTask() {
  const today = new Date(); // Heutiges Datum
  let year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, '0');
  let day = today.getDate().toString().padStart(2, '0');

  const newDate = `${year}-${month}-${day}`;
  
  // Verwende die ID aus deinem HTML-Code
  const dateInput = document.getElementById('task-edit-date');
  
  if (dateInput) {
    dateInput.min = newDate;
    console.log("Min date set to:", newDate); // Debugging: Überprüfen, ob das Minimum gesetzt wird
  } else {
    console.error("Date input with ID 'task-edit-date' not found!");
  }
}