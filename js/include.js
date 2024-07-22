async function initInclude() {
  await includeHTML()
  await loadData()
}

function toggleMenu() {
  let dropdownMenu = document.querySelector(".headerLogoutButton .dropdownMenu")
  dropdownMenu.classList.toggle("d-none")
}

function returnToHome() {
  window.location.href = "index.html"
}

function redirectToHelp() {
  window.location.href = "help.html"
}

function redirectToSummary() {
  window.location.href = "summary.html"
}

function redirectToAddTask() {
  window.location.href = "add_task.html"
}

function redirectToBoard() {
  window.location.href = "board.html"
}

function redirectToContact() {
  window.location.href = "contacts.html"
}

function redirectToLegalNotice() {
  window.location.href = "legal_notice.html"
}

function redirectToPrivacyPolice() {
  window.location.href = "privacy-police.html"
}

function redirectToPrivacyPoliceSignup() {
  window.open("privacyPoliceSignup.html", "_blank")
}

function redirectToLegalNoticeSignup() {
  window.open("legalNoticeSignup.html", "_blank")
}

async function initHelp() {
  await loadData()
}
