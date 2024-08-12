/**
 * Array to store the list of subtasks.
 * @type {Array<{name: string, completed: boolean}>}
 */
let subtasks = [];

/**
 * Opens or closes the subtask icons container when the user clicks within the subtask area.
 * Adds event listeners to manage the visibility of the icons based on where the user clicks.
 * @function openIcons
 * @returns {void}
 */
function openIcons() {
    let container = document.getElementById('add-task-subtasks-container');
    let icons = document.getElementById('add-task-subtasks-icons');
    let plus = document.getElementById('dropdown-img-plus');
    window.addEventListener('click', function (e) {
        if (container.contains(e.target)) {
            icons.classList.remove('d-none');
            plus.classList.add('d-none');
        } else {
            icons.classList.add('d-none');
            plus.classList.remove('d-none');
        }
    });
}

/**
 * Clears the subtask input field.
 * Resets the value of the subtask input to an empty string.
 * @function emptySubtaskInput
 * @returns {void}
 */
function emptySubtaskInput() {
    let container = document.getElementById('add-task-subtasks');
    container.value = '';
}

/**
 * Adds a new subtask to the subtasks list.
 * Pushes the new subtask into the subtasks array and regenerates the subtask list display.
 * Clears the subtask input field after adding.
 * @function addSubtask
 * @returns {void}
 */
function addSubtask() {
    let subtaskName = document.getElementById('add-task-subtasks').value;
    if (subtaskName.length > 1) {
        subtasks.push({ name: subtaskName, completed: false });
        generateSubtasksList();
        emptySubtaskInput();
    }
}

/**
 * Adds an event listener to the subtask input field to allow adding subtasks by pressing "Enter".
 * Triggers the addSubtask function when the Enter key is pressed.
 * @function addSubtaskEnter
 * @returns {void}
 */
function addSubtaskEnter(){
    let input = document.getElementById('add-task-subtasks');
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter"){
            event.preventDefault();
            document.getElementById("add-subtask-button").click();
        } 
    });
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
 * Deletes a subtask from the subtasks list.
 * Removes the subtask at the specified index from the subtasks array and regenerates the list display.
 * @function deleteSubtask
 * @param {number} i - The index of the subtask in the subtasks array.
 * @returns {void}
 */
function deleteSubtask(i) {
    subtasks.splice(i, 1);
    generateSubtasksList();
}

/**
 * Edits the name of a subtask.
 * Prompts the user to enter a new name for the subtask at the specified index.
 * Updates the subtask's name if the input is valid and regenerates the list display.
 * @function editSubtask
 * @param {number} index - The index of the subtask in the subtasks array.
 * @returns {void}
 */
function editSubtask(index) {
    let newSubtaskName = prompt("Edit subtask:", subtasks[index].name);
    if (newSubtaskName !== null && newSubtaskName.length > 1) {
        subtasks[index].name = newSubtaskName;
        generateSubtasksList();
    }
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
 * Confirms the edits made to a subtask.
 * Replaces the subtask at the specified index with the updated subtask and regenerates the list display.
 * @function keepSubtask
 * @param {number} i - The index of the subtask in the subtasks array.
 * @returns {void}
 */
function keepSubtask(i) {
    let newSubtask = document.getElementById('newSubtask').value;
    if (newSubtask.length > 1) {
        subtasks.splice(i, 1, newSubtask);
        generateSubtasksList();
    }
}