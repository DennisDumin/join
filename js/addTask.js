let prioBtn = ""

/**
 * Initializes the task page, loads necessary resources, and sets up the initial view.
 * Calls several asynchronous and synchronous functions to configure the page.
 * @async
 * @function initTask
 * @returns {Promise<void>}
 */
async function initTask() {
  await initInclude()
  displayUserInitials()
  addTaskBgMenu()
  await loadTasks()
  renderContacts("add-task-contacts-container")
  chooseMedium()
  showUser()
  renderDateInput()
}

/**
 * Selects the medium priority option and highlights the corresponding button.
 * Adds the "medium-button-focus" class to the button with the ID "medium-button".
 * @function chooseMedium
 * @returns {void}
 */
function chooseMedium() {
  let button = document.getElementById("medium-button")
  button.classList.add("medium-button-focus")
}

/**
 * Hides the visual indication that a required field is empty.
 * Removes the "empty" class from the specified border element and adds the "transparent" class to the specified text element.
 * @function hideRequiredInfo
 * @param {string} borderId - The ID of the border element to modify.
 * @param {string} textId - The ID of the text element to modify.
 * @returns {void}
 */
function hideRequiredInfo(borderId, textId) {
  let border = document.getElementById(`${borderId}`)
  let text = document.getElementById(`${textId}`)
  border.classList.remove("empty")
  text.classList.add("transparent")
}

/**
 * Hides the visual indication that the category selection is required.
 * Removes the "empty" class from the category selection element.
 * @function hideRequiredCategory
 * @returns {void}
 */
function hideRequiredCategory() {
  document.getElementById("add-task-category").classList.remove("empty")
}

/**
 * Opens a dropdown menu by removing the "d-none" class from the container and rotating the image icon.
 * @function openDropdown
 * @param {HTMLElement} container - The dropdown container element to open.
 * @param {HTMLElement} img - The image element to rotate.
 * @returns {void}
 */
function openDropdown(container, img) {
  container.classList.remove("d-none")
  img.classList.add("dropdown-img-rotated")
}

/**
 * Closes a dropdown menu by adding the "d-none" class to the container and resetting the image icon rotation.
 * @function closeDropdown
 * @param {HTMLElement} container - The dropdown container element to close.
 * @param {HTMLElement} img - The image element to reset.
 * @returns {void}
 */
function closeDropdown(container, img) {
  container.classList.add("d-none")
  img.classList.remove("dropdown-img-rotated")
}

/**
 * Selects the urgent priority option and highlights the corresponding button.
 * Toggles the "urgent-button-focus" class on the button with the ID "urgent-button" and ensures other priority buttons are not highlighted.
 * @function selectUrgent
 * @returns {void}
 */
function selectUrgent() {
  let button = document.getElementById("urgent-button")

  if (button.classList.contains("urgent-button-focus")) {
    button.classList.remove("urgent-button-focus")
  } else {
    button.classList.add("urgent-button-focus")
    document
      .getElementById("medium-button")
      .classList.remove("medium-button-focus")
    document.getElementById("low-button").classList.remove("low-button-focus")
  }
}

/**
 * Selects the medium priority option and highlights the corresponding button.
 * Toggles the "medium-button-focus" class on the button with the ID "medium-button" and ensures other priority buttons are not highlighted.
 * @function selectMedium
 * @returns {void}
 */
function selectMedium() {
  let button = document.getElementById("medium-button")

  if (button.classList.contains("medium-button-focus")) {
    button.classList.remove("medium-button-focus")
  } else {
    button.classList.add("medium-button-focus")
    document
      .getElementById("urgent-button")
      .classList.remove("urgent-button-focus")
    document.getElementById("low-button").classList.remove("low-button-focus")
  }
}

/**
 * Selects the low priority option and highlights the corresponding button.
 * Toggles the "low-button-focus" class on the button with the ID "low-button" and ensures other priority buttons are not highlighted.
 * @function selectLow
 * @returns {void}
 */
function selectLow() {
  let button = document.getElementById("low-button")

  if (button.classList.contains("low-button-focus")) {
    button.classList.remove("low-button-focus")
  } else {
    button.classList.add("low-button-focus")
    document
      .getElementById("urgent-button")
      .classList.remove("urgent-button-focus")
    document
      .getElementById("medium-button")
      .classList.remove("medium-button-focus")
  }
}

/**
 * Opens the task categories dropdown when the category selection is clicked.
 * Handles toggling of the dropdown visibility and updates the selected category text.
 * @function openCategories
 * @param {Event} event - The click event that triggers the dropdown.
 * @returns {void}
 */
function openCategories(event) {
  event.stopPropagation()
  hideRequiredCategory()
  let container = document.getElementById("add-task-category-container")
  let img = document.getElementById("dropdown-img-category")
  if (container.classList.contains("d-none")) {
    openDropdown(container, img)
  } else {
    closeDropdown(container, img)
  }
  let selectedCategory = document.getElementById("select-task-text")
  selectedCategory.innerHTML = `Select task category`
}

/**
 * Opens and closes the categories dropdown based on clicks inside or outside the category container.
 * Adds an event listener to handle clicks on the window and toggles the dropdown accordingly.
 * @function openCategoriesWindow
 * @returns {void}
 */
function openCategoriesWindow() {
  let container = document.getElementById("add-task-category")
  let categories = document.getElementById("add-task-category-container")
  let img = document.getElementById("dropdown-img-category")

  window.addEventListener("click", function (e) {
    if (container.contains(e.target)) {
      openDropdown(categories, img)
    } else {
      closeDropdown(categories, img)
    }
  })
}

/**
 * Selects a category by updating the category selection text and closing the dropdown.
 * @function selectCategory
 * @param {string} categoryId - The ID of the category element to select.
 * @returns {void}
 */
function selectCategory(categoryId) {
  let container = document.getElementById("add-task-category-container")
  let img = document.getElementById("dropdown-img-category")
  let categoryElement = document.getElementById(categoryId)

  if (categoryElement) {
    let category = categoryElement.innerHTML
    let selectedCategory = document.getElementById("select-task-text")
    selectedCategory.innerHTML = category
    closeDropdown(container, img)
  } else {
    console.error(`Element with ID ${categoryId} not found`)
  }
}

/**
 * Creates a new task after validating input fields. If valid, saves the task and redirects to the board.
 * @async
 * @function createTask
 * @returns {Promise<void>}
 */
async function createTask() {
  let title = document.getElementById("task-title").value
  let date = document.getElementById("task-date").value
  let category = document.getElementById("select-task-text").innerHTML

  if (title !== "" && date !== "" && category !== `Select task category`) {
    document.getElementById("create-task-button").disabled = true
    getValues()
    await saveTask()
    showTaskAdded()
    setTimeout(() => {
      redirectToBoard()
    }, 2000)
    clearAddTask()
  } else {
    checkInput(title, date, category)
  }
}

/**
 * Retrieves and prepares the task values for saving.
 * @function getValues
 * @returns {void}
 */
function getValues() {
  let title = document.getElementById("task-title").value
  let description = document.getElementById("add-task-description").value
  if (description === "") {
    description = ""
  }
  let date = document.getElementById("task-date").value
  let prio = getPrio()
  let category = document.getElementById("select-task-text").innerHTML
  pushTaskElements(title, description, date, prio, category, prioBtn)
}

/**
 * Determines the selected priority (Urgent, Medium, or Low) and returns it.
 * Also sets the corresponding icon for the priority.
 * @function getPrio
 * @returns {string} - The selected priority.
 */
function getPrio() {
  if (
    document
      .getElementById("urgent-button")
      .classList.contains("urgent-button-focus")
  ) {
    prio = "Urgent"
    prioBtn = "./assets/img/icon_PrioAltaRed.svg"
  } else if (
    document
      .getElementById("medium-button")
      .classList.contains("medium-button-focus")
  ) {
    prio = "Medium"
    prioBtn = "./assets/img/icon_PrioMediaOrange.svg"
  } else if (
    document.getElementById("low-button").classList.contains("low-button-focus")
  ) {
    prio = "Low"
    prioBtn = "./assets/img/icon_PrioBajaGreen.svg"
  } else {
    prio = ""
  }
  return prio
}

/**
 * Pushes the task elements into the tasks array and prepares the task object for saving.
 * Handles contacts and subtasks and assigns an ID to the task.
 * @function pushTaskElements
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} date - The task due date.
 * @param {string} prio - The task priority.
 * @param {string} category - The task category.
 * @param {string} prioBtn - The icon associated with the selected priority.
 * @returns {void}
 */
function pushTaskElements(title, description, date, prio, category, prioBtn) {
  if (selectedContacts.length < 1) {
    selectedContacts = [];
  }
  if (subtasks.length < 1) {
    subtasks = [];
  }
  let currentId = tasks.length;
  tasks.push({
    title: title,
    description: description,
    contacts: selectedContacts,
    date: date,
    prio: prio,
    category: category,
    subtasks: subtasks.map(subtask => ({ ...subtask, completed: false })),
    phases: "To Do",
    ID: currentId++,
    prioIcon: prioBtn,
  });
}

/**
 * Saves the current tasks array to the server using an API call.
 * If tasks array is empty, initializes it with an ID of 0.
 * @async
 * @function saveTask
 * @returns {Promise<void>}
 */
async function saveTask() {
  if (tasks === "") {
    tasks.push({
      ID: 0,
    })
    await postData("/tasks", tasks) // from storage.js
  } else {
    await putData("/tasks", tasks) // from storage.js
  }
}

/**
 * Sets the minimum date for the date input field to the current date.
 *
 * This function generates a date string in the format "YYYY-MM-DD" representing the
 * current date. If the month is less than 10, a leading zero is added to ensure the
 * proper format. The resulting date string is then set as the minimum allowable date
 * in the date input field with the ID 'add-task-input-date'.
 */
function renderDateInput() {
  const today = new Date(); // Heutiges Datum
  let year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, '0');
  let day = today.getDate().toString().padStart(2, '0');

  const newDate = `${year}-${month}-${day}`;
  document.getElementById('task-date').min = newDate;
}

/**
 * Displays a visual indication that a task has been added successfully.
 * Removes the "d-none" class from the added task container element.
 * @function showTaskAdded
 * @returns {void}
 */
function showTaskAdded() {
  document.getElementById("added-container").classList.remove("d-none")
}

/**
 * Checks the input fields for title, date, and category, and displays an error if any are invalid.
 * @function checkInput
 * @param {string} title - The task title to check.
 * @param {string} date - The task date to check.
 * @param {string} category - The task category to check.
 * @returns {void}
 */
function checkInput(title, date, category) {
  checkTitle(title)
  checkDate(date)
  checkCategory(category)
}

/**
 * Checks if the title is empty and displays an error if it is.
 * Adds the "empty" class and removes the "transparent" class on the required title elements.
 * @function checkTitle
 * @param {string} title - The task title to check.
 * @returns {void}
 */
function checkTitle(title) {
  if (title === "") {
    document.getElementById("add-task-title").classList.add("empty")
    document.getElementById("required-title").classList.remove("transparent")
  }
}

/**
 * Checks if the date is empty and displays an error if it is.
 * Adds the "empty" class and removes the "transparent" class on the required date elements.
 * @function checkDate
 * @param {string} date - The task date to check.
 * @returns {void}
 */
function checkDate(date) {
  if (date === "") {
    document.getElementById("add-task-due-date").classList.add("empty")
    document.getElementById("required-date").classList.remove("transparent")
  }
}

/**
 * Checks if the category is unselected and displays an error if it is.
 * Adds the "empty" class to the category element if it is unselected.
 * @function checkCategory
 * @param {string} category - The task category to check.
 * @returns {void}
 */
function checkCategory(category) {
  if (category === `Select task category`) {
    document.getElementById("add-task-category").classList.add("empty")
  }
}

/**
 * Clears the input fields and resets the task form after a task is added.
 * Hides required info, clears priority selection, and resets contact and subtask arrays.
 * @async
 * @function clearAddTask
 * @returns {Promise<void>}
 */
async function clearAddTask() {
  hideRequiredInfo("add-task-title", "required-title")
  hideRequiredInfo("add-task-due-date", "required-date")
  hideRequiredCategory()
  deletePrio()
  emptyInput()
  selectedContacts = []
  subtasks = []
  contacts = []
  renderContacts("add-task-contacts-container")
}

/**
 * Clears the priority selection by removing the focus classes from all priority buttons.
 * @function deletePrio
 * @returns {void}
 */
function deletePrio() {
  document
    .getElementById("urgent-button")
    .classList.remove("urgent-button-focus")
  document
    .getElementById("medium-button")
    .classList.remove("medium-button-focus")
  document.getElementById("low-button").classList.remove("low-button-focus")
}

/**
 * Empties all input fields related to task creation and resets the category selection.
 * Clears task title, description, assigned contacts, date, category, and subtasks.
 * @function emptyInput
 * @returns {void}
 */
function emptyInput() {
  document.getElementById("task-title").value = ""
  document.getElementById("add-task-description").value = ""
  document.getElementById("add-task-assigned").value = ""
  document.getElementById("task-date").value = ""
  document.getElementById("select-task-text").innerHTML = `Select task category`
  document.getElementById("add-task-subtasks").value = ""
  document.getElementById("subtasks-list").innerHTML = ""
}
