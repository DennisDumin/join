/**
 * Returns the HTML template for displaying a contact.
 * Each contact includes the name, initials, and color.
 * @function templateContact
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact's name.
 * @param {string} color - The color associated with the contact.
 * @returns {string} - The HTML string representing the contact.
 */
function templateContact(i, name, initials, color) {
  return `
  <div id="contact-container${i}" onclick="selectContact(${i})" class="contact-container" tabindex="1">
      <div class="contact-container-name">
          <span style="background-color: ${color}" id="contact-initals${i}" class="circle-name">${initials}</span>
          <span id="contact-name${i}">${name}</span>
      </div>
      <div class="contact-container-check"></div>
  </div> 
`;
}

/**
 * Returns the HTML template for displaying a contact in the search results.
 * Each contact includes the name, initials, and color.
 * @function templateContactSearch
 * @param {number} i - The index of the contact in the contactsSearch array.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact's name.
 * @param {string} color - The color associated with the contact.
 * @returns {string} - The HTML string representing the contact in the search results.
 */
function templateContactSearch(i, name, initials, color) {
  return `
  <div id="contact-container${i}" onclick="selectContactSearch(${i})" class="contact-container" tabindex="1">
      <div class="contact-container-name">
          <span style="background-color: ${color}" id="contact-initals${i}" class="circle-name">${initials}</span>
          <span id="contactName${i}">${name}</span>
      </div>
      <div class="contact-container-check"></div>
  </div> 
`;
}

/**
 * Returns the HTML template for editing a subtask.
 * Provides an input field for the user to edit the subtask and buttons to confirm or delete the subtask.
 * @function templateEditSubtask
 * @param {number} i - The index of the subtask in the subtasks array.
 * @returns {string} The HTML string for the edit subtask template.
 */
function templateEditSubtask(i) {
  return `
  <input id="newSubtask" value="${subtasks[i]}" class="inputfield subtask-edit-input" type="text">
  <div id="addTask-subtasks-icons" class="subtasks-icon">
      <img onclick="deleteSubtask(${i})" src="./assets/img/icon_delete.svg" alt="Löschen">
      <div class="parting-line subtasks-icon-line"></div>
      <img onclick="keepSubtask(${i})" src="./assets/img/icon_done.svg" alt="Bestätigen">
  </div>
  `;
}

/**
 * Returns the HTML template for a subtask list element.
 * @function templateSubtaskListElement
 * @param {number} i - The index of the subtask in the subtasks array.
 * @param {string} subtask - The name of the subtask.
 * @returns {string} The HTML string for the subtask list element.
 */
function templateSubtaskListElement(i, subtask) {
  return `
  <div id="subtasks-list-element${i}" class="subtasks-list-element">
      <li ondblclick="editSubtask(${i})">${subtask}</li>
      <div class="subtasks-icon subtasks-icon-hidden">
          <img onclick="editSubtask(${i})" src="./assets/img/icon_edit.svg" alt="Bearbeiten">
          <div class="parting-line subtasks-icon-line"></div>
          <img onclick="deleteSubtask(${i})" src="./assets/img/icon_delete.svg" alt="Löschen">
      </div>
  </div>
`;
}

/**
 * Generates the HTML list of subtasks and displays them.
 * Iterates through the subtasks array and creates list elements for each subtask.
 * @function generateSubtasksList
 * @returns {void}
 */
function generateSubtasksList() {
  let subtaskList = document.getElementById('subtasks-list');
  subtaskList.innerHTML = '';
  subtaskList.style.display = 'block';
  subtasks.forEach((subtask, index) => {
      subtaskList.innerHTML += `
          <div id="subtasks-list-element${index}" class="subtasks-list-element">
              <li ondblclick="editSubtask(${index})">${subtask.name}</li>
              <div class="subtasks-icon subtasks-icon-hidden">
                  <img onclick="editSubtask(${index})" src="./assets/img/icon_edit.svg" alt="Bearbeiten">
                  <div class="parting-line subtasks-icon-line"></div>
                  <img onclick="deleteSubtask(${index})" src="./assets/img/icon_delete.svg" alt="Löschen">
              </div>
          </div>`;
  });
}