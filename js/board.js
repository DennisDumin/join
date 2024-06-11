/**
 *  To open the AddTask with addTask Button 
*/
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


/**
*  To close the Task or the addTask section
*/
function closeMe() {
  let dialog = document.querySelector('.add-task-board');
  dialog.classList.remove('slide-in'); 
  dialog.classList.add('slide-out');

  setTimeout(() => {
      let content = document.getElementById("add-task");
      content.classList.add("hidden");
      let overlay = document.getElementsByClassName("overlay")[0];
      overlay.classList.add("hidden");
  }, 250);
}