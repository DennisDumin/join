/**
 * @type {Array}
 */
let array = [];

/**
 * @type {Array}
 */
let material = [];

/**
 * @type {string|null}
 */
let keyForEdit = null;

/**
 * @type {string|null}
 */
let highlightKey = null;

/**
 * @type {number}
 */
let colorIndex = 0;

/**
 * @type {Array}
 */
let loadedColors = [];

/**
 * @type {boolean}
 */
let contactViewed = false;

/**
 * @type {Array}
 */
const colors = generateColors(20);

/**
 * Loads data from a server and initializes the application.
 * @async
 */
async function loadData() {
    try {
        let response = await fetch(BASE_URL + '.json');
        let responseAsJson = await response.json();
        let info = responseAsJson.contact;
        material.push(responseAsJson.contact);
        renderData(info);
        let colorIndexResponse = await fetch(BASE_URL + 'colorIndex.json');
        let colorIndexData = await colorIndexResponse.json();
        if (colorIndexData !== null) {
            colorIndex = colorIndexData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * Renders contact data on the page.
 * @param {Object} info - The contact information to render.
 */
function renderData(info) {
    hideMobileAssets();
    let content = document.getElementById('contacts');
    content.innerHTML = '';

    const groupedContacts = groupAndSortContacts(info);
    const sortedKeys = Object.keys(groupedContacts).sort();

    sortedKeys.forEach(letter => {
        renderGroup(content, letter, groupedContacts[letter]);
    });

    newContactBgHighlight();
    contactsBgMenu();
}

/**
 * Groups and sorts contacts alphabetically by their names.
 * @param {Object} info - The contact information.
 * @returns {Object} - The grouped and sorted contacts.
 */
function groupAndSortContacts(info) {
    let groupedContacts = Object.keys(info).reduce((groups, id) => {
        const contact = info[id];
        const firstLetter = contact.name[0].toUpperCase();

        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push({ id, ...contact });

        return groups;
    }, {});
    Object.keys(groupedContacts).forEach(letter => {
        groupedContacts[letter].sort((a, b) => {
            return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
        });
    });
    return groupedContacts;
}

/**
 * Renders a group of contacts under a specific letter.
 * @param {HTMLElement} content - The content container element.
 * @param {string} letter - The letter representing the group.
 * @param {Array} contacts - The contacts under the group.
 */
function renderGroup(content, letter, contacts) {
    content.innerHTML += `<h3 class="letter">${letter}</h3>`;
    contacts.forEach(contact => {
        renderContact(content, contact);
    });
}

/**
 * Renders a single contact.
 * @param {HTMLElement} content - The content container element.
 * @param {Object} contact - The contact information.
 */
function renderContact(content, contact) {
    const contactColor = contact.color || getRandomColor();
    content.innerHTML += renderContactHtml(contactColor, contact);
}

/**
 * Gets the initials of a name.
 * @param {string} name - The name to get initials from.
 * @returns {string} - The initials of the name.
 */
function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join(' ');
}

/**
 * Renders detailed contact information.
 * @param {string} contactId - The ID of the contact.
 */
function renderDetailedContact(contactId) {
    let source = material[0][contactId];

    if (keyForEdit !== null) {
        document.getElementById(keyForEdit).classList.remove('blueBackground');
    }

    keyForEdit = contactId;
    document.getElementById(keyForEdit).classList.add('blueBackground');

    let target = document.getElementById('content');
    target.innerHTML = detailedContactHtml(source, contactId);
    fillEditPopUp(source);
    checkUserMaxWidth();
    setSingleLetterBackgroundColor(contactId);
}

/**
 * Fills the edit popup with contact data.
 * @param {Object} source - The contact information.
 */
function fillEditPopUp(source) {
    document.getElementById('letterForPopUp').innerHTML = `${source['name'][0]}`;
    document.getElementById('editEmail').value = source['email'];
    document.getElementById('editTel').value = source['telefonnummer'];
    document.getElementById('editName').value = source['name'];
}

/**
 * Sets the background color of the single-letter profile.
 * @param {string} contactId - The ID of the contact.
 */
function setSingleLetterBackgroundColor(contactId) {
    let source = material[0][contactId];
    let singleLetterElement = document.getElementById('singleLetterProfile');
    if (singleLetterElement) {
        let contactColor = source.color || getRandomColor();
        singleLetterElement.style.backgroundColor = contactColor;
    }
}

/**
 * Adds a new contact.
 */
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

/**
 * Generates a list of random colors.
 * @param {number} numColors - The number of colors to generate.
 * @returns {Array} - The generated colors.
 */
function generateColors(numColors) {
    const colors = [];
    const letters = '0123456789ABCDEF';
    const brightnessThreshold = 128;

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

/**
 * Calculates the brightness of a color.
 * @param {string} color - The color in hex format.
 * @returns {number} - The brightness of the color.
 */
function getColorBrightness(color) {
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
}

/**
 * Gets the next color from the list of generated colors.
 * @returns {string} - The next color.
 */
function getNextColor() {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    saveColorIndex();
    return color;
}

/**
 * Posts a new contact to the server.
 * @async
 * @param {string} path - The server path to post the contact to.
 */
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
            saveColorIndex();
        } else {
            console.error('Failed to save contact');
        }
    }
    window.location.reload();
}

/**
 * Saves the current color index to the server.
 */
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

/**
 * Saves the highlight key to local storage.
 */
function saveForBackground() {
    let asTexthighlightKey = JSON.stringify(highlightKey);
    localStorage.setItem('highlightKey', asTexthighlightKey);
}

/**
 * Highlights the new contact background.
 */
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

/**
 * Searches for a name in the material array.
 * @returns {string} - The key of the found contact.
 */
function searchNameInMaterialArray() {
    let nameData = material[0]

    for (const key in nameData) {
        if (nameData[key].name === highlightKey['name']) {
            return key;
        }
    }
}

/**
 * Scrolls to the new contact div.
 */
function scrollToNewDiv() {
    document.getElementById(keyForEdit).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/**
 * Updates a contact.
 * @async
 */
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

/**
 * Edits a contact.
 * @returns {Object} - The edited contact data.
 */
function editContact() {
    let email = document.getElementById('editEmail');
    let name = document.getElementById('editName');
    let tel = document.getElementById('editTel');
    let data = {
        'email': email.value,
        'name': name.value,
        'telefonnummer': tel.value
    };
    return data;
}

/**
 * Prevents the window from reloading on form submission.
 * @param {string} key - The key to determine which form to prevent reload for.
 */
function stopWindowReload(key) {
    let target;
    if (key == 'new') {
        target = 'addContactForm';
    } else if (key == 'update') {
        target = 'editContactForm';
    }
    document.getElementById(target).addEventListener('submit', function (event) {
        event.preventDefault();
    });
}

/**
 * Deletes a contact.
 * @async
 * @param {string} [path='contact'] - The server path to delete the contact from.
 * @param {string} id - The ID of the contact to delete.
 */
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

/**
 * Opens or closes a popup.
 * @param {string} param - The action to perform ('open' or 'close').
 * @param {boolean} key - The key to validate the popup.
 */
function openClosePopUp(param, key) {
    let target = validatePopUp(key);
    let bgPopUp = document.getElementById(target);
    let popUp = bgPopUp.querySelector('.popUp');

    if (param === 'open') {
        paramOpen(bgPopUp, popUp);
    } else if (param === 'close') {
        paramClose(bgPopUp, popUp);
    } else {
        param.stopPropagation();
    }
}

/**
 * Opens a popup.
 * @param {HTMLElement} bgPopUp - The background popup element.
 * @param {HTMLElement} popUp - The popup element.
 */
function paramOpen(bgPopUp, popUp) {
    bgPopUp.classList.remove('displayNone', 'hide');
    bgPopUp.classList.add('show');
    popUp.classList.remove('slide-out');
    popUp.classList.add('slide-in');
}

/**
 * Closes a popup.
 * @param {HTMLElement} bgPopUp - The background popup element.
 * @param {HTMLElement} popUp - The popup element.
 */
function paramClose(bgPopUp, popUp) {
    popUp.classList.remove('slide-in');
    popUp.classList.add('slide-out');
    bgPopUp.classList.remove('show');
    bgPopUp.classList.add('hide');
    setTimeout(() => {
        bgPopUp.classList.add('displayNone');
    }, 500);
}

/**
 * Validates the popup key.
 * @param {boolean} key - The key to validate the popup.
 * @returns {string} - The validated popup ID.
 */
function validatePopUp(key) {
    return key ? 'backgroundPopUpEdit' : 'backgroundPopUp';
}

/**
 * Gets a random color.
 * @returns {string} - The generated random color.
 */
function getRandomColor() {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    console.log(color);
    return color;
}

/**
 * Shows the contact list on mobile.
 */
function showContactMobile() {
    document.getElementById('contentSection').classList.add('dNone');
    document.getElementById('contactList').classList.remove('displayNone');
    contactViewed = false;
}

/**
 * Adds background focus to the contacts menu.
 */
function contactsBgMenu() {
    document.getElementById('link-contact').classList.add('bg-focus');
}





