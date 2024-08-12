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
  boardBg()
  chooseMedium()
  showUser()
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
 * Returns the HTML template for a contact list item in the edit view.
 * This function generates the HTML structure for each contact item, including the contact's name, initials, and color.
 * @function templateEditContact
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The background color associated with the contact.
 * @returns {string} The HTML string for the contact list item.
 */
function templateEditContact(i, name, initials, color) {
  return `
  <div id="contact-edit-container${i}" onclick="selectEditContact(${i})" class="contact-container" tabindex="1">
      <div class="contact-container-name">
          <span style="background-color: ${color}" id="contact-edit-initals${i}" class="circle-name">${initials}</span>
          <span id="contact-name${i}">${name}</span>
      </div>
      <div class="contact-container-check"></div>
  </div> 
`
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
 * Closes the "Add Task", "Show Task", and "Edit Task" dialogs by sliding them out and hiding the associated overlay.
 * It also resets the contacts and reloads the data.
 * @function closeMe
 * @returns {void}
 */
function closeMe() {
  let dialog3 = document.getElementById("add-task-edit");
  let dialog2 = document.querySelector(".add-task-board");
  let dialog = document.querySelector(".show-task");

  dialog3.classList.remove("slide-in");
  dialog3.classList.add("slide-out");
  dialog2.classList.remove("slide-in");
  dialog2.classList.add("slide-out");
  dialog.classList.remove("slide-in");
  dialog.classList.add("slide-out");

  setTimeout(() => {
    let content = document.getElementById("add-task");
    let showContent = document.getElementById("show-task");
    let editContent = document.getElementById("add-task-edit");
    let overlay = document.getElementsByClassName("overlay")[0];

    content.classList.add("hidden");
    showContent.classList.add("hidden");
    editContent.classList.add("hidden");
    overlay.classList.add("hidden");
  }, 500);

  updateHTML();
  contacts = [];
  selectedEditContacts = [];
  loadData();
}

/**
 * Changes the color of the category title based on the task's category.
 * This function iterates through the tasks and applies a color class to the category title element.
 * @function changeColorOfCategoryTitle
 * @returns {void}
 */
function changeColorOfCategoryTitle() {
  for (let i = 0; i < tasks.length; i++) {
    let content = document.getElementById(`card-category-title${i}`)
    let category = tasks[i]["category"]
    if (category.includes("User")) {
      content.classList.add("blue")
    } else if (category.includes("Technical")) {
      content.classList.add("green")
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
 * Updates the HTML content of the task board by filtering tasks based on their phases
 * and rendering them in their respective columns ("To Do", "In progress", "Await feedback", "Done").
 * This function also updates the styles and contact elements for each task.
 * @function updateHTML
 * @returns {void}
 */
function updateHTML() {
  let toDo = tasks.filter((t) => t["phases"] == "To Do")
  let toDoContent = document.getElementById("new-task-to-do")
  toDoContent.innerHTML = ""

  for (let index = 0; index < toDo.length; index++) {
    const element = toDo[index]
    document.getElementById("new-task-to-do").innerHTML +=
      generateAllTasksHTML(element)
    styleOfNoTaskToDo()
  }

  let inProgress = tasks.filter((t) => t["phases"] == "In progress")
  let inProgressContent = document.getElementById("new-task-in-progress")
  inProgressContent.innerHTML = ""

  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index]
    document.getElementById("new-task-in-progress").innerHTML +=
      generateAllTasksHTML(element)
    styleOfNoTaskInProgress()
  }

  let awaitFeedback = tasks.filter((t) => t["phases"] == "Await feedback")
  document.getElementById("new-task-await").innerHTML = ""
  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index]
    document.getElementById("new-task-await").innerHTML +=
      generateAllTasksHTML(element)
    styleOfNoTaskAwaitFeedback()
  }
  let done = tasks.filter((t) => t["phases"] == "Done")
  document.getElementById("new-task-done").innerHTML = ""
  for (let index = 0; index < done.length; index++) {
    const element = done[index]
    document.getElementById("new-task-done").innerHTML +=
      generateAllTasksHTML(element)
    styleOfNoTaskDone()
  }
  changeColorOfCategoryTitle()
  contactsRender()
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
 * Renders the contact initials for each task in the task board.
 * Displays a maximum of three contacts per task, with an indication if there are more contacts.
 * @function contactsRender
 * @returns {void}
 */
function contactsRender() {
  for (let i = 0; i < tasks.length; i++) {
    let maxContacts = 3;
    let content = document.getElementById(`new-div${i}`);
    content.innerHTML = ""; 

    if (tasks[i]["contacts"] && Array.isArray(tasks[i]["contacts"])) {
      for (
        let j = 0;
        j < Math.min(tasks[i]["contacts"].length, maxContacts);
        j++
      ) {
        let nameParts = tasks[i]["contacts"][j]["name"].split(" ");
        let initials = nameParts
          .map((part) => part.charAt(0).toUpperCase())
          .join("");
        content.innerHTML += `<div class="user-task-content" style="background-color:${tasks[i]["contacts"][j]["color"]};">${initials}</div>`;
      }

      if (tasks[i]["contacts"].length > maxContacts) {
        let additionalContacts = tasks[i]["contacts"].length - maxContacts;
        let numberOfContacts = document.getElementById(`plus-number-contacts${i}`);
        numberOfContacts.innerHTML = `+${additionalContacts}`;
      }
    }
  }
}

/**
 * Generates the HTML structure for a task card, including its subtasks and progress bar.
 * This function creates a draggable task card with a progress bar, subtasks count, and user details.
 * @function generateAllTasksHTML
 * @param {Object} element - The task object containing details such as ID, category, title, description, subtasks, and priority icon.
 * @returns {string} The HTML string representing the task card.
 */
function generateAllTasksHTML(element) {
  const subtasks = Array.isArray(element.subtasks) ? element.subtasks : [];
  return `
    <div id="card-id${element["ID"]}" draggable="true" ondragstart="startDragging(${element["ID"]})" onclick="showTask(${element["ID"]})">
      <div class="card">
        <div id="card-category-title${element["ID"]}" class="card-category-title">${element["category"]}</div>
        <div class="title-description-content">
          <h2 class="card-title">${element["title"]}</h2>
          <p class="card-description">${element["description"]}</p>
        </div>
        ${subtasks.length > 0 ? `
        <div class="progress-bar-content">
          <progress value="${valueOfProgressBar(element["ID"])}" max="100" id="progress-bar${element["ID"]}"></progress>
          <p class="card-subtasks-text">
            <span id="number-of-subtask${element["ID"]}" class="number-of-subtask">
              ${subtasks.filter(subtask => subtask.completed).length}/${subtasks.length}
            </span> Subtasks
          </p>
        </div>` : ''}
        <div class="card-user-content">
          <div class="user-container-board">
            <div class="user-inner-container" id="new-div${element["ID"]}"></div>
            <div class="number-of-contacts" id="plus-number-contacts${element["ID"]}"></div>
          </div>
          <img src="${element["prioIcon"]}" alt="">
        </div>
      </div>
    </div>`;
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
