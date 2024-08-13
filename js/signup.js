/**
 * List to store user data.
 * @type {Array<Object>}
 */
let userList = [];

/**
 * This function handles the creation of a new user. 
 * It checks for various conditions such as email uniqueness, 
 * password validation, and acceptance of the privacy policy.
 * 
 * @returns {Promise<void>}
 */
async function addUser() {
  let mail = document.getElementById("inputSignUpMail");
  let password = document.getElementById("inputSignUpPassword1");
  let password2 = document.getElementById("inputSignUpPassword2");
  let checkbox = document.getElementById("checkboxAccept");
  let passwordIncorrect = document.getElementById("passwordIncorrect");
  if (!checkbox.checked) {
    passwordIncorrect.classList.remove("d-none");
    passwordIncorrect.innerText = "You must accept the Privacy Policy";
    checkbox.style.border = "2px solid red";
    return;
  }
  if (!(await isEmailUnique(mail.value))) {
    passwordIncorrect.classList.remove("d-none");
    passwordIncorrect.innerText = "This email is already registered";
    mail.style.border = "2px solid red";
    return;
  }
  let user = createUserObject();
  if (await passwordCheck(user, password, password2)) {
  }
}

/**
 * Creates a user object based on the input values from the signup form.
 * 
 * @returns {Object} The user object containing name, initials, password, and email.
 */
function createUserObject() {
  let name = document.getElementById("inputSignUpName").value;
  let mail = document.getElementById("inputSignUpMail").value;
  let password = document.getElementById("inputSignUpPassword1").value;
  return {
    name: name,
    initials: getInitials(name),
    password: password,
    mail: mail,
  };
}

/**
 * Checks whether the given email is unique among the existing users.
 * 
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} True if the email is unique, false otherwise.
 */
async function isEmailUnique(email) {
  await loadUser();
  return !userList.some((user) => user.mail === email);
}

/**
 * Validates the password by checking if the passwords are not empty 
 * and whether they match. If valid, the user is registered.
 * 
 * @param {Object} user - The user object.
 * @param {HTMLInputElement} password - The first password input element.
 * @param {HTMLInputElement} password2 - The second password input element.
 * @returns {Promise<boolean>} True if passwords are valid, false otherwise.
 */
async function passwordCheck(user, password, password2) {
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();
  if (await isPasswordEmpty(passwordValue, password2Value)) {
  }
  if (await isPasswordEqual(user, passwordValue, password2Value)) {
  } else {
    let passwordIncorrect = document.getElementById("passwordIncorrect");
    passwordIncorrect.innerHTML = "Ups! your passwords don't match";
    password2.style.border = "2px solid red";
    return false;
  }
}

/**
 * Checks if the two password fields are equal. If they match, 
 * the user is registered and redirected to the signup page.
 * 
 * @param {Object} user - The user object.
 * @param {string} passwordValue - The first password value.
 * @param {string} password2Value - The second password value.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
async function isPasswordEqual(user, passwordValue, password2Value) {
  if (passwordValue === password2Value) {
    document.getElementById("bgSignupSuccesfully").classList.remove("d-none");
    await postData("/users", user);
    setTimeout(function () {
      window.location.href = "./sign_up.html";
    }, 1500);
    return true;
  }
}

/**
 * Checks if the password fields are empty. If either field is empty, 
 * an error message is displayed.
 * 
 * @param {string} passwordValue - The first password value.
 * @param {string} password2Value - The second password value.
 * @returns {Promise<boolean>} False if passwords are empty, true otherwise.
 */
async function isPasswordEmpty(passwordValue, password2Value) {
  if (passwordValue === "" || password2Value === "") {
    let passwordIncorrect = document.getElementById("passwordIncorrect");
    passwordIncorrect.innerHTML = "Passwords cannot be empty";
    password2.style.border = "2px solid red";
    return false;
  }
}

/**
 * Loads the list of users from the server and populates the `userList` array.
 * 
 * @returns {Promise<void>}
 */
async function loadUser() {
  userList = [];
  let users = await getData("users");
  let userIDs = Object.keys(users || []);
  for (let i = 0; i < userIDs.length; i++) {
    let userID = userIDs[i];
    let user = users[userID];
    user.id = userID;
    userList.push(user);
  }
}


/**
 * Handles the login process for a registered user.
 * 
 * This function retrieves the email and password entered by the user,
 * checks if they match any user in the `userList`, and logs the user in 
 * if a match is found by storing the user data in local storage and 
 * redirecting to the summary page. If no match is found, an error message 
 * is displayed.
 * 
 * @function login
 */
function login() {
  let mail = document.getElementById("inputLoginMail");
  let password = document.getElementById("inputLoginPassword");
  let user = userList.find(
    (u) => u.mail == mail.value && u.password == password.value
  );
  if (user) {
    let userAsText = JSON.stringify(user);
    localStorage.setItem("user", userAsText);
    window.location.href = "./summary.html";
  } else {
    let failedLogin = document.getElementById("failedLogin");
    failedLogin.classList.remove("d-none");
    failedLogin.innerHTML = "E-Mail or password are incorrect";
  }
}

/**
 * Logs in a guest user.
 * 
 * This function creates a guest user object with predefined initials 
 * and name ("G" and "Gast" respectively), stores it in local storage, 
 * and redirects to the summary page.
 * 
 * @function guestLogin
 */
function guestLogin() {
  let user = {
    initials: "G",
    name: "Gast",
  };
  let userAlsText = JSON.stringify(user);
  localStorage.setItem("user", userAlsText);
  window.location.href = "./summary.html";
}

/**
 * Generates initials from a given name. 
 * The initials are the first letters of each word in the name.
 * 
 * @param {string} name - The full name of the user.
 * @returns {string} The initials derived from the name.
 */
function getInitials(name) {
  return name
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Handles the signup button click event and prevents the default form submission.
 * It triggers the user creation process.
 * 
 * @param {Event} event - The click event object.
 */
function closeBtnSignUpSuccesfully(event) {
  event.preventDefault();
  addUser();
}
