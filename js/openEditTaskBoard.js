/**
 * Opens the edit view for a specific task, allowing users to modify task details.
 * This function hides the current task view, shows the edit task view, and populates
 * the edit fields with the existing task data. It also displays the task's assigned
 * contacts and subtasks for editing.
 * @param {number} taskIndex - The index of the task in the `tasks` array to be edited.
 * @returns {void}
 */
function openEdit(taskIndex) {
  let showContent = document.getElementById("show-task");
  showContent.classList.add("hidden");
  let editContent = document.getElementById("add-task-edit");
  editContent.classList.remove("hidden");
  editContent.classList.add("slide-in");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");

  let title = document.getElementById("add-task-edit-title");
  let hiddenInput = document.getElementById("hidden-input");
  let description = document.getElementById("add-task-edit-description");
  let assignedTo = document.getElementById("add-task-assigned");
  let dates = document.getElementById("task-edit-date");

  title.value = tasks[taskIndex]["title"];
  hiddenInput.value = tasks[taskIndex]["title"];
  description.value = tasks[taskIndex]["description"];
  assignedTo.value = tasks[taskIndex]["contacts"][taskIndex];
  dates.value = tasks[taskIndex]["date"];

  let selected = tasks[taskIndex]["contacts"];
  showSelectedContactsEdit(selected);

  generateEditTask(taskIndex);
}

/**
 * Updates the list of selected contacts for editing by marking them as selected.
 * This function updates the `selectedEditContacts` array with contacts that are
 * currently selected and also updates their status in the global `contacts` array.
 * @param {Array<Object>} selected - An array of selected contact objects, each containing `name` and `color`.
 * @returns {void}
 */
function showSelectedContactsEdit(selected) {
  selectedEditContacts = [];
  for (let i = 0; i < selected.length; i++) {
    const selectedContact = selected[i];
    let contactColor = selectedContact['color'];
    let contactName = selectedContact['name'];
    let index = contacts.findIndex(contacts => contacts.name === contactName);

    if (index !== -1) {
      let contact = contacts[index];
      contacts.splice(index, 1, { ...contact, selected: true });
      selectedEditContacts.push({ ...contact, selected: true });
    }
  }
}

/**
 * Generates and renders the edit view for a specific task.
 * This function activates the edit buttons, renders the subtasks and contacts,
 * and generates input fields for adding new subtasks.
 * @param {number} taskIndex - The index of the task in the `tasks` array to be edited.
 * @returns {void}
 */
function generateEditTask(taskIndex) {
  activeEditButton();
  activeButton(taskIndex);
  subtasksEditRender(taskIndex);
  contactsEditRender(taskIndex)
  renderEditContacts('add-task-contacts-container-edit');
  generateInputEditSubtask(taskIndex);

}

/**
 * Renders the contacts associated with a task for editing.
 * This function updates the user interface with the selected contacts' initials and colors.
 * @param {number} taskIndex - The index of the task in the `tasks` array to be edited.
 * @returns {void}
 */
function contactsEditRender(taskIndex) {
  let content = document.getElementsByClassName('user-content-edit-letter')[0];
  content.innerHTML = '';
  for (let j = 0; j < selectedEditContacts.length; j++) {
    let letter = selectedEditContacts[j]['name'].split(" ");
    let result = "";
    for (let name = 0; name < letter.length; name++) {
      result += letter[name].charAt(0).toUpperCase();
    }
    content.innerHTML += `<div class="user-task-content" style="background-color:${tasks[taskIndex]['contacts'][j]['color']};">${result}</div>`;
  }
}

/**
 * Confirms and updates a subtask with the new value.
 * This function updates the subtask with the new value entered by the user, 
 * and refreshes the subtasks list and progress accordingly.
 * @param {number} taskIndex - The index of the task in the `tasks` array that contains the subtask.
 * @param {number} subtaskIndex - The index of the subtask within the task.
 * @returns {void}
 */
