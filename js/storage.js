let contacts = [];
let tasks = [];
let users = [];

const BASE_URL = "https://contacts-881f2-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadDataLogin() {
    let response = await fetch(BASE_URL + "users.json");
    let usersData = await response.json();

    // Überprüfen, ob Daten vorhanden sind
    if (usersData) {
        // Iteriere durch die Benutzerdaten und füge sie dem users-Array hinzu
        Object.keys(usersData).forEach(key => {
            users.push(usersData[key]);
        });
    }
}

async function loadData() {
    let response = await fetch(BASE_URL + "contacts.json");
    let contactsData = await response.json();

    if (contactsData) {
        Object.keys(contactsData).forEach(key => {
            contacts.push(contactsData[key]);
        });
    }
}

async function onloadTasks() {
    await loadData();
    await loadTasks();
}

async function onloadFunc() {
    await loadDataLogin();
    fillRemembereInputs();
    changeImage();
}

async function loadTasks(){
    let response = await fetch(BASE_URL + "tasks.json");
    let tasksData = await response.json();

    if (tasksData) {
        Object.keys(tasksData).forEach(key => {
            tasks.push(tasksData[key]);
        });
    }
}

async function loadTasksBoard(){
    let response = await fetch(BASE_URL + "tasks.json");
    let tasksData = await response.json();

    if (tasksData) {
        Object.keys(tasksData).forEach(key => {
            tasks.push(tasksData[key]);
        });
        updateHTML(); //form Board.js
    }
}

async function getNextContactId() {
    try {
        const response = await fetch(`${BASE_URL}contacts.json`);
        const data = await response.json();

        if (!data) {
            return 0;
        }
        return Object.keys(data).length;
    } catch (error) {
        console.error('Error getting next contact ID:', error.message);
        throw error;
    }
}

async function loadContacts(path = "/contacts") {
    resetInputs();
    const contactsData = await fetchContactsData(path);

    if (!contactsData) {
        console.log("No contact data found.");
        return { names: [], emails: [], phoneNumbers: [] };
    }

    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    processContacts(contactsData, contactList);

}

async function createNewContactInFirebase(name, email, phoneNumber, nextColor) {
        const nextContactId = await getNextContactId();

        const response = await fetch(`${BASE_URL}/contacts/${nextContactId}.json`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                nummer: phoneNumber,
                color: nextColor
            })
        });
}

async function updateContactInFirebase(id, name, mail, phone, color) {
    const response = await fetch(`${BASE_URL}/contacts/${id}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email: mail, nummer: phone, color })
    });

    if (!response.ok) {
        throw new Error('Failed to update contact in Firebase');
    }
}

async function deleteContactBackend(path) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return await response.json();
}

async function postData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

async function deleteData(path=""){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}


async function putData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}