/**
 * Array to store contact information.
 * @type {Array<Object>}
 */
let contacts = [];

/**
 * Array to store task information.
 * @type {Array<Object>}
 */
let tasks = [];

/**
 * Array to store user information.
 * @type {Array<Object>}
 */
let users = [];

/**
 * Base URL for accessing the Firebase Realtime Database.
 * @type {string}
 */
const BASE_URL = "https://contacts-881f2-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads user data from the Firebase database during login.
 * 
 * Fetches user data from the specified Firebase URL and populates the `users` array.
 * Logs an error message to the console if the data cannot be loaded.
 * 
 * @async
 * @function loadDataLogin
 */
async function loadDataLogin() {
    try {
        let response = await fetch(BASE_URL + "users.json");
        let usersData = await response.json();
        if (usersData) {
            Object.keys(usersData).forEach(key => {
                users.push(usersData[key]);
            });
        }
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
}

/**
 * Loads contact data from the Firebase database.
 * 
 * Fetches contact data from the specified Firebase URL and populates the `contacts` array.
 * Logs an error message to the console if the data cannot be loaded.
 * 
 * @async
 * @function loadData
 */
async function loadData() {
    try {
        let response = await fetch(BASE_URL + "contact.json");
        let contactsData = await response.json();

        if (contactsData) {
            Object.keys(contactsData).forEach(key => {
                contacts.push(contactsData[key]);
            });
        }
    } catch (error) {
        console.error('Fehler beim Laden der Kontaktdaten:', error);
    }
}

/**
 * Loads tasks and contacts data when the task page is loaded.
 * 
 * Calls `loadData()` to load contacts and `loadTasks()` to load tasks.
 * 
 * @async
 * @function onloadTasks
 */
async function onloadTasks() {
    await loadData();
    await loadTasks();
}

/**
 * Loads user data and prepares the login page on page load.
 * 
 * Calls `loadDataLogin()` to load user data, and then calls 
 * additional functions to handle remembered inputs and image changes.
 * 
 * @async
 * @function onloadFunc
 */
async function onloadFunc() {
    await loadDataLogin();
    fillRemembereInputs();
    changeImage();
}

/**
 * Loads tasks data from the Firebase database.
 * 
 * Fetches task data from the specified Firebase URL and populates the `tasks` array.
 * Logs an error message to the console if the data cannot be loaded.
 * 
 * @async
 * @function loadTasks
 */
async function loadTasks(){
    try {
        let response = await fetch(BASE_URL + "tasks.json");
        let tasksData = await response.json();

        if (tasksData) {
            Object.keys(tasksData).forEach(key => {
                tasks.push(tasksData[key]);
            });
        }
    } catch (error) {
        console.error('Fehler beim Laden der Aufgabendaten:', error);
    }
}

/**
 * Loads tasks data for the task board and updates the HTML content.
 * 
 * Fetches task data from the specified Firebase URL, populates the `tasks` array, 
 * and then updates the HTML content of the task board.
 * Logs an error message to the console if the data cannot be loaded.
 * 
 * @async
 * @function loadTasksBoard
 */
async function loadTasksBoard(){
    try {
        let response = await fetch(BASE_URL + "tasks.json");
        let tasksData = await response.json();

        if (tasksData) {
            Object.keys(tasksData).forEach(key => {
                tasks.push(tasksData[key]);
            });
            updateHTML();
        }
    } catch (error) {
        console.error('Fehler beim Laden der Aufgaben für das Board:', error);
    }
}

/**
 * Gets the next available contact ID from the Firebase database.
 * 
 * Fetches contact data from the specified Firebase URL and returns the number 
 * of contacts to determine the next ID. Logs an error message to the console if 
 * the data cannot be loaded.
 * 
 * @async
 * @function getNextContactId
 * @returns {Promise<number>} The next available contact ID.
 */
async function getNextContactId() {
    try {
        const response = await fetch(`${BASE_URL}contact.json`);
        const data = await response.json();

        if (!data) {
            return 0;
        }
        return Object.keys(data).length;
    } catch (error) {
        console.error('Fehler beim Abrufen der nächsten Kontakt-ID:', error);
        throw error;
    }
}

/**
 * Loads contact data and populates the contact list in the UI.
 * 
 * Resets input fields, fetches contact data from the specified path, 
 * and processes it to display in the contact list. Logs a message if no contact 
 * data is found.
 * 
 * @async
 * @function loadContacts
 * @param {string} [path="contact"] - The path to fetch contacts data from.
 * @returns {Promise<{names: Array<string>, emails: Array<string>, phoneNumbers: Array<string>}>}
 * An object containing empty arrays for names, emails, and phone numbers if no data is found.
 */
async function loadContacts(path = "contact") {
    resetInputs();
    const contactsData = await fetchContactsData(path);

    if (!contactsData) {
        console.log("Keine Kontaktdaten gefunden.");
        return { names: [], emails: [], phoneNumbers: [] };
    }

    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    processContacts(contactsData, contactList);
}

/**
 * Fetches contact data from the Firebase database.
 * 
 * Sends a request to the specified path in the Firebase database and returns the result as JSON.
 * Logs an error message to the console if the data cannot be loaded.
 * 
 * @async
 * @function fetchContactsData
 * @param {string} path - The path to fetch contacts data from.
 * @returns {Promise<Object>} The fetched contact data.
 * @throws Will throw an error if the fetch operation fails.
 */
async function fetchContactsData(path) {
    try {
        const response = await fetch(BASE_URL + path + ".json");
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontaktdaten:', error);
        throw error;
    }
}

/**
 * Creates a new contact in the Firebase database.
 * 
 * This function retrieves the next available contact ID, and then sends a PUT request 
 * to create a new contact with the specified name, email, phone number, and color.
 * Logs an error and throws it if the operation fails.
 * 
 * @async
 * @function createNewContactInFirebase
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phoneNumber - The phone number of the contact.
 * @param {string} nextColor - The color associated with the contact.
 * @throws Will throw an error if the contact creation fails.
 */
async function createNewContactInFirebase(name, email, phoneNumber, nextColor) {
    try {
        const nextContactId = await getNextContactId();

        const response = await fetch(`${BASE_URL}contact/${nextContactId}.json`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                telefonnummer: phoneNumber,
                color: nextColor
            })
        });

        if (!response.ok) {
            throw new Error('Fehler beim Erstellen eines neuen Kontakts');
        }
    } catch (error) {
        console.error('Fehler beim Erstellen eines neuen Kontakts:', error);
        throw error;
    }
}