function confirmEdit(taskIndex, subtaskIndex) {
  let inputSubtask = document.getElementById(`edit-input-board${subtaskIndex}`).value.trim();

  if (inputSubtask === "") {
    return;
  }

  if (!Array.isArray(tasks[taskIndex].subtasks)) {
    tasks[taskIndex].subtasks = [];
  }

  tasks[taskIndex].subtasks[subtaskIndex] = { name: inputSubtask, completed: false };

  subtasksEditRender(taskIndex);

  UpdateProgress(taskIndex);
  putData("/tasks", tasks);
}

/**
 * Initiates the editing mode for a specific subtask.
 * This function reveals the input field for editing a subtask and hides other related elements.
 * @param {number} taskIndex - The index of the task in the `tasks` array containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask within the task.
 * @returns {void}
 */
function editBoardSubtask(subtaskIndex, taskIndex) {
  document.getElementById(`edit-input-board-content${taskIndex}`).classList.remove('hidden');
  document.getElementById(`checkbox-edit-content${taskIndex}`).classList.add('hidden');
  document.getElementById(`subtasks-icon${taskIndex}`).classList.add('hidden');
  let subtaskInput = document.getElementById(`edit-input-board${taskIndex}`).value;
  let labelOfSubtask = document.getElementById(`subtask-edit-text${taskIndex}`);
  labelOfSubtask.innerHTML = subtaskInput;
}

/**
 * Deletes a subtask from a task in the edit view.
 * If the task only has one subtask, the subtasks array is cleared. 
 * For multiple subtasks, the specified subtask is removed. 
 * The function updates the UI and task progress accordingly.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @param {number} subtaskIndex - The index of the subtask within the task.
 * @returns {void}
 */
function deleteEditBoardSubtask(taskIndex, subtaskIndex) {
  if (tasks[taskIndex]["subtasks"].length === 1) {
    if (Array.isArray(tasks[taskIndex].subtasks)) {
      tasks[taskIndex].subtasks = "";
    }
    subtasksEditRender(taskIndex);
    UpdateProgress(taskIndex);
  } else {
    tasks[taskIndex]["subtasks"].splice(subtaskIndex, 1);
    subtasksEditRender(taskIndex);
    UpdateProgress(taskIndex);
  }
  putData("/tasks", tasks);
}

/**
 * Opens the icons for adding subtasks in the edit view.
 * This function shows the subtask icons and hides the plus icon.
 * @returns {void}
 */
function openEditSubtaskIcons() {
  document.getElementById('add-task-subtasks-edit-icons').classList.remove('d-none');
  document.getElementById('plus-edit-icon').classList.add('d-none');
}

/**
 * Closes the icons for adding subtasks in the edit view.
 * This function hides the subtask icons and shows the plus icon.
 * @returns {void}
 */
function closeEditSubtaskIcons() {
  document.getElementById('add-task-subtasks-edit-icons').classList.add('d-none');
  document.getElementById('plus-edit-icon').classList.remove('d-none');
}

/**
 * Adds a new subtask to a specific task.
 * This function retrieves the subtask value from the input field, adds it to the task's subtasks,
 * and updates the UI and task progress accordingly.
 * @param {number} taskIndex - The index of the task in the `tasks` array to which the subtask is being added.
 * @returns {void}
 */
function addEditSubtasks(taskIndex) {
  let inputSubtask = document.getElementById(`add-task-edit-subtasks${taskIndex}`).value.trim();

  if (inputSubtask === "") {
    return;
  }

  if (!Array.isArray(tasks[taskIndex].subtasks)) {
    tasks[taskIndex].subtasks = [];
  }

  tasks[taskIndex].subtasks.push({ name: inputSubtask, completed: false });

  generateEditSubtask(taskIndex);

  setTimeout(() => {
    UpdateProgress(taskIndex);
  }, 100);

  putData("/tasks", tasks);

  document.getElementById(`add-task-edit-subtasks${taskIndex}`).value = "";
}

