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
    let subtaskName = document.getElementById('add-task-subtasks').value;
    if (subtaskName.length > 1) {
        subtasks.push({ name: subtaskName, completed: false });
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

function editSubtask(index) {
    let newSubtaskName = prompt("Edit subtask:", subtasks[index].name);
    if (newSubtaskName !== null && newSubtaskName.length > 1) {
        subtasks[index].name = newSubtaskName;
        generateSubtasksList();
    }
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