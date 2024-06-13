const BASE_URL = 'https://contacts-881f2-default-rtdb.europe-west1.firebasedatabase.app/';
let array = [];
let material = [];


async function loadData() {
    let response = await fetch(BASE_URL + '.json');
    let responseAsJson = await response.json();
    let info = responseAsJson.contact;
    material.push(responseAsJson.contact);
    console.log(responseAsJson.contact)
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
}


function renderDetailedContact(contact) {
    let source = material[0][contact];
    console.log(source['Email']);
    console.log(source['Telefonnummer']);
    console.log(source['Name']);
    console.log(contact);
    let target = document.getElementById('content');
    target.innerHTML = '';
    target.innerHTML = 
    `
    <div class="contact-profile">
        <div class="single-letter">${source['Name'][0]}</div>
        <div class="h4_edit-delete">
          <h4>${source['Name']}</h4>
          <div class="edit-delete">
            <span><img src="contact-assets/img/edit.png"></img>Edit</span>
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


async function postNewContact(path) {
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

function getRandomColor() {
    const letters = '89ABCDEF'; 
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    console.log(color);
    return color;
}


