let subtask = [];
let user = [];
tasks = [];
prioBtn = "";
let prioIcon = "";
let prioText = "";


async function initBoard() {
  await initInclude()
  //displayUserInitials()
  loadTasksBoard()
  updateHTML()
  renderEditContacts("add-task-contacts-container-edit")
  renderContacts("add-task-contacts-container")
  boardBg()
  chooseMedium()
}

function renderEditContacts(contactContainer) {
  let container = document.getElementById(`${contactContainer}`)
  container.innerHTML = ""
  for (let i = 0; i < contacts.length; i++) {
    let name = contacts[i]['name'];
    let initials = getInitials(name); // from contact.js
    let color = contacts[i]['color'];
    container.innerHTML += templateEditContact(i, name, initials, color);
    if (contacts[i]['selected'] === true) {
      document.getElementById(`contact-edit-container${i}`).classList.add('contact-container-edit-focus');
    } else {
      document.getElementById(`contact-edit-container${i}`).classList.remove('contact-container-edit-focus');
    }
  }
}

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

function openAddTask() {
  let content = document.getElementById("add-task");
  content.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  let dialog = document.querySelector('.add-task-board');
  dialog.classList.remove('slide-out');
  setTimeout(() => {
    dialog.classList.add('slide-in');
  }, 50);
}

function closeMe() {
  let dialog2 = document.querySelector('.add-task-board');
  let dialog = document.querySelector('.show-task');
  
  dialog2.classList.remove('slide-in');
  dialog2.classList.add('slide-out');
  dialog.classList.remove('slide-in');
  dialog.classList.add('slide-out');

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

function convertDate(date) {
  let datePart = date.split("-")
  let newDate = datePart[2] + "/" + datePart[1] + "/" + datePart[0]
  return newDate
}

let currentDraggedElement

function updateHTML() {
  let toDo = tasks.filter((t) => t["phases"] == "To Do");
  let toDoContent = document.getElementById("new-task-to-do");
  toDoContent.innerHTML = "";

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

  let awaitFeedback = tasks.filter((t) => t["phases"] == "Await feedback");
  document.getElementById("new-task-await").innerHTML = "";
  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById("new-task-await").innerHTML += generateAllTasksHTML(element);
    styleOfNoTaskAwaitFeedback();
  }
  let done = tasks.filter((t) => t["phases"] == "Done");
  document.getElementById("new-task-done").innerHTML = "";
  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById("new-task-done").innerHTML += generateAllTasksHTML(element);
    styleOfNoTaskDone();
  }
  changeColorOfCategoryTitle();
  contactsRender();
}

function startDragging(id) {
  currentDraggedElement = id
}

function valueOfProgressBar(taskIndex) {
  let value
  if (tasks[taskIndex]["subtasks"].length === 0) {
    value = 0
  } else if (tasks[taskIndex]["subtasks"].length === 1) {
    value = 50
  } else {
    value = 100
  }
  return value
}

function contactsRender() {
  for (let i = 0; i < tasks.length; i++) {
    let maxContacts = 3;
    let content = document.getElementById(`new-div${i}`);
    for (let j = 0; j < Math.min(tasks[i]['contacts'].length, maxContacts); j++) {
      let nameParts = tasks[i]['contacts'][j]['name'].split(" ");
      let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join("");
      content.innerHTML += `<div class="user-task-content" style="background-color:${tasks[i]['contacts'][j]['color']};">${initials}</div>`;
    }
    if (tasks[i]["contacts"].length > maxContacts) {
      let additionalContacts = tasks[i]["contacts"].length - maxContacts;
      let numberOfContacts = document.getElementById(`plus-number-contacts${i}`);
      numberOfContacts.innerHTML = "";
      numberOfContacts.innerHTML = `+${additionalContacts}`;
    }
  }
}

function generateAllTasksHTML(element) {
  return ` <div id="card-id${element["ID"]
    }" draggable="true" ondragstart="startDragging(${element["ID"]
    })" onclick="showTask(${element["ID"]})">
  <div class="card">
   <div id="card-category-title${element["ID"]}" class="card-category-title">${element["category"]
    }</div>
   <div class="title-description-content">
     <h2 class="card-title">${element["title"]}</h2>
     <p class="card-description">${element["description"]}</p>
   </div>
   <div class="progress-bar-content">
     <progress value="${valueOfProgressBar(
      element["ID"]
    )}" max="100" id="progress-bar${element["ID"]}"></progress>
     <p class="card-subtasks-text"><span id="number-of-subtask${element["ID"]
    }" class="number-of-subtask">${element["subtasks"].length}/${element["subtasks"].length
    }</span> Subtasks</p>
    </div>
    <div class="card-user-content">
      <div class="user-container-board">
        <div class="user-inner-container" id="new-div${element["ID"]}"></div>
        <div class="number-of-contacts" id="plus-number-contacts${element["ID"]
    }"></div>
      </div>
      <img src="${element["prioIcon"]}" alt="">
    </div>
  </div>
  </div>`
}

function allowDrop(ev) {
  ev.preventDefault()
}

function moveTo(phase) {
  tasks[currentDraggedElement]["phases"] = phase
  updateHTML()
  styleOfNoTaskToDo()
  styleOfNoTaskInProgress()
  styleOfNoTaskAwaitFeedback()
  styleOfNoTaskDone()
  putData("/tasks", tasks)
}

function styleOfNoTaskToDo() {
  let toDoContent = document.getElementById("new-task-to-do");
  if (toDoContent.childElementCount > 0) {
    document.getElementById('no-task-to-do').classList.add('hidden');
  } else {
    document.getElementById('no-task-to-do').classList.remove('hidden');
  }
}

function styleOfNoTaskInProgress() {
  let inProgressContent = document.getElementById("new-task-in-progress")
  if (inProgressContent.childElementCount > 0) {
    document.getElementById("no-task-in-progress").classList.add("hidden")
  } else {
    document.getElementById("no-task-in-progress").classList.remove("hidden")
  }
}

function styleOfNoTaskAwaitFeedback() {
  let inProgressContent = document.getElementById("new-task-await")
  if (inProgressContent.childElementCount > 0) {
    document.getElementById("no-task-await").classList.add("hidden")
  } else {
    document.getElementById("no-task-await").classList.remove("hidden")
  }
}

function styleOfNoTaskDone() {
  let inProgressContent = document.getElementById("new-task-done")
  if (inProgressContent.childElementCount > 0) {
    document.getElementById("no-task-done").classList.add("hidden")
  } else {
    document.getElementById("no-task-done").classList.remove("hidden")
  }
}

function checkwidthForAddTask() {
  window.location.href = "./add_task.html"
}

function updateButtonOnClick() {
  let plusButton = document.getElementsByClassName('plus-btn');
  if (plusButton.length > 0) {
    if (window.innerWidth <= 1075) {
      for (let i = 0; i < plusButton.length; i++) {
        plusButton[i].setAttribute('onclick', "window.location.href = './add_task.html'");
      }
    } else {
      for (let i = 0; i < plusButton.length; i++) {
        plusButton[i].setAttribute('onclick', 'openAddTask()');
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateButtonOnClick()
  window.addEventListener("resize", updateButtonOnClick)
})

function boardBg() {
  document.getElementById("link-board").classList.add("bg-focus")
}