/**
 * Saves the edited task details.
 * This function updates the task with new title, description, date, priority, and contacts,
 * and then saves the changes to the server and updates the HTML view.
 * @returns {Promise<void>}
 */
async function saveEditTask() {
  let title = document.getElementById("add-task-edit-title").value;
  let hiddenInput = document.getElementById("hidden-input").value;
  let description = document.getElementById("add-task-edit-description").value;
  let date = document.getElementById("task-edit-date").value;

  if (title.trim() === "" || date.trim() === "") {
    return;
  } else {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title === hiddenInput) {
        tasks[i].title = title;
        tasks[i].description = description;
        tasks[i].date = date;
        tasks[i].prioIcon = prioBtn;
        tasks[i].prio = prioText;
        if (selectedEditContacts.length > 0) {
          tasks[i]["contacts"] = selectedEditContacts.slice();
        }
        ensureSubtasksArray(tasks[i]);
        tasks[i]["subtasks"] = Array.isArray(subtasks) ? subtasks : [];
        keepPrioButton(i);
        break;
      }
    }
  }

  await putData("/tasks", tasks);
  updateHTML();
  closeMe();
}

/**
 * Ensures that the subtasks property of a task is an array.
 * If the subtasks property is not an array, it initializes it as an empty array.
 * @param {Object} task - The task object to be checked and updated.
 * @returns {void}
 */
function ensureSubtasksArray(task) {
  if (!Array.isArray(task.subtasks)) {
    task.subtasks = [];
  }
}

/**
 * Updates the priority of a task based on the currently active priority button.
 * This function sets the priority and priority icon of the task according to which 
 * priority button is active.
 * @param {number} taskIndex - The index of the task in the `tasks` array to be updated.
 * @returns {void}
 */
function keepPrioButton(taskIndex) {
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  if (/(\s|^)active(\s|$)/.test(urgentEditbutton.className)) {
    tasks[taskIndex]["prio"] = 'Urgent';
    tasks[taskIndex]["prioIcon"] = "./assets/img/icon_PrioAltaRed.svg";
  } else if (/(\s|^)active(\s|$)/.test(mediumEditbutton.className)) {
    tasks[taskIndex]["prio"] = 'Medium';
    tasks[taskIndex]["prioIcon"] = "./assets/img/icon_PrioMediaOrange.svg";
  } else if (/(\s|^)active(\s|$)/.test(lowEditbutton.className)) {
    tasks[taskIndex]["prio"] = 'Low';
    tasks[taskIndex]["prioIcon"] = './assets/img/icon_PrioBajaGreen.svg';
  } else {
    tasks[taskIndex]["prio"] = '';
    tasks[taskIndex]["prioIcon"] = '';
  }
}

/**
 * Activates the priority buttons for editing a task.
 * This function sets up event listeners for the priority buttons and handles their active states.
 * @returns {void}
 */
function activeEditButton() {
  let lastClick = null;
  urgentButtenEdit(lastClick);
  mediumButtonEdit(lastClick);
  lowButtonEdit(lastClick);
}

/**
 * Sets up the event listener for the urgent priority button in the edit view.
 * This function manages the active state of the urgent priority button and updates
 * the priority icon and text accordingly.
 * @param {Object} lastClick - The previously clicked priority button, if any.
 * @returns {void}
 */
function urgentButtenEdit(lastClick) {
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  urgentEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.add("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.remove("active");
    lastClick = urgentEditbutton;
    prioText = 'Urgent'
    prioIcon = './assets/img/icon_PrioAltaWhite.svg';
    prioBtn = "./assets/img/icon_PrioAltaRed.svg";
    changeIconOfUrgent();
  });
}

/**
 * Sets up the event listener for the medium priority button in the edit view.
 * This function manages the active state of the medium priority button and updates
 * the priority icon and text accordingly.
 * @param {HTMLElement} lastClick - The previously clicked priority button, if any.
 * @returns {void}
 */
function mediumButtonEdit(lastClick) {
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  mediumEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.add("active");
    lowEditbutton.classList.remove("active");
    lastClick = mediumEditbutton;
    prioText = 'Medium';
    prioIcon = './assets/img/icon_PrioMediaWhite.svg';
    prioBtn = './assets/img/icon_PrioMediaOrange.svg';
    changeIconOfMedium();
  });
}

/**
 * Sets up the event listener for the low priority button in the edit view.
 * This function manages the active state of the low priority button and updates
 * the priority icon and text accordingly.
 * @param {HTMLElement} lastClick - The previously clicked priority button, if any.
 * @returns {void}
 */
function lowButtonEdit(lastClick) {
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  lowEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.add("active");
    lastClick = lowEditbutton;
    prioText = 'Low';
    prioIcon = './assets/img/icon_PrioBajaWhite.svg';
    prioBtn = './assets/img/icon_PrioBajaGreen.svg';
    changeIconOfLow();
  });
}

/**
 * Activates the appropriate priority button based on the task's current priority.
 * This function highlights the button corresponding to the task's priority and updates
 * the priority icon accordingly.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function activeButton(taskIndex) {
  if (tasks[taskIndex]["prio"] === "Low") {
    document.getElementsByClassName("low-edit-button")[0].classList.add("active");
    prioIcon = './assets/img/icon_PrioBajaWhite.svg';
    changeIconOfLow();
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");;
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if (tasks[taskIndex]["prio"] === "Urgent") {
    document.getElementsByClassName("urgent-edit-button")[0].classList.add("active");
    prioIcon = './assets/img/icon_PrioAltaWhite.svg';
    changeIconOfUrgent();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if (tasks[taskIndex]["prio"] === "Medium") {
    document.getElementsByClassName("medium-edit-button")[0].classList.add("active");
    prioIcon = './assets/img/icon_PrioMediaWhite.svg';
    changeIconOfMedium();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
  } else {
    prio = '';
    prioBtn = '';
  }
}

/**
 * Changes the icon of the urgent priority button and updates the other priority icons.
 * This function sets the urgent priority icon to the current `prioIcon`, while updating
 * the icons of the medium and low priorities to their default images.
 * @returns {void}
 */
function changeIconOfUrgent() {
  let urgent = document.getElementById('urgent-img');
  urgent.src = prioIcon;
  let medium = document.getElementById('medium-img');
  medium.src = './assets/img/icon_PrioMediaOrange.svg';
  let low = document.getElementById('low-img');
  low.src = './assets/img/icon_PrioBajaGreen.svg';
}

/**
 * Changes the icon of the medium priority button and updates the other priority icons.
 * This function sets the medium priority icon to the current `prioIcon`, while updating
 * the icons of the urgent and low priorities to their default images.
 * @returns {void}
 */
function changeIconOfMedium() {
  let medium = document.getElementById('medium-img');
  medium.src = prioIcon;
  let urgent = document.getElementById('urgent-img');
  urgent.src = './assets/img/icon_PrioAltaRed.svg';
  let low = document.getElementById('low-img');
  low.src = './assets/img/icon_PrioBajaGreen.svg';
}

/**
 * Changes the icon of the low priority button and updates the other priority icons.
 * This function sets the low priority icon to the current `prioIcon`, while updating
 * the icons of the urgent and medium priorities to their default images.
 * @returns {void}
 */
function changeIconOfLow() {
  let low = document.getElementById('low-img');
  low.src = prioIcon;
  let medium = document.getElementById('medium-img');
  medium.src = './assets/img/icon_PrioMediaOrange.svg';
  let urgent = document.getElementById('urgent-img');
  urgent.src = './assets/img/icon_PrioAltaRed.svg';
}