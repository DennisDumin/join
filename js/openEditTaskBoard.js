function openEdit(taskIndex) {
  let showContent = document.getElementById("show-task");
  showContent.classList.add("hidden");
  let editContent = document.getElementById("add-task-edit");
  editContent.classList.remove("hidden");
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

function generateEditTask(taskIndex){
  activeEditButton();
  activeButton(taskIndex);
  subtasksEditRender(taskIndex);
  contactsEditRender(taskIndex)
  renderEditContacts('add-task-contacts-container-edit');
  generateInputEditSubtask(taskIndex);

}

function contactsEditRender(taskIndex){
  let content = document.getElementsByClassName('user-content-edit-letter')[0];
  content.innerHTML ='';
    for(let j = 0; j < selectedEditContacts.length; j++){
      let letter = selectedEditContacts[j]['name'].split(" ");
      let result = "";
      for(let name = 0; name < letter.length; name++){
        result += letter[name].charAt(0).toUpperCase();
      }
      content.innerHTML += `<div class="user-task-content" style="background-color:${tasks[taskIndex]['contacts'][j]['color']};">${result}</div>`;
    }
}

function generateInputEditSubtask(taskIndex){
  let content = document.getElementsByClassName(`input-edit-subtask`)[0];
  content.innerHTML =`      
  <input id="add-task-edit-subtasks${taskIndex}" class="inputfield" type="text"
  placeholder="Add new subtask" maxlength="26" autocomplete="off" onclick="openEditSubtaskIcons()"/>
  <div id="add-task-subtasks-edit-icons" class="subtasks-icon d-none">
    <img  src="./assets/img/icon_closeVectorBlack.svg" alt="Delete" onclick="closeEditSubtaskIcons()">
    <div class="parting-line subtasks-icon-line"></div>
    <img id="add-subtask-button" src="./assets/img/icon_done.svg" alt="confirm" onclick="addEditSubtasks(${taskIndex})">
  </div>
  <img src="./assets/img/icon_subtasks.svg" class="plus-icon-edit-subtasks" id="plus-edit-icon" onclick="openEditSubtaskIcons()"/>`;
}

function subtasksEditRender(taskIndex){
  let content = document.getElementById('new-subtask');
  content.innerHTML ='';
  for(let j = 0;  j < tasks[taskIndex]['subtasks'].length; j++){
    content.innerHTML += `
  <div class="checkbox-edit-content">
    <div id="checkbox-edit-content${j}" class="checkbox-show-content">
      <input type="checkbox" checked id="checkSub${j}">
      <label id="subtask-edit-text${j}" class="subtask-show-text">${tasks[taskIndex]['subtasks'][j]}</label>
    </div>

    <div id="edit-input-board-content${j}" class=" subtasks-icon input-subtask-edit-content hidden">
      <input type ="text" class="edit-input-board" id = "edit-input-board${j}" value =${tasks[taskIndex]['subtasks'][j]}>
      <div class="edit-buttons-content">
        <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="./assets/img/icon_delete.svg" alt="delete">
        <div class="parting-line subtasks-icon-line"></div>
        <img onclick="confirmEdit(${taskIndex}, ${j})" src="./assets/img/icon_done.svg" alt="confirm">
      </div>
    </div>

    <div id="subtasks-icon${j}" class="subtasks-icon subtasks-icon-hidden">
      <img onclick="editBoardSubtask(${j})" src="./assets/img/icon_edit.svg" alt="edit">
      <div class="parting-line subtasks-icon-line"></div>
      <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="./assets/img/icon_delete.svg" alt="delete">
    </div>
  </div> `
    ;
  }
}

function confirmEdit(taskIndex, subtaskIndex){
  let inputSubtask = document.getElementById(`edit-input-board${subtaskIndex}`).value;
  deleteEditBoardSubtask(taskIndex, subtaskIndex);
  if(!Array.isArray(tasks[taskIndex].subtasks)){
    tasks[taskIndex].subtasks = [];
  }
  tasks[taskIndex]["subtasks"].push(inputSubtask);
  subtasksEditRender(taskIndex);
  putData("/tasks", tasks);
  inputSubtask ="";
}

function editBoardSubtask(taskIndex){
  document.getElementById(`edit-input-board-content${taskIndex}`).classList.remove('hidden');
  document.getElementById(`checkbox-edit-content${taskIndex}`).classList.add('hidden');
  document.getElementById(`subtasks-icon${taskIndex}`).classList.add('hidden');
  let subtaskInput = document.getElementById(`edit-input-board${taskIndex}`).value;
  let labelOfSubtask = document.getElementById(`subtask-edit-text${taskIndex}`);
  labelOfSubtask.innerHTML = subtaskInput;
}

function deleteEditBoardSubtask(taskIndex, subtaskIndex){
  if(tasks[taskIndex]["subtasks"].length === 1){
    if(Array.isArray(tasks[taskIndex].subtasks)){
      tasks[taskIndex].subtasks = "";
    }
    subtasksEditRender(taskIndex);
  }else{
    tasks[taskIndex]["subtasks"].splice(subtaskIndex, 1);
    subtasksEditRender(taskIndex);
  }
  putData("/tasks", tasks);
}


function openEditSubtaskIcons(){
  document.getElementById('add-task-subtasks-edit-icons').classList.remove('d-none');
  document.getElementById('plus-edit-icon').classList.add('d-none');
}

function closeEditSubtaskIcons(){
  document.getElementById('add-task-subtasks-edit-icons').classList.add('d-none');
  document.getElementById('plus-edit-icon').classList.remove('d-none');
}

function addEditSubtasks(taskIndex){
  let inputSubtask = document.getElementById(`add-task-edit-subtasks${taskIndex}`).value;
      if(inputSubtask.trim() === ""){
        return;
      }else{
        if(!Array.isArray(tasks[taskIndex].subtasks)){
          tasks[taskIndex].subtasks = [];
        }
        if(tasks[taskIndex]["subtasks"].length === 2){
          tasks[taskIndex]["subtasks"].pop();
          tasks[taskIndex]["subtasks"].push(inputSubtask);
        }else{
          tasks[taskIndex]["subtasks"].push(inputSubtask);
        }
        generateEditSubtask(taskIndex);
        putData("/tasks", tasks);
        inputSubtask ="";
      }
      subtasksEditRender(taskIndex);
}

function generateEditSubtask(taskIndex){
  let list = document.getElementById('newSubtask');
  list.innerHTML = '';
  for(let i= 0; i < tasks[taskIndex]["subtasks"].length; i++){
    list.innerHTML += `
    <div class="checkbox-edit-content">
      <div class="checkbox-show-content">
        <input type="checkbox" checked>
        <label class="subtask-show-text">${tasks[taskIndex]["subtasks"][i]}</label>
      </div>
      <div class="subtasks-icon subtasks-icon-hidden">
        <img onclick="editBoardSubtask(${taskIndex})" src="./assets/img/icon_edit.svg" alt="Bearbeiten">
        <div class="parting-line subtasks-icon-line"></div>
        <img onclick="deleteEditBoardSubtask(${taskIndex})" src="./assets/img/icon_delete.svg" alt="Delete">
      </div>
    </div> `;
  }
}

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
        if(selectedEditContacts.length > 0){
          tasks[i]["contacts"].splice(0, tasks[i]["contacts"].length);
          tasks[i]["contacts"].push(...selectedEditContacts);
        }
        keepPrioButton(i);
        break;
      }
    }
  }
  await  putData("/tasks", tasks);
  await updateHTML();
  await closeMe();
}

function keepPrioButton(taskIndex){
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  if(/(\s|^)active(\s|$)/.test(urgentEditbutton.className)) {
   tasks[taskIndex]["prio"] = 'Urgent';
   tasks[taskIndex]["prioIcon"] = "./assets/img/icon_PrioAltaRed.svg";
  }else if(/(\s|^)active(\s|$)/.test(mediumEditbutton.className)){
    tasks[taskIndex]["prio"] = 'Medium';
    tasks[taskIndex]["prioIcon"] = "./assets/img/icon_PrioMediaOrange.svg";
  }else if(/(\s|^)active(\s|$)/.test(lowEditbutton.className)){
    tasks[taskIndex]["prio"] = 'Low';
    tasks[taskIndex]["prioIcon"] = './assets/img/icon_PrioBajaGreen.svg';
  }else{
    tasks[taskIndex]["prio"] = '';
    tasks[taskIndex]["prioIcon"] = '';
  }
}

function activeEditButton() {
  let lastClick = null;
  urgentButtenEdit(lastClick);
  mediumButtonEdit(lastClick);
  lowButtonEdit(lastClick);
}

function urgentButtenEdit(lastClick){
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
    prioText ='Urgent'
    prioIcon ='./assets/img/icon_PrioAltaWhite.svg';
    prioBtn ="./assets/img/icon_PrioAltaRed.svg";
    changeIconOfUrgent();
  });
}

function mediumButtonEdit(lastClick){
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

function lowButtonEdit(lastClick){
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

function activeButton(taskIndex){
  if (tasks[taskIndex]["prio"] === "Low") {
    document.getElementsByClassName("low-edit-button")[0].classList.add("active");
    prioIcon = './assets/img/icon_PrioBajaWhite.svg';
    changeIconOfLow();
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");;
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if (tasks[taskIndex]["prio"] === "Urgent") {
    document.getElementsByClassName("urgent-edit-button")[0].classList.add("active");
    prioIcon ='./assets/img/icon_PrioAltaWhite.svg';
    changeIconOfUrgent();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if(tasks[taskIndex]["prio"] === "Medium") {
    document.getElementsByClassName("medium-edit-button")[0].classList.add("active");
    prioIcon = './assets/img/icon_PrioMediaWhite.svg';
    changeIconOfMedium();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
  }else{
    prio ='';
    prioBtn ='';
  }
}

function changeIconOfUrgent(){
  let urgent = document.getElementById('urgent-img');
  urgent.src = prioIcon;
  let medium = document.getElementById('medium-img');
  medium.src = './assets/img/icon_PrioMediaOrange.svg';
  let low = document.getElementById('low-img');
  low.src = './assets/img/icon_PrioBajaGreen.svg';
}

function changeIconOfMedium(){
  let medium = document.getElementById('medium-img');
  medium.src = prioIcon;
  let urgent = document.getElementById('urgent-img');
  urgent.src = './assets/img/icon_PrioAltaRed.svg';
  let low = document.getElementById('low-img');
  low.src = './assets/img/icon_PrioBajaGreen.svg';
}

function changeIconOfLow(){
  let low = document.getElementById('low-img');
  low.src = prioIcon;
  let medium = document.getElementById('medium-img');
  medium.src = './assets/img/icon_PrioMediaOrange.svg';
  let urgent = document.getElementById('urgent-img');
  urgent.src = './assets/img/icon_PrioAltaRed.svg';
}