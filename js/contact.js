const BASE_URL = 'https://contacts-881f2-default-rtdb.europe-west1.firebasedatabase.app/';
let array = [];
let material = [];
let keyForEdit = null;
let highlightKey = null;


async function loadData() {
    let response = await fetch(BASE_URL + '.json');
    let responseAsJson = await response.json();
    let info = responseAsJson.contact;
    material.push(responseAsJson.contact);
    renderData(info);
}


function renderData(info) {
    let content = document.getElementById('contacts');
    content.innerHTML = '';

    // Kontakte alphabetisch nach Namen sortieren und gruppieren
    let groupedContacts = Object.keys(info).reduce((groups, id) => {
        const contact = info[id];
        const firstLetter = contact.Name[0].toUpperCase();

        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push({ id, ...contact });

        return groups;
    }, {});

    // Alphabetisch sortieren nach Buchstaben
    let sortedKeys = Object.keys(groupedContacts).sort();

    for (let letter of sortedKeys) {
        content.innerHTML += `<h3 class="letter">${letter}</h3>`;
        groupedContacts[letter].sort((a, b) => {
            const nameA = a.Name.toUpperCase();
            const nameB = b.Name.toUpperCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        }).forEach(contact => {
            content.innerHTML += `
                <div id="${contact.id}" class="contactCard">
                     <div onclick="renderDetailedContact('${contact.id}')" id="letter${contact.id}" class="single_letter">${contact.Name[0]}</div>
                     <div class ="fullName-email">
                       <span>${contact.Name}</span>
                       <a class="email" href="#">${contact.Email}</a href="${contact.Email}">
                     </div>
                </div>
            `;
            document.getElementById(`letter${contact.id}`).style.backgroundColor = getRandomColor();
        });
    }
    newContactBgHighlight()
}

function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join(' ');
}

function renderDetailedContact(contact) {
    let source = material[0][contact];
    if (keyForEdit !== null) {
        document.getElementById(keyForEdit).classList.remove('blueBackground');
    }
    keyForEdit = contact;
    document.getElementById(keyForEdit).classList.add('blueBackground');
    let target = document.getElementById('content');
    target.innerHTML = '';
    target.innerHTML =
        `
    <div class="contact-profile">
        <div class="single-letter">${source['Name'][0]}</div>
        <div class="h4_edit-delete">
          <h4>${source['Name']}</h4>
          <div class="edit-delete">
            <span onclick="openClosePopUp('open', key = true)"><img src="contact-assets/img/edit.png"></img>Edit</span>
            <span onclick="deleteContact(path='contact', '${contact}')"><img src="contact-assets/img/delete.png"></img>Delete</span>
          </div>
        </div>
    </div>
    <div class="pers-info">
      <b>Email</b>
      <a href="#">${source['Email']}</a>
    </div>
    <div class="pers-info">
      <span><b>Phone</b></span>
      <span>${source['Telefonnummer']}</span>
    </div>
    `;
}


function addContact() {
    stopWindowReload('new');

    let email = document.getElementById('email');
    let name = document.getElementById('name');
    let tel = document.getElementById('tel');
    let data =
    {
        'Email': email.value,
        'Name': name.value,
        'Telefonnummer': tel.value
    };
    array.push(data);
    postNewContact(path = 'contact');
}


async function postNewContact(path, id) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        highlightKey = element;
        saveForBackground();
        let response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(element),
        });
        window.location.reload();
    }
}

function saveForBackground() {
    let asTexthighlightKey = JSON.stringify(highlightKey);
    localStorage.setItem('highlightKey', asTexthighlightKey);
}


function newContactBgHighlight() {
    let asTexthighlightKey = localStorage.getItem('highlightKey')

    if (asTexthighlightKey === null) {
        return
    } else
    highlightKey = JSON.parse(asTexthighlightKey)
    console.log(highlightKey)
    keyForEdit = searchNameInMaterialArray();
    renderDetailedContact(keyForEdit);
    localStorage.clear();
    scrollToNewDiv();
}


function searchNameInMaterialArray() {
    let nameData = material[0]

    for (const key in nameData) {
        if (nameData[key].Name === highlightKey['Name']) {
            return key;
        }
    }
}


function scrollToNewDiv() {
    document.getElementById(keyForEdit).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
}


async function UpdateContact() {
    stopWindowReload('update');
    array.length = 0;
    array.push(editContact());
    const response = await fetch(`${BASE_URL}contact/${keyForEdit}.json`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(array[0]),
    });
    window.location.reload();
}


function editContact() {
    let email = document.getElementById('editEmail');
    let name = document.getElementById('editName');
    let tel = document.getElementById('editTel');
    let data =
    {
        'Email': email.value,
        'Name': name.value,
        'Telefonnummer': tel.value
    };
    return data;
}


function stopWindowReload(key) {
    let target;
    if (key == 'new') {
        target = 'addContactForm';
    } else if (key == 'update') {
        target = 'editContactForm';
    }
    document.getElementById(target), addEventListener('submit', function (event) {
        event.preventDefault();
    });
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
        window.location.reload();
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error.message);
    }
}


function openClosePopUp(param, key) {
    let target = validatePopUp(key);

    let bgPopUp = document.getElementById(target);
    let popUp = bgPopUp.querySelector('.popUp');

    if (param === 'open') {
        bgPopUp.classList.remove('displayNone', 'hide');
        bgPopUp.classList.add('show');
        popUp.classList.remove('slide-out');
        popUp.classList.add('slide-in');
    } else if (param === 'close') {
        popUp.classList.remove('slide-in');
        popUp.classList.add('slide-out');
        bgPopUp.classList.remove('show');
        bgPopUp.classList.add('hide');
        setTimeout(() => {
            bgPopUp.classList.add('displayNone');
        }, 500);
    } else {
        param.stopPropagation();
    }
}


function validatePopUp() {
    return key ? 'backgroundPopUpEdit' : 'backgroundPopUp';
}

function getRandomColor() {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    console.log(color);
    return color;
}


async function testFetch() {
    let response = await fetch(BASE_URL + 'contact' + '-O-5fQkP0Xg1m4qHkE21' + '.json');
    let responseAsJson = await response.json();
    console.log(responseAsJson);
}





