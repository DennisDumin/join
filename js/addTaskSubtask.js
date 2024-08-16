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
    const subtaskElement = document.getElementById(`subtasks-list-element${index}`);
    subtaskElement.innerHTML = templateEditSubtask(index);
}

/**
 * Confirms the edits made to a subtask.
 * Replaces the subtask at the specified index with the updated subtask and regenerates the list display.
 * @function keepSubtask
 * @param {number} i - The index of the subtask in the subtasks array.
 * @returns {void}
 */
function keepSubtask(i) {
    let newSubtaskName = document.getElementById(`newSubtask${i}`).value;
    if (newSubtaskName.length > 1) {
        subtasks[i].name = newSubtaskName;
        generateSubtasksList();
    }
}

/**
 * Cancels the edit operation and restores the original subtask display.
 * @function cancelEditSubtask
 * @param {number} i - The index of the subtask in the subtasks array.
 * @returns {void}
 */
function cancelEditSubtask(i) {
    generateSubtasksList();
}