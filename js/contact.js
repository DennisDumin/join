let array = [];
let material = [];
let keyForEdit = null;
let highlightKey = null;

let colorIndex = 0;
let loadedColors = [];

const colors = generateColors(20);

async function loadData() {
    try {
        let response = await fetch(BASE_URL + '.json');
        let responseAsJson = await response.json();
        let info = responseAsJson.contact;
        material.push(responseAsJson.contact);
        renderData(info);

        // Lade den colorIndex aus Firebase, falls verfügbar
        let colorIndexResponse = await fetch(BASE_URL + 'colorIndex.json');
        let colorIndexData = await colorIndexResponse.json();
        if (colorIndexData !== null) {
            colorIndex = colorIndexData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}


function renderData(info) {
    let content = document.getElementById('contacts');
    content.innerHTML = '';

    // Kontakte alphabetisch nach Namen sortieren und gruppieren
    let groupedContacts = Object.keys(info).reduce((groups, id) => {
        const contact = info[id];
        const firstLetter = contact.name[0].toUpperCase();

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
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        }).forEach(contact => {
            const contactColor = contact.color || getRandomColor(); // Falls Kontakt keine Farbe hat, generiere zufällige Farbe
            content.innerHTML += `
                <div onclick="renderDetailedContact('${contact.id}')" id="${contact.id}" class="contactCard">
                     <div id="letter${contact.id}" class="single_letter" style="background-color: ${contactColor};">${contact.name[0]}</div>
                     <div class ="fullName-email">
                       <span>${contact.name}</span>
                       <a class="email" href="#">${contact.email}</a href="${contact.email}">
                     </div>
                </div>
            `;
        });
    }
    newContactBgHighlight();
}

function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join(' ');
}

function renderDetailedContact(contactId) {
    let source = material[0][contactId];
    
    // Entferne die blaue Hintergrundklasse vom vorherigen bearbeiteten Kontakt
    if (keyForEdit !== null) {
        document.getElementById(keyForEdit).classList.remove('blueBackground');
    }
    
    // Setze den neuen bearbeiteten Kontakt als aktuellen
    keyForEdit = contactId;
    
    // Füge die blaue Hintergrundklasse zum aktuellen bearbeiteten Kontakt hinzu
    document.getElementById(keyForEdit).classList.add('blueBackground');
    
    // Render das Kontakt-Detailprofil
    let target = document.getElementById('content');
    target.innerHTML = `
        <div class="contact-profile">
            <div id="singleLetterProfile" class="single-letter">${source['name'][0]}</div>
            <div class="h4_edit-delete">
                <h4>${source['name']}</h4>
                <div class="edit-delete">
                    <span onclick="openClosePopUp('open', true)"><img src="contact-assets/img/edit.png" />Edit</span>
                    <span onclick="deleteContact('contact', '${contactId}')"><img src="contact-assets/img/delete.png" />Delete</span>
                </div>
            </div>
        </div>
        <div class="pers-info">
            <b>Email</b>
            <a href="#">${source['email']}</a>
        </div>
        <div class="pers-info">
            <span><b>Phone</b></span>
            <span>${source['telefonnummer']}</span>
        </div>
    `;
    fillEditPopUp(source);
    checkUserMaxWidth();
    
    // Setze die Hintergrundfarbe des single-letter Profils
    setSingleLetterBackgroundColor(contactId);
}

function fillEditPopUp(source) {
    document.getElementById('letterForPopUp').innerHTML = `${source['name'][0]}`;
    document.getElementById('editEmail').value = source['name'];
    document.getElementById('editTel').value = source['telefonnummer'];
    document.getElementById('editName').value = source['email'];
}

function setSingleLetterBackgroundColor(contactId) {
    let source = material[0][contactId];
    
    let singleLetterElement = document.getElementById('singleLetterProfile');
    if (singleLetterElement) {
        let contactColor = source.color || getRandomColor(); // Verwende die vorhandene Farbe oder generiere eine neue
        singleLetterElement.style.backgroundColor = contactColor;
    }
}

function addContact() {
    stopWindowReload('new');

    let email = document.getElementById('email');
    let name = document.getElementById('name');
    let tel = document.getElementById('tel');
    const nextColor = getNextColor();
    let data = {
        'email': email.value,
        'name': name.value,
        'telefonnummer': tel.value,
        'color': nextColor
    };
    array.push(data);
    postNewContact('contact');
}

function generateColors(numColors) {
    const colors = [];
    const letters = '0123456789ABCDEF'; // Hexadezimal-Ziffern für Farbcodes
    const brightnessThreshold = 128; // Helligkeitsschwelle für den Text

    for (let i = 0; i < numColors; i++) {
        let color;
        do {
            color = '#';
            for (let j = 0; j < 6; j++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
        } while (getColorBrightness(color) < brightnessThreshold);

        colors.push(color);
    }

    return colors;
}

function getColorBrightness(color) {
    // Entferne das führende '#' und parse die Farbkomponenten
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Helligkeit berechnen (Luminanzmethode)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
}

function getNextColor() {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    saveColorIndex();
    return color;
}

async function postNewContact(path) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        highlightKey = element;
        saveForBackground();
        let response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(element)
        });
        if (response.ok) {
            console.log('Contact saved successfully');
            
            // Änderung hier: Speichern des aktuellen colorIndex in Firebase nach erfolgreicher Speicherung des Kontakts
            saveColorIndex();
        } else {
            console.error('Failed to save contact');
        }
    }
    window.location.reload();
}

function saveColorIndex() {
    fetch(BASE_URL + 'colorIndex.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(colorIndex)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update color index');
        }
        console.log('Color index updated successfully');
    })
    .catch(error => console.error('Error updating color index:', error));
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
        if (nameData[key].name === highlightKey['name']) {
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
        'email': email.value,
        'name': name.value,
        'telefonnummer': tel.value
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
    let sideBar = document.getElementById('containerSidebar');

    if (param === 'open') {
        bgPopUp.classList.remove('displayNone', 'hide');
        bgPopUp.classList.add('show');
        popUp.classList.remove('slide-out');
        popUp.classList.add('slide-in');
        sideBar.classList.add('displayNone')

    } else if (param === 'close') {
        popUp.classList.remove('slide-in');
        popUp.classList.add('slide-out');
        bgPopUp.classList.remove('show');
        bgPopUp.classList.add('hide');
        setTimeout(() => {
            bgPopUp.classList.add('displayNone');
        }, 500);
        sideBar.classList.remove('displayNone')
    } else {
        param.stopPropagation();
    }
}

function validatePopUp(key) {
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

function checkUserMaxWidth() {
    const mobileWidth = 800;

    if (window.matchMedia(`(max-width: ${mobileWidth}px)`).matches) {
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
        document.getElementById('contactList').classList.add('displayNone');
        document.getElementById('contentSection').classList.remove('dNone');
    } else {
        console.log('DesktopVersion')
    }
}

window.addEventListener('resize', hideMobileAssets)

function hideMobileAssets() {
    if (window.innerWidth > 800) {
        document.getElementById('mobileContactReturn').classList.add('displayNone');
        document.getElementById('return_mobilePopUp').classList.add('displayNone');
    } else if (window.innerWidth < 800) {
        document.getElementById('return_mobilePopUp').classList.remove('displayNone');
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
    }
}

function showContactMobile() {
    document.getElementById('contentSection').classList.add('dNone');
    document.getElementById('contactList').classList.remove('displayNone');
}

function contactsBgMenu() {
    document.getElementById('link-contact').classList.add('bg-focus');
  }
