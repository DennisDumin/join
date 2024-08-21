/**
 * Includes HTML content into elements based on the `w3-include-html` attribute.
 * This function fetches HTML files specified in the `w3-include-html` attribute
 * of the elements and inserts the content into those elements. If the fetch fails,
 * it displays "Page not found" in the element.
 * @async
 * @function includeHTML
 * @returns {Promise<void>} A promise that resolves when all HTML content has been included.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]")
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i]
    file = element.getAttribute("w3-include-html")
    let resp = await fetch(file)
    if (resp.ok) {
      element.innerHTML = await resp.text()
    } else {
      element.innerHTML = "Page not found"
    }
  }
}

/**
 * Immediately invokes an async function that includes HTML content and shows the user.
 * This self-invoking async function first calls `includeHTML` to load the HTML content
 * and then invokes `showUser` to display user information.
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when both `includeHTML` and `showUser` are completed.
 */
;(async function () {
  await includeHTML()
  showUser()
})()

/**
 * Retrieves user data from local storage and returns it.
 * If no user data is found, returns a default user object.
 * 
 * @returns {Object} The user data object.
 */
function getUserData() {
  const userAsText = localStorage.getItem("user");
  if (userAsText) {
      return JSON.parse(userAsText);
  } 
  return {
      id: "guest",
      name: "Gast",
      initials: "G"
  };
}

/**
* Fetches user data from the server.
* 
* @param {string} userId - The ID of the user to fetch.
* @returns {Promise<Object>} The fetched user data.
* @throws Will throw an error if the fetch fails or user data is incomplete.
*/
async function fetchUserData(userId) {
  try {
      const response = await fetch(`${BASE_URL}users/${userId}.json`);
      if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
      }
      const user = await response.json();
      if (!user || !user.initials) {
          throw new Error("User data is incomplete or not found.");
      }
      return user;
  } catch (error) {
      console.error("Error fetching user data from Firebase:", error.message);
      throw error;
  }
}

/**
* Displays the user's initials in the designated container.
* Retrieves user information, fetches additional data if needed,
* and updates the `userInitials` element with the user's initials.
* 
* @returns {void}
*/
async function showUser() {
  const userInitialsElement = document.getElementById("userInitials");
  if (!userInitialsElement) {
      console.error("Cannot find container userInitials");
      return;
  }

  const user = getUserData();

  if (user.id === "guest") {
      userInitialsElement.innerHTML = `<div>${user.initials}</div>`;
      return;
  }

  try {
      const fetchedUser = await fetchUserData(user.id);
      userInitialsElement.innerHTML = `<div>${fetchedUser.initials}</div>`;
  } catch {
      userInitialsElement.innerHTML = `<div>${user.initials}</div>`;
  }
}


/**
 * Adds a background focus class to the summary menu link.
 * This function adds the "bg-focus" class to the element with the ID "link-summary",
 * which is typically used to highlight the active menu item for the summary page.
 * @function summaryBgMenu
 * @returns {void}
 */
function summaryBgMenu() {
  document.getElementById("link-summary").classList.add("bg-focus")
}

/**
 * Adds a background focus class to the add task menu link.
 * This function adds the "bg-focus" class to the element with the ID "link-task",
 * which is typically used to highlight the active menu item for the add task page.
 * @function addTaskBgMenu
 * @returns {void}
 */
function addTaskBgMenu() {
  document.getElementById("link-task").classList.add("bg-focus")
}

/**
 * Adds a background focus class to the board menu link.
 * This function adds the "bg-focus" class to the element with the ID "link-board",
 * which is typically used to highlight the active menu item for the board page.
 * @function boardBgMenu
 * @returns {void}
 */
function boardBgMenu() {
  document.getElementById("link-board").classList.add("bg-focus")
}
