let subtasks = [];

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

function emptySubtaskInput() {
    let container = document.getElementById('add-task-subtasks');
    container.value = '';
}

function addSubtask() {
    let subtask = document.getElementById('add-task-subtasks').value;
    if (subtask.length > 1) {
        subtasks.push(subtask);
        generateSubtasksList();
        emptySubtaskInput();
    }
}

function addSubtaskEnter(){
    let input = document.getElementById('add-task-subtasks');
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter"){
            event.preventDefault();
            document.getElementById("add-subtask-button").click();
        } 
    });
}

function generateSubtasksList() {
    let container = document.getElementById('subtasks-list');
    container.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        container.innerHTML += templateSubtaskListElement(i, subtask);
    }
}

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

function deleteSubtask(i) {
    subtasks.splice(i, 1);
    generateSubtasksList();
}

function editSubtask(i) {
    let container = document.getElementById(`subtasks-list-element${i}`);
    container.classList.add('subtask-edit-container');
    container.innerHTML = templateEditSubtask(i);
}

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

function keepSubtask(i) {
    let newSubtask = document.getElementById('newSubtask').value;
    if (newSubtask.length > 1) {
        subtasks.splice(i, 1, newSubtask);
        generateSubtasksList();
    }
}