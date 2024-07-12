function showTask(taskIndex) {
    let showContent = document.getElementById("show-task");
    showContent.classList.remove("hidden");
    let overlay = document.getElementsByClassName("overlay")[0];
    overlay.classList.remove("hidden");
    showContent.innerHTML = "";
    showContent.innerHTML += generateShowTask(taskIndex);
    changeColorOfCategoryTitleShow(taskIndex);
    contactsShowLetterRender(taskIndex);
    contactsShowNameRender(taskIndex);
    subtasksShowRender(taskIndex);
    slideInTask();
    heightOfShowTaskAdjust();
  }
  
  function generateShowTask(taskIndex){
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
    </div> 
    `;
  }
  
  function slideInTask(){
    let dialog = document.querySelector('.show-task');
    dialog.classList.remove('slide-in'); 
    setTimeout(() => {
        dialog.classList.add('slide-in');
    }, 50);
  }
  
  function heightOfShowTaskAdjust(){
    let showContent = document.getElementById('show-task');
    if(showContent.scrollHeight > 650){
      showContent.style.height = 'auto';
      showContent.style.maxHeight ='none';
    }else{
      showContent.style.maxHeight = '650px';
    }
  }
  
  function subtasksShowRender(taskIndex){
    let content = document.getElementById('subtask-show');
    content.innerHTML ='';
    for(let subtaskIndex = 0;  subtaskIndex < tasks[taskIndex]['subtasks'].length; subtaskIndex++){
      content.innerHTML += `<div class="checkbox-show-content"><input type="checkbox" onclick="UpdateProgress(${taskIndex})" checked id="checkbox${subtaskIndex}">
      <label class="subtask-show-text">${tasks[taskIndex]['subtasks'][subtaskIndex]}</label></div>`;
    }
  }
  
  function UpdateProgress(taskIndex){
    let checkedCount = 0;
    for(let j = 0; j < tasks[taskIndex]["subtasks"].length; j++){
      let checkbox  = document.getElementById(`checkbox${j}`);
      if (checkbox.checked){
        checkedCount++;
      }
      let progress = document.getElementById(`progress-bar${taskIndex}`);
      let numberOfSubtask = document.getElementById(`number-of-subtask${taskIndex}`);
      numberOfSubtask.innerHTML ='';
      if(checkedCount > 1){
        progress.value = 100;
        numberOfSubtask.textContent = '2/2';
      }else if(checkedCount === 1){
        progress.value = 50;
        numberOfSubtask.textContent = '1/2';
      }else{
        progress.value = 0;
        numberOfSubtask.textContent = '0/2';
      }
    }
  }
  
  function contactsShowLetterRender(taskIndex){
      let content = document.getElementById('user-show-letter');
      for(let j = 0; j < tasks[taskIndex]['contacts'].length; j++){
        let letter = tasks[taskIndex]['contacts'][j]['name'].split(" ");
        let result = "";
        for(let name = 0; name < letter.length; name++){
          result += letter[name].charAt(0).toUpperCase();
        }
        content.innerHTML += `<div class="user-task-content-show" style="background-color:${tasks[taskIndex]['contacts'][j]['color']};">${result}</div>`;
      }
  }
  
  function contactsShowNameRender(taskIndex){
    let content = document.getElementById('user-show-name');
    for(let j = 0; j < tasks[taskIndex]['contacts'].length; j++){
      content.innerHTML += `<div class="user-show-name">${tasks[taskIndex]['contacts'][j]['name']}</div>`;
    }
  }
  
  function changeColorOfCategoryTitleShow(taskIndex){
    let content = document.getElementById(`card-category-title-show${taskIndex}`);
    let category = tasks[taskIndex]["category"];
    if (category.includes("User Story")) {
      content.classList.add("blue");
    } else if (category.includes("Technical Task")){
      content.classList.add("green");
    }
  }