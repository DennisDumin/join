/**
 * An array that stores the contacts selected by the user.
 * @type {Array<Object>}
 */
let selectedContacts = [];

/**
 * An array that stores the contacts available for searching.
 * @type {Array<Object>}
 */
let contactsSearch = [];

/**
 * Renders the list of contacts inside the specified container.
 * Each contact is displayed with its name, initials, and color.
 * @function renderContacts
 * @param {string} contactContainer - The ID of the HTML container element where the contacts will be rendered.
 * @returns {void}
 */
function renderContacts(contactContainer) {
    let container = document.getElementById(`${contactContainer}`);
    container.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]['name'];
        let initials = getInitials(name);
        let color = contacts[i]['color'];
        container.innerHTML += templateContact(i, name, initials, color);
        if (contacts[i]['selected'] === true) {
            document.getElementById(`contact-container${i}`).classList.add('contact-container-focus');
        } else {
            document.getElementById(`contact-container${i}`).classList.remove('contact-container-focus');
        }
    }
}

/**
 * Displays the initials of the logged-in user based on the username stored in session storage.
 * If no username is found, it defaults to "G".
 * @function displayUserInitials
 * @returns {void}
 */
function displayUserInitials() {
    let username = sessionStorage.getItem('loggedInUser');
    let userInitials = document.getElementById('userInitials');

    if (username) {
        let initials = username.charAt(0).toUpperCase();
        userInitials.innerText = initials;
    } else {
        userInitials.innerText = "G";
    }
}

/**
 * Opens the contacts dropdown and hides the selected contacts.
 * Adds an event listener to close the dropdown when clicking outside.
 * @function openContacts
 * @returns {void}
 */
function openContacts() {
    let container = document.getElementById('input-section-element');
    let contacts = document.getElementById('add-task-contacts-container');
    let img = document.getElementById('dropdown-img-contacts');

    window.addEventListener('click', function (e) {
        if (container.contains(e.target)) {
            openDropdown(contacts, img);
            hideSelectedContacts();
        } else {
            closeDropdown(contacts, img);
            showSelectedContacts();
        }
    });
}

/**
 * Toggles the contacts dropdown on and off, hiding or showing the selected contacts.
 * Prevents the event from propagating further.
 * @function openCloseContacts
 * @param {Event} event - The event object from the click action.
 * @returns {void}
 */
function openCloseContacts(event) {
    event.stopPropagation();
    let container = document.getElementById('add-task-contacts-container');
    let img = document.getElementById('dropdown-img-contacts');
    if (container.classList.contains('d-none')) {
        openDropdown(container, img);
        hideSelectedContacts();
    } else {
        closeDropdown(container, img);
        showSelectedContacts();
    }
}

/**
 * Selects or deselects a contact and updates the selected contacts list.
 * If the contact is already selected, it is removed from the selected contacts array.
 * If the contact is not selected, it is added to the array.
 * @function selectContact
 * @param {number} i - The index of the contact in the contacts array.
 * @returns {void}
 */
function selectContact(i) {
    if (i >= 0 && i < contacts.length) {
        let container = document.getElementById(`contact-container${i}`);
        let contactName = contacts[i]['name'];
        let contactColor = contacts[i]['color'];
        let indexSelected = selectedContacts.findIndex(contact => contact.name === contactName);

        if (contacts[i]['selected']) {
            selectedContacts.splice(indexSelected, 1);
            contacts[i]['selected'] = false;
            container.classList.remove('contact-container-focus');
        } else {
            selectedContacts.push({ 'name': contactName, 'color': contactColor, 'selected': true });
            contacts[i]['selected'] = true;
            container.classList.add('contact-container-focus');
        }
    } else {
        console.error(`Invalid index ${i} for contacts array`);
    }
}

/**
 * Displays the selected contacts in a separate container.
 * Shows the selected contacts by their initials with corresponding colors.
 * @function showSelectedContacts
 * @returns {void}
 */
function showSelectedContacts() {
    let container = document.getElementById('selected-contacts');
    container.classList.remove('d-none');
    container.innerHTML = '';

    let maxVisibleContacts = 3;
    let numSelectedContacts = selectedContacts.length;
    for (let i = 0; i < Math.min(maxVisibleContacts, numSelectedContacts); i++) {
        let contact = selectedContacts[i];
        let name = contact['name'];
        let initials = getInitials(name);
        let color = contact['color'];
        container.innerHTML += `
        <span style="background-color: ${color}" class="circle-name">${initials}</span>
        `;
    }
    if (numSelectedContacts > maxVisibleContacts) {
        let additionalContacts = numSelectedContacts - maxVisibleContacts;
        container.innerHTML += `
        <span style="background-color: #2a3647; color: white;" class="circle-name">+${additionalContacts}</span>
        `;
    }
}

/**
 * Hides the container that displays the selected contacts.
 * @function hideSelectedContacts
 * @returns {void}
 */
function hideSelectedContacts() {
    let container = document.getElementById('selected-contacts');
    container.classList.add('d-none');
}

/**
 * Searches for contacts based on the user's input in the search bar.
 * Filters the contacts array and displays matching contacts.
 * If the search bar is empty, it renders the full contacts list.
 * @function searchContacts
 * @returns {void}
 */
function searchContacts() {
    let search = document.getElementById('add-task-assigned').value.toLowerCase();
    contactsSearch = [];
    if (search.length > 0) {
        for (let i = 0; i < contacts.length; i++) {
            findContacts(i, search);
        }
        showContactResults();
    } else {
        renderContacts('add-task-contacts-container');
    }
}

/**
 * Finds contacts that match the search query and adds them to the contactsSearch array.
 * @function findContacts
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} search - The search query entered by the user.
 * @returns {void}
 */
function findContacts(i, search) {
    let contactName = contacts[i]['name'];
    let contactSelected = contacts[i]['selected'];
    let contactColor = contacts[i]['color'];
    if (contactName.toLowerCase().includes(search)) {
        contactsSearch.push({ 'name': contactName, 'color': contactColor, 'selected': contactSelected });
    }
}

/**
 * Displays the search results for contacts by rendering them in the contact container.
 * Highlights selected contacts in the results.
 * @function showContactResults
 * @returns {void}
 */
function showContactResults() {
    let container = document.getElementById('add-task-contacts-container');
    container.innerHTML = '';
    for (let i = 0; i < contactsSearch.length; i++) {
        const contact = contactsSearch[i];
        let name = contact['name'];
        let initials = getInitials(name); // from contacts.js
        let color = contact['color'];
        container.innerHTML += templateContactSearch(i, name, initials, color);
        if (contact['selected'] === true) {
            document.getElementById(`contact-container${i}`).classList.add('contact-container-focus');
        } else {
            document.getElementById(`contact-container${i}`).classList.remove('contact-container-focus');
        }
    }
}

/**
 * Toggles the selection of a contact in the search results.
 * Adds or removes the contact from the selected contacts list.
 * @function selectContactSearch
 * @param {number} i - The index of the contact in the contactsSearch array.
 * @returns {void}
 */
function selectContactSearch(i) {
    let contactSelected = contactsSearch[i]['selected'];
    if (contactSelected === true) {
        removeContactSearch(i);
    } else {
        addContactSearch(i);
    }
}

/**
 * Adds a contact from the search results to the selected contacts list.
 * Updates the contacts and contactsSearch arrays to reflect the selection.
 * @function addContactSearch
 * @param {number} i - The index of the contact in the contactsSearch array.
 * @returns {void}
 */
function addContactSearch(i) {
    let container = document.getElementById(`contact-container${i}`);
    let contactName = contactsSearch[i]['name'];
    let contactColor = contactsSearch[i]['color'];
    let index = contacts.findIndex(contact => contact.name === contactName);
    selectedContacts.push({ 'name': contactName, 'color': contactColor, 'selected': true });
    contacts.splice(index, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
    contactsSearch.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
    container.classList.add('contact-container-focus');
}

/**
 * Removes a contact from the selected contacts list based on the search results.
 * Updates the contacts and contactsSearch arrays to reflect the deselection.
 * @function removeContactSearch
 * @param {number} i - The index of the contact in the contactsSearch array.
 * @returns {void}
 */
function removeContactSearch(i) {
    let container = document.getElementById(`contact-container${i}`);
    let contactName = contactsSearch[i]['name'];
    let contactColor = contactsSearch[i]['color'];
    let index = contacts.findIndex(contact => contact.name === contactName);
    let indexSelected = selectedContacts.findIndex(contact => contact.name === contactName);
    selectedContacts.splice(indexSelected, 1);
    contacts.splice(index, 1, { 'name': contactName, 'color': contactColor, 'selected': false });
    contactsSearch.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
    container.classList.remove('contact-container-focus');
} 