const BASE_URL = 'https://contacts-881f2-default-rtdb.europe-west1.firebasedatabase.app/';
let array = [];
let material = [];


async function loadData() {
    let response = await fetch(BASE_URL + '.json');
    let responseAsJson = await response.json();
    let info = responseAsJson.contact;
    material.push(responseAsJson);
    console.log(responseAsJson.contact)
    renderData(info);
}


function renderData(info) {
    let content = document.getElementById('contacts');
    content.innerHTML = '';

    let sortedKeys = Object.keys(info).sort((a, b) => {
        const nameA = info[a].Name.toUpperCase();
        const nameB = info[b].Name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    for (let id of sortedKeys) {
        if (info.hasOwnProperty(id)) {
            const contact = info[id];
            content.innerHTML += `
        <div class="contactCard">
            <div>Email: ${contact.Email}</div>
            <div>Name: ${contact.Name}</div>
            <div>Telefonnummer: ${contact.Telefonnummer}</div>
            <button onclick="deleteContact(path = 'contact', '${id}')">X</button>
        </div>
      `;
        }
    }
}

function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let tel = document.getElementById('tel');

    let data =
    {
        'Email': email.value,
        'Name': name.value,
        'Telefonnummer': tel.value
    };

    array.push(data);
    console.log(array[0]);
    console.log(contacts[0])

    giveSingleData(path = 'contact');
}


async function giveSingleData(path) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        console.log(element);
        let response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(element),
        });
    }
}

async function deleteContact(path = 'contact', id) {
    try {
        const url = `${BASE_URL}${path}/${id}.json`;
        let response = await fetch(url, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts');
        }
        console.log('Kontakt erfolgreich gelöscht');
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error.message);
    }
}


function openClosePopUp(param) {
    if (param === 'open') {
        document.getElementById('backgroundPopUp').classList.remove('displayNone');
      } else if (param === 'close') {
        document.getElementById('backgroundPopUp').classList.add('displayNone');
      } else {
        param.stopPropagation();
      }
}


