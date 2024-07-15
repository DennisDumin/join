let contacts = [];
let tasks = [];
let users = [];

const BASE_URL = "https://contacts-881f2-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadDataLogin() {
    try {
        let response = await fetch(BASE_URL + "users.json");
        let usersData = await response.json();

        // Überprüfen, ob Daten vorhanden sind
        if (usersData) {
            // Iteriere durch die Benutzerdaten und füge sie dem users-Array hinzu
            Object.keys(usersData).forEach(key => {
                users.push(usersData[key]);
            });
        }
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
}

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

async function fetchContactsData(path) {
    try {
        const response = await fetch(BASE_URL + path + ".json");
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontaktdaten:', error);
        throw error;
    }
}

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