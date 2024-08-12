/**
 * Initializes required components for the application by including HTML content
 * and loading necessary data.
 * This function awaits the completion of `includeHTML` and `loadData` functions.
 * @async
 * @function initInclude
 * @returns {Promise<void>} A promise that resolves when both `includeHTML` and `loadData` are completed.
 */
async function initInclude() {
  await includeHTML()
  await loadData()
}

/**
 * Toggles the visibility of the dropdown menu in the header.
 * This function adds or removes the "d-none" class from the dropdown menu, 
 * which controls its visibility.
 * @function toggleMenu
 * @returns {void}
 */
function toggleMenu() {
  let dropdownMenu = document.querySelector(".headerLogoutButton .dropdownMenu")
  dropdownMenu.classList.toggle("d-none")
}


/**
 * Redirects the user to the home page.
 * This function changes the current window location to "index.html".
 * @function returnToHome
 * @returns {void}
 */
function returnToHome() {
  window.location.href = "index.html";
}

/**
 * Redirects the user to the help page.
 * This function changes the current window location to "help.html".
 * @function redirectToHelp
 * @returns {void}
 */
function redirectToHelp() {
  window.location.href = "help.html";
}

/**
 * Redirects the user to the summary page.
 * This function changes the current window location to "summary.html".
 * @function redirectToSummary
 * @returns {void}
 */
function redirectToSummary() {
  window.location.href = "summary.html";
}

/**
 * Redirects the user to the add task page.
 * This function changes the current window location to "add_task.html".
 * @function redirectToAddTask
 * @returns {void}
 */
function redirectToAddTask() {
  window.location.href = "add_task.html";
}

/**
 * Redirects the user to the board page.
 * This function changes the current window location to "board.html".
 * @function redirectToBoard
 * @returns {void}
 */
function redirectToBoard() {
  window.location.href = "board.html";
}

/**
 * Redirects the user to the contacts page.
 * This function changes the current window location to "contacts.html".
 * @function redirectToContact
 * @returns {void}
 */
function redirectToContact() {
  window.location.href = "contacts.html";
}

/**
 * Redirects the user to the legal notice page.
 * This function changes the current window location to "legal_notice.html".
 * @function redirectToLegalNotice
 * @returns {void}
 */
function redirectToLegalNotice() {
  window.location.href = "legal_notice.html";
}

/**
 * Redirects the user to the privacy policy page.
 * This function changes the current window location to "privacy-police.html".
 * @function redirectToPrivacyPolice
 * @returns {void}
 */
function redirectToPrivacyPolice() {
  window.location.href = "privacy-police.html";
}

/**
 * Opens the privacy policy signup page in a new browser tab.
 * This function opens "privacyPoliceSignup.html" in a new tab or window.
 * @function redirectToPrivacyPoliceSignup
 * @returns {void}
 */
function redirectToPrivacyPoliceSignup() {
  window.open("privacyPoliceSignup.html", "_blank");
}

/**
 * Opens the legal notice signup page in a new browser tab.
 * This function opens "legalNoticeSignup.html" in a new tab or window.
 * @function redirectToLegalNoticeSignup
 * @returns {void}
 */
function redirectToLegalNoticeSignup() {
  window.open("legalNoticeSignup.html", "_blank");
}

/**
 * Initializes the help page by loading necessary data.
 * This function awaits the completion of the `loadData` function.
 * @async
 * @function initHelp
 * @returns {Promise<void>} A promise that resolves when `loadData` is completed.
 */
async function initHelp() {
  await loadData();
}