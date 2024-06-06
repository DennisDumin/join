/**
 *  To open the AddTask with addTask Button 
*/
function openAddTask() {
    let content = document.getElementById("add-task");
    content.classList.remove("hidden");
    let overlay = document.getElementsByClassName("overlay")[0];
    overlay.classList.remove("hidden");
    let dialog = document.querySelector('.add-task-board');
    dialog.classList.remove('slide-in'); 
    setTimeout(() => {
        dialog.classList.add('slide-in');
    }, 50);
  }
  
  
  /**
   *  to close the Task or the addTask section
  */
  function closeMe() {
    let content = document.getElementById("add-task");
    content.classList.add("hidden");
    let overlay = document.getElementsByClassName("overlay")[0];
    overlay.classList.add("hidden");
    let dialog = document.querySelector('.add-task-board');
    dialog.classList.remove('slide-in'); 
  }
  