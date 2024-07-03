let selectedContacts = [];
let contactsSearch = [];

function renderContacts(contactContainer) {
    let container = document.getElementById(`${contactContainer}`);
    container.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]['name'];
        let initials = getInitials(name); // from contacts.js
        let color = contacts[i]['color'];
        container.innerHTML += templateContact(i, name, initials, color);
        if (contacts[i]['selected'] === true) {
            document.getElementById(`contact-container${i}`).classList.add('contact-container-focus');
        } else {
            document.getElementById(`contact-container${i}`).classList.remove('contact-container-focus');
        }
    }
}

function templateContact(i, name, initials, color) {
    return `
    <div id="contact-container${i}" onclick="selectContact(${i})" class="contact-container" tabindex="1">
        <div class="contact-container-name">
            <span style="background-color: ${color}" id="contactInitals${i}" class="circle-name">${initials}</span>
            <span id="contactName${i}">${name}</span>
        </div>
        <div class="contact-container-check"></div>
    </div> 
`;
}

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
};

function selectContact(i) {
    // Überprüfen, ob der Index i gültig ist
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


function showSelectedContacts() {
    let container = document.getElementById('selected-contacts');
    container.classList.remove('d-none');
    container.innerHTML = '';
    for (let i = 0; i < selectedContacts.length; i++) {
        let contact = selectedContacts[i];
        let name = contact['name'];
        let initials = getInitials(name); // from contacts.js
        let color = selectedContacts[i]['color'];
        container.innerHTML += `
        <span style="background-color: ${color}" class="circle-name">${initials}</span>
        `;
    }
}

function hideSelectedContacts() {
    let container = document.getElementById('selected-contacts');
    container.classList.add('d-none');
}

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

function findContacts(i, search) {
    let contactName = contacts[i]['name'];
    let contactSelected = contacts[i]['selected'];
    let contactColor = contacts[i]['color'];
    if (contactName.toLowerCase().includes(search)) {
        contactsSearch.push({ 'name': contactName, 'color': contactColor, 'selected': contactSelected });
    }
}

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

function templateContactSearch(i, name, initials, color) {
    return `
    <div id="contact-container${i}" onclick="selectContactSearch(${i})" class="contact-container" tabindex="1">
        <div class="contact-container-name">
            <span style="background-color: ${color}" id="contactInitals${i}" class="circle-name">${initials}</span>
            <span id="contact-name${i}">${name}</span>
        </div>
        <div class="contact-container-check"></div>
    </div> 
`;
}

function selectContactSearch(i) {
    let contactSelected = contactsSearch[i]['selected'];
    if (contactSelected === true) {
        removeContactSearch(i);
    } else {
        addContactSearch(i);
    }
}

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