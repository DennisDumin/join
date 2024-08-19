/**
 * An array to store tasks.
 * @type {Array<Object>}
 */
let tasks = []

/**
 * An array to store the dates of high-priority tasks.
 * @type {Array<string>}
 */
let priorityHighDates = []

/**
 * Stores the current date.
 * @type {Date}
 */
let dateToday

/**
 * Stores the closest high-priority task date.
 * @type {string}
 */
let closest

/**
 * Format options for displaying dates.
 * @type {Object}
 */
let formatDate = { year: "numeric", month: "long", day: "numeric" }

/**
 * Stores the user data.
 * @type {Object}
 */
let user

/**
 * A number used for demonstration or as a placeholder.
 * @type {number}
 */
let number = 15220

/**
 * Initializes the application by loading tasks, sorting dates, and updating the UI.
 * @async
 */
async function init() {
  await loadTasks()
  laodLocalStorage()
  sortDates()
  showHTML()
  summaryBgMenu()
}

/**
 * Loads the user data from local storage.
 */
function laodLocalStorage() {
  let userAsText = localStorage.getItem("user")

  if (userAsText) {
    user = JSON.parse(userAsText)
  }
}

/**
 * Loads tasks from the server or storage.
 * @async
 */
async function loadTasks() {
  tasks = []
  let task = await getData("tasks")
  let ids = Object.keys(task || [])
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i]
    let allTasks = task[id]
    tasks.push(allTasks)
  }
}

/**
 * Sorts the dates of high-priority tasks and identifies the closest one.
 */
function sortDates() {
  let priorityHigh = tasks.filter((t) => t["prio"] == "Urgent")
  for (let i = 0; i < priorityHigh.length; i++) {
    priorityHighDates.push(priorityHigh[i]["date"])
  }

  ;[closest] = priorityHighDates.sort((a, b) => {
    const [aDate, bDate] = [a, b].map((d) => Math.abs(new Date(d) - dateToday))
    return aDate - bDate
  })
}

/**
 * Updates the HTML content to display the tasks and their status.
 */
function showHTML() {
  let todo = tasks.filter((t) => t["phases"] == "To Do")
  let done = tasks.filter((t) => t["phases"] == "Done")
  let priorityHigh = tasks.filter((t) => t["prio"] == "Urgent")
  let inprogress = tasks.filter((t) => t["phases"] == "In progress")
  let awaitFeedback = tasks.filter((t) => t["phases"] == "Await feedback")

  document.getElementById("to-do").innerHTML = `${todo.length}`
  document.getElementById("done").innerHTML = `${done.length}`
  document.getElementById("priority-high").innerHTML = `${priorityHigh.length}`
  document.getElementById(
    "deadline"
  ).innerHTML = `${checkIfpriorityHighArray()}`
  document.getElementById("tasks").innerHTML = `${tasks.length}`
  document.getElementById("task-in-progress").innerHTML = `${inprogress.length}`
  document.getElementById(
    "awaiting-feedback"
  ).innerHTML = `${awaitFeedback.length}`
  document.getElementById("greeting-text").innerHTML = `${checkIfGuest()}`
}

/**
 * Checks if there are any high-priority tasks and returns the closest date or a message if none exist.
 * @return {string} The closest high-priority date or a message indicating no urgent tasks.
 */
function checkIfpriorityHighArray() {
  if (priorityHighDates.length === 0) {
    return /*html*/ `
            No urgent to-dos
        `
  } else {
    dateToday = new Date(closest)
    return dateToday.toLocaleDateString("en-US", formatDate)
  }
}

/**
 * Checks if the user is a guest and returns a greeting message.
 * @return {string} A greeting message based on the user type.
 */
function checkIfGuest() {
  if (user?.name === "Gast") {
    return /*html*/ `
            <h2>Guten Morgen</h2>
        `;
  } else if (user?.name) {
    return /*html*/ `
            <h2>Guten Morgen,</h2>
            <h1>${user.name}</h1>  
        `;
  } else {
    return /*html*/ `
            <h2>Guten Morgen</h2>
        `;
  }
}

/**
 * Changes the pencil image to a white version.
 */
function changePencilImg() {
  document
    .getElementById("pencil-img")
    .setAttribute("src", "./assets/img/pencil-white.png")
}

/**
 * Resets the pencil image to the default dark blue version.
 */
function resetPencilImg() {
  document
    .getElementById("pencil-img")
    .setAttribute("src", "./assets/img/pencil-darkblue.png")
}

/**
 * Changes the checkmark image to a white version.
 */
function changeCheckImg() {
  document
    .getElementById("check-img")
    .setAttribute("src", "./assets/img/check-white.png")
}

/**
 * Resets the checkmark image to the default dark blue version.
 */
function resetCheckImg() {
  document
    .getElementById("check-img")
    .setAttribute("src", "./assets/img/check-darkblue.png")
}

/**
 * Loads the board page in the browser.
 */
function loadBoardPage() {
  window.location.href = "https://join-233.developerakademie.net/board.html"
}