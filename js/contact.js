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

        if (info) {
            material.push(info);
            array = Object.values(info);
        }

        renderData(info);

        let colorIndexResponse = await fetch(BASE_URL + 'colorIndex.json');
        let colorIndexData = await colorIndexResponse.json();
        if (colorIndexData !== null) {
            colorIndex = colorIndexData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    contactsBgMenu();
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
 * Validates if the provided contact ID is valid.
 * 
 * @param {string} contactId - The ID of the contact to validate.
 * @returns {boolean} - Returns `true` if the contact ID is valid, otherwise `false`.
 */
function isValidContactId(contactId) {
    if (!contactId) {
        console.error('Error: Contact ID is undefined or null.');
        return false;
    }
    return true;
}

/**
 * Retrieves the contact data based on the contact ID.
 * 
 * @param {string} contactId - The ID of the contact.
 * @returns {Object|null} - The contact data object or `null` if not found.
 */
function getContactData(contactId) {
    return material[0] ? material[0][contactId] : null;
}

/**
 * Updates the visual indication of the currently edited contact.
 * 
 * @param {string} contactId - The ID of the contact to be updated.
 * @returns {void}
 */
function updateEditedContactVisual(contactId) {
    if (keyForEdit !== null && document.getElementById(keyForEdit)) {
        document.getElementById(keyForEdit).classList.remove('blueBackground');
    }
    keyForEdit = contactId;
    let contactElement = document.getElementById(keyForEdit);
    if (contactElement) {
        contactElement.classList.add('blueBackground');
    } else {
        console.error('Error: Contact element not found for ID', contactId);
    }
}

/**
 * Renders the detailed contact information and updates the UI accordingly.
 * 
 * @param {Object} source - The contact data object.
 * @param {string} contactId - The ID of the contact.
 * @returns {void}
 */
function renderContactContent(source, contactId) {
    let target = document.getElementById('content');
    target.innerHTML = detailedContactHtml(source, contactId);
    fillEditPopUp(source);
    checkUserMaxWidth();
    setSingleLetterBackgroundColor(contactId);
}

/**
 * Renders detailed contact information.
 * 
 * @param {string} contactId - The ID of the contact.
 * @returns {void}
 */
function renderDetailedContact(contactId) {
    if (!isValidContactId(contactId)) return;

    let source = getContactData(contactId);
    if (!source) {
        console.error('Error: Contact data not found for ID', contactId);
        return;
    }

    updateEditedContactVisual(contactId);
    renderContactContent(source, contactId);
}

/**
 * Updates the initials and background color of the contact's initials element.
 * 
 * @param {Object} source - The contact information.
 * @property {string} source.name - The name of the contact.
 * @property {string} [source.color] - The background color for the contact's initials (optional).
 * @returns {void}
 */
function updateInitials(source) {
    const nameParts = source.name.split(' ');
    const initials = nameParts.length > 1
        ? nameParts[0][0] + nameParts[1][0]
        : nameParts[0][0];

    const letterElement = document.getElementById('letterForPopUp');
    if (letterElement) {
        letterElement.innerHTML = initials;
        letterElement.style.backgroundColor = source.color || getRandomColor();
    } else {
        console.error('Error: Element with ID "letterForPopUp" not found.');
    }
}

/**
 * Populates the edit popup fields with the contact's data.
 * 
 * @param {Object} source - The contact information.
 * @property {string} source.email - The email of the contact.
 * @property {string} source.telefonnummer - The phone number of the contact.
 * @property {string} source.name - The name of the contact.
 * @returns {void}
 */
function populatePopupFields(source) {
    document.getElementById('editEmail').value = source.email;
    document.getElementById('editTel').value = source.telefonnummer;
    document.getElementById('editName').value = source.name;
}

/**
 * Fills the edit popup with contact data.
 * Updates the visual appearance of the contact initials and populates other fields.
 * 
 * @param {Object} source - The contact information.
 * @property {string} source.name - The name of the contact.
 * @property {string} source.email - The email of the contact.
 * @property {string} source.telefonnummer - The phone number of the contact.
 * @property {string} [source.color] - The background color for the contact's initials (optional).
 * @returns {void}
 */
function fillEditPopUp(source) {
    if (!source || !source.name) {
        console.error('Error: Invalid contact data.');
        return;
    }

    updateInitials(source);
    populatePopupFields(source);
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
 * Checks if the contact already exists based on email, name, or phone number.
 * 
 * @param {string} email - The email of the contact to be checked.
 * @param {string} name - The name of the contact to be checked.
 * @param {string} tel - The phone number of the contact to be checked.
 * @param {Array} contacts - The list of existing contacts.
 * @returns {boolean} True if a duplicate contact is found, otherwise false.
 */
function validateDuplicateContact(email, name, tel, contacts) {
    return contacts.some(contact =>
        contact.email === email || contact.name === name || contact.telefonnummer === tel
    );
}

/**
 * Creates a new contact object with the provided details and a color.
 * 
 * @param {string} email - The email of the new contact.
 * @param {string} name - The name of the new contact.
 * @param {string} tel - The phone number of the new contact.
 * @param {string} color - The background color for the contact's initials.
 * @returns {Object} The newly created contact object.
 */
function createNewContact(email, name, tel, color) {
    return {
        'email': email,
        'name': name,
        'telefonnummer': tel,
        'color': color
    };
}

/**
 * Displays a notification with a custom message.
 * 
 * @param {string} message - The message to display in the notification.
 * @returns {void}
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Validates the name to ensure it doesn't consist of three identical letters or only whitespace.
 * 
 * @param {string} name - The name to validate.
 * @returns {boolean} Returns `true` if the name is valid, otherwise `false`.
 */
function validateName(name) {
    if (!name.trim()) {
        showNotification("Der Name darf nicht nur aus Leerzeichen bestehen.");
        document.getElementById('name').style.border = "2px solid red";
        return false;
    }
    const regex = /(.)\1\1/;
    if (regex.test(name)) {
        showNotification("Der Name darf nicht 3 mal den gleichen Buchstaben hintereinander haben.");
        document.getElementById('name').style.border = "2px solid red";
        return false;
    }
    document.getElementById('name').style.border = "";
    return true;
}

/**
 * Adds a new contact to the list and posts it to the server.
 * 
 * @param {Event} [event] - The event object, if any. Prevents default action if provided.
 * @returns {void}
 */
function addContact(event) {
    if (event) {
        event.preventDefault();
    }
    if (array.length === 0 && material.length > 0) {
        array = Object.values(material[0]);
    }
    let email = document.getElementById('email').value.trim();
    let name = document.getElementById('name').value.trim();
    let tel = document.getElementById('tel').value.trim();
    if (!validateName(name)) {
        return;
    }

    if (validateDuplicateContact(email, name, tel, array)) {
        showDuplicateNotification();
        return;
    }
    const nextColor = getNextColor();
    let newContact = createNewContact(email, name, tel, nextColor);
    array.push(newContact);
    postNewContact('contact', newContact);
}

/**
 * Validates input fields to ensure they are not empty.
 * @param {string} email - The email input value.
 * @param {string} name - The name input value.
 * @param {string} tel - The telephone input value.
 * @returns {boolean} Returns `true` if all inputs are filled, otherwise `false`.
 */
function validateInputs(email, name, tel) {
    return email !== "" && name !== "" && tel !== "";
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
async function postNewContact(path, newContact) {
    try {
        let response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newContact)
        });
        if (response.ok) {
            console.log('Contact saved successfully');
            saveColorIndex();
            openClosePopUp('close');

            await loadData();
        } else {
            console.error('Failed to save contact');
        }
    } catch (error) {
        console.error('Error:', error);
    }
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
    let asTexthighlightKey = localStorage.getItem('highlightKey');
    if (!asTexthighlightKey) {
        return;
    }
    highlightKey = JSON.parse(asTexthighlightKey);
    keyForEdit = searchNameInMaterialArray();
    if (keyForEdit) {
        renderDetailedContact(keyForEdit);
        localStorage.clear();
        scrollToNewDiv();
    } else {
    }
}

/**
 * Searches for a name in the material array.
 * @returns {string} - The key of the found contact.
 */
function searchNameInMaterialArray() {
    if (!material || !material.length || !material[0]) {
        return null;
    }
    let nameData = material[0];
    for (const key in nameData) {
        if (nameData[key].name === highlightKey['name']) {
            return key;
        }
    }
    return null;
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
 * Retrieves the existing contact data from the server.
 * 
 * @param {string} contactId - The ID of the contact to retrieve.
 * @returns {Promise<Object>} The existing contact data.
 * @throws {Error} Throws an error if the fetch request fails.
 */
async function getExistingContact(contactId) {
    let response = await fetch(`${BASE_URL}contact/${contactId}.json`);
    if (!response.ok) {
        throw new Error('Error fetching the existing contact');
    }
    return await response.json();
}

/**
 * Updates the contact data on the server.
 * 
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} contactData - The updated contact data.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} Throws an error if the update request fails.
 */
async function updateContactData(contactId, contactData) {
    openClosePopUp('close');
    await putData(`contact/${contactId}`, contactData);
}

/**
 * Updates the contact with new details, including error handling and UI updates.
 * Prevents the page from reloading and closes the popup only if all inputs are valid.
 * 
 * @param {Event} event - The event object that triggered the form submission.
 * @returns {Promise<void>}
 */
async function UpdateContact(event) {
    event.preventDefault();
    let email = document.getElementById('editEmail').value.trim();
    let name = document.getElementById('editName').value.trim();
    let tel = document.getElementById('editTel').value.trim();
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/;
    const threeSameLettersPattern = /(.)\1\1/;

    if (!name.match(namePattern) || name.length < 3 || threeSameLettersPattern.test(name.trim()) || name.trim().length === 0) {
        showNotification("Ungültiger Name. Der Name muss mindestens 3 Zeichen lang sein, darf keine drei gleichen Buchstaben in Folge haben und nicht nur aus Leerzeichen bestehen.");
        return; 
    }
    if (email === "" || !validateEmail(email)) {
        showNotification("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;  
    }
    const phonePattern = /^\d{6,15}$/;
    const fourSameDigitsPattern = /(.)\1\1\1/;

    if (!tel.match(phonePattern) || fourSameDigitsPattern.test(tel)) {
        showNotification("Die Telefonnummer muss zwischen 6 und 15 Ziffern lang sein und darf keine vier gleichen Ziffern in Folge haben.");
        return; 
    }
    if (!keyForEdit) {
        return;
    }
    try {
        let existingContact = await getExistingContact(keyForEdit);
        let updatedContact = {
            email: email,
            name: name,
            telefonnummer: tel,
            color: existingContact.color
        };
        await updateContactData(keyForEdit, updatedContact);
        await loadData();
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Kontakts:', error.message);
    }
}

/**
 * Validates the email format using a regular expression.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} Returns true if the email format is valid, false otherwise.
 */
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Displays a notification indicating a duplicate contact.
 * 
 * @returns {void}
 */
function showDuplicateNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = 'This contact already exists!';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
 * Opens the edit popup and pre-fills the form with contact details.
 * 
 * @param {Object} contact - The contact object containing name, email, and phone details.
 */
function openEditPopup(contact) {
    openClosePopUp('open', true);
    document.getElementById('editName').value = contact.name;
    document.getElementById('editEmail').value = contact.email;
    document.getElementById('editTel').value = contact.telefonnummer;
}

function openContactEdit(contactId) {
    const contact = getContactById(contactId);
    openEditPopup(contact);
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
        openClosePopUp('close', key = true);
        await loadData();
        newContactBgHighlight();
    } catch (error) {
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

/**
  * Toggles the visibility of the mini actions menu for editing and deleting contacts.
  * 
  * @param {HTMLElement} element - The element triggering the toggle.
  */
function toggleMiniReg() {
    const miniReg = document.getElementById('miniReg');
    const editContact = document.getElementById('editContact');

    if (miniReg.classList.contains('show')) {
        miniReg.classList.remove('show');
        editContact.style.display = 'block'; // Reset editContact display
    } else {
        miniReg.classList.add('show');
        editContact.style.display = 'none'; // Hide editContact
    }
    document.addEventListener('click', handleClickOutside);
}

/**
 * Closes the mini actions menu if the user clicks outside of it.
 * @param {Event} event - The click event.
 */
function handleClickOutside(event) {
    const miniReg = document.getElementById('miniReg');
    const editContact = document.getElementById('editContact');

    if (!miniReg.contains(event.target) && !editContact.contains(event.target)) {
        miniReg.classList.remove('show');
        editContact.style.display = 'block';
    }
}