/**
 * Updates an existing contact in the Firebase database.
 * 
 * Sends a PUT request to update the contact with the given ID using the provided name, email, 
 * phone number, and color. Logs an error and throws it if the operation fails.
 * 
 * @async
 * @function updateContactInFirebase
 * @param {string} id - The ID of the contact to be updated.
 * @param {string} name - The updated name of the contact.
 * @param {string} mail - The updated email address of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @param {string} color - The updated color associated with the contact.
 * @throws Will throw an error if the contact update fails.
 */
async function updateContactInFirebase(id, name, mail, phone, color) {
    try {
        const response = await fetch(`${BASE_URL}contact/${id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email: mail, telefonnummer: phone, color })
        });

        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren des Kontakts in Firebase');
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
        throw error;
    }
}

/**
 * Deletes a contact from the Firebase database.
 * 
 * Sends a DELETE request to remove the contact at the specified path. 
 * Logs an error and throws it if the operation fails.
 * 
 * @async
 * @function deleteContactBackend
 * @param {string} path - The path to the contact to be deleted.
 * @returns {Promise<Object>} The response from the server after deletion.
 * @throws Will throw an error if the contact deletion fails.
 */
async function deleteContactBackend(path) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }

        return await response.json();
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
        throw error;
    }
}

/**
 * Sends a POST request to the Firebase database to create a new record.
 * 
 * Posts the provided data to the specified path in the Firebase database.
 * Logs an error and throws it if the operation fails.
 * 
 * @async
 * @function postData
 * @param {string} [path=""] - The path where the data should be posted.
 * @param {Object} [data={}] - The data to be posted.
 * @returns {Promise<Object>} The response from the server after posting.
 * @throws Will throw an error if the data posting fails.
 */
async function postData(path="", data={}){
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Fehler beim Posten der Daten');
        }

        return await response.json();
    } catch (error) {
        console.error('Fehler beim Posten der Daten:', error);
        throw error;
    }
}

/**
 * Sends a DELETE request to remove data from the Firebase database.
 * 
 * Deletes the data at the specified path in the Firebase database.
 * Logs an error and throws it if the operation fails.
 * 
 * @async
 * @function deleteData
 * @param {string} [path=""] - The path to the data to be deleted.
 * @returns {Promise<Object>} The response from the server after deletion.
 * @throws Will throw an error if the data deletion fails.
 */
async function deleteData(path=""){
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen der Daten');
        }

        return await response.json();
    } catch (error) {
        console.error('Fehler beim Löschen der Daten:', error);
        throw error;
    }
}

/**
 * Sends a PUT request to update data in the Firebase database.
 * 
 * Updates the data at the specified path in the Firebase database using the provided data.
 * Logs an error and throws it if the operation fails.
 * 
 * @async
 * @function putData
 * @param {string} [path=""] - The path where the data should be updated.
 * @param {Object} [data={}] - The data to be updated.
 * @returns {Promise<Object>} The response from the server after updating.
 * @throws Will throw an error if the data update fails.
 */
async function putData(path="", data={}){
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren der Daten');
        }

        return await response.json();
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Daten:', error);
        throw error;
    }
}