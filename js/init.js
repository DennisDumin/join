async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

;(async function () {
  await includeHTML();
  showUser();
})();

function showUser() {
  let userInitials = document.getElementById("userInitials");
  if (!userInitials) {
    console.error("Can not find container userInitials");
    return;
  }

  let userAsText = localStorage.getItem("user");
  if (!userAsText) {
    console.error("No user data found in localStorage");
    userInitials.innerHTML = `<div>User not found</div>`;
    return;
  }

  let user;
  try {
    user = JSON.parse(userAsText);
  } catch (e) {
    console.error("Error parsing user data from localStorage", e);
    userInitials.innerHTML = `<div>Error loading user</div>`;
    return;
  }

  if (!user || !user.initials) {
    console.error("User data is invalid or missing initials");
    userInitials.innerHTML = `<div>User data is invalid</div>`;
    return;
  }

  userInitials.innerHTML = `<div>${user.initials}</div>`;
}

function summaryBgMenu() {
  document.getElementById("link-summary").classList.add("bg-focus")
}

function addTaskBgMenu() {
  document.getElementById("link-task").classList.add("bg-focus")
}

function boardBgMenu() {
  document.getElementById("link-board").classList.add("bg-focus")
}
