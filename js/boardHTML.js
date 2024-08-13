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
 * Creates the HTML structure for a contact search result item.
 * @function templateEditContactSearch
 * @param {number} i - The index of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The background color for the contact's initials.
 * @returns {string} The HTML string representing the contact search result item.
 */
function templateEditContactSearch(i, name, initials, color) {
  return `
  <div id="contact-edit-container${i}" onclick="selectEditContactSearch(${i})" class="contact-container" tabindex="1">
    <div class="contact-container-name">
      <span style="background-color: ${color}" id="contact-edit-initals${i}" class="circle-name">${initials}</span>
      <span id="contact-name${i}">${name}</span>
    </div>
    <div class="contact-container-check"></div>
  </div> 
  `;
}

/**
 * Generates the HTML input field for adding new subtasks in the edit view.
 * This function creates an input field with a placeholder and attaches event handlers
 * for opening and closing the subtask icons.
 * @param {number} taskIndex - The index of the task in the `tasks` array for which subtasks are being edited.
 * @returns {void}
 */
function generateInputEditSubtask(taskIndex) {
  let content = document.getElementsByClassName(`input-edit-subtask`)[0];
  content.innerHTML = `      
  <input id="add-task-edit-subtasks${taskIndex}" class="inputfield" type="text"
  placeholder="Add new subtask" maxlength="26" autocomplete="off" onclick="openEditSubtaskIcons()"/>
  <div id="add-task-subtasks-edit-icons" class="subtasks-icon d-none">
    <img  src="./assets/img/icon_closeVectorBlack.svg" alt="Delete" onclick="closeEditSubtaskIcons()">
    <div class="parting-line subtasks-icon-line"></div>
    <img id="add-subtask-button" src="./assets/img/icon_done.svg" alt="confirm" onclick="addEditSubtasks(${taskIndex})">
  </div>
  <img src="./assets/img/icon_subtasks.svg" class="plus-icon-edit-subtasks" id="plus-edit-icon" onclick="openEditSubtaskIcons()"/>`;
}

/**
 * Renders the list of subtasks in the edit view.
 * This function generates HTML for displaying subtasks with options to edit or delete each subtask.
 * @param {number} taskIndex - The index of the task in the `tasks` array for which subtasks are being edited.
 * @returns {void}
 */
function subtasksEditRender(taskIndex) {
  let content = document.getElementById('new-subtask');
  content.innerHTML = '';
  for (let j = 0; j < tasks[taskIndex]['subtasks'].length; j++) {
    let subtask = tasks[taskIndex]['subtasks'][j];
    content.innerHTML += `
      <div class="checkbox-edit-content">
        <div id="checkbox-edit-content${j}" class="checkbox-show-content">
          <input type="checkbox" ${subtask.completed ? 'checked' : ''} id="check-sub${j}" onclick="toggleSubtask(${taskIndex}, ${j})">
          <label id="subtask-edit-text${j}" class="subtask-show-text">${subtask.name}</label>
        </div>
        <div id="edit-input-board-content${j}" class="subtasks-icon input-subtask-edit-content hidden">
          <input type="text" class="edit-input-board" id="edit-input-board${j}" value="${subtask.name}">
          <div class="edit-buttons-content">
            <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="./assets/img/icon_delete.svg" alt="delete">
            <div class="parting-line subtasks-icon-line"></div>
            <img onclick="confirmEdit(${taskIndex}, ${j})" src="./assets/img/icon_done.svg" alt="confirm">
          </div>
        </div>
        <div id="subtasks-icon${j}" class="subtasks-icon subtasks-icon-hidden">
          <img onclick="editBoardSubtask(${taskIndex}, ${j})" src="./assets/img/icon_edit.svg" alt="edit">
          <div class="parting-line subtasks-icon-line"></div>
          <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="./assets/img/icon_delete.svg" alt="delete">
        </div>
      </div>`;
  }
}

/**
 * Generates and renders the HTML for subtasks in the edit view.
 * This function creates HTML elements for each subtask, including options to edit or delete them.
 * @param {number} taskIndex - The index of the task in the `tasks` array for which subtasks are being rendered.
 * @returns {void}
 */
function generateEditSubtask(taskIndex) {
  let list = document.getElementById('new-subtask');
  list.innerHTML = '';
  for (let i = 0; i < tasks[taskIndex]["subtasks"].length; i++) {
    let subtask = tasks[taskIndex]["subtasks"][i];
    list.innerHTML += `
      <div class="checkbox-edit-content">
        <div id="checkbox-edit-content${i}" class="checkbox-show-content">
          <input type="checkbox" ${subtask.completed ? 'checked' : ''} id="check-sub${i}">
          <label id="subtask-edit-text${i}" class="subtask-show-text">${subtask.name}</label>
        </div>
        <div id="edit-input-board-content${i}" class="subtasks-icon input-subtask-edit-content hidden">
          <input type="text" class="edit-input-board" id="edit-input-board${i}" value="${subtask.name}">
          <div class="edit-buttons-content">
            <img onclick="deleteEditBoardSubtask(${taskIndex}, ${i})" src="./assets/img/icon_delete.svg" alt="delete">
            <div class="parting-line subtasks-icon-line"></div>
            <img onclick="confirmEdit(${taskIndex}, ${i})" src="./assets/img/icon_done.svg" alt="confirm">
          </div>
        </div>
        <div id="subtasks-icon${i}" class="subtasks-icon subtasks-icon-hidden">
          <img onclick="editBoardSubtask(${taskIndex}, ${i})" src="./assets/img/icon_edit.svg" alt="edit">
          <div class="parting-line subtasks-icon-line"></div>
          <img onclick="deleteEditBoardSubtask(${taskIndex}, ${i})" src="./assets/img/icon_delete.svg" alt="delete">
        </div>
      </div>`;
  }
}

/**
 * Generates the HTML content for displaying a task.
 * This function creates a string of HTML that represents the task details, including
 * category, title, description, due date, priority, assigned contacts, and subtasks.
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {string} The HTML string representing the task's detailed view.
 */
function generateShowTask(taskIndex) {
  return `
  <div class="category-show-content">
    <div id="card-category-title-show${taskIndex}">${tasks[taskIndex]["category"]}</div>
    <div class="close-img" onclick="closeMe()"></div>
  </div>
  <div class="title-description-content">
    <div class="title-content-show"><h2 class="show-card-title">${tasks[taskIndex]["title"]}</h2></div>
    <p class="show-card-description">${tasks[taskIndex]["description"]}</p>
  </div>
  <div class="due-date-content"><div class="due-date-text-content">Due date:</div>${convertDate(
    tasks[taskIndex]["date"])}</div>
  <div class="priority-content">
    <div class="prio-text">Priority:</div>
    <div class="prio-icon-text-content">${tasks[taskIndex]["prio"]} <img src="${tasks[taskIndex]["prioIcon"]}" alt=""></div>
  </div>
  <div class="show-assigned-to-content">
    <div class="assigned-to-text">Assigned To:</div>
    <div class="show-user-content">
      <div class="user-task-show-content" id="user-show-letter"></div>
      <div class="user-show-content" id="user-show-name"></div>
    </div>
  </div>
  <div>Subtasks</div>
  <div id="subtask-show"></div>
  <div class="show-btn-content">
    <div class="show-delete-content" onclick="deleteTask(${taskIndex})">
      <i class="fa fa-trash-o" style="font-size:24px"></i>
      <button>Delete</button>
    </div>
    <div class="show-line-content"></div>
      <div class="show-edit-content" onclick="openEdit(${taskIndex})">
        <i class="fa fa-edit" style="font-size:24px"></i>
        <button>Edit</button>
      </div>
      <div class="show-line-content-cardmenu"></div>
        <!-- Button to open the dropdown menu -->
      <div class="card-menu">
     <i class="fa fa-arrows-alt" style="font-size:20px; cursor:pointer; display: flex; align-items: center;" onclick="toggleDropdown(${taskIndex})"><button>Move to</button></i>
        <!-- Dropdown menu -->
        <div id="dropdown${taskIndex}" class="dropdown-content">
          <a href="#" onclick="moveToCategory(${taskIndex}, 'To Do')">To Do</a>
          <a href="#" onclick="moveToCategory(${taskIndex}, 'In progress')">In Progress</a>
          <a href="#" onclick="moveToCategory(${taskIndex}, 'Await feedback')">Await Feedback</a>
          <a href="#" onclick="moveToCategory(${taskIndex}, 'Done')">Done</a>
    </div>
  </div> 
  `;
}