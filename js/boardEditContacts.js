let selectedEditContacts = [];
let editContactsSearch = [];

/**
 * Opens the edit contacts dropdown and hides selected contacts when clicking outside the dropdown.
 * @function openEditContacts
 * @returns {void}
 */
function openEditContacts() {
  let container = document.getElementById('input-assigned-edit-section');
  let contacts = document.getElementById('add-task-contacts-container-edit');
  let img = document.getElementById('dropdown-img-contacts-edit');

  window.addEventListener('click', function (e) {
    if (container.contains(e.target)) {
      openDropdown(contacts, img);
      hideSelectedEditContacts();
    } else {
      closeDropdown(contacts, img);
      showSelectedEditContacts();
    }
  });
}

/**
 * Toggles the visibility of the edit contacts dropdown and updates the display of selected contacts.
 * @function openCloseEditContacts
 * @param {Event} event - The click event that triggered this function.
 * @returns {void}
 */
function openCloseEditContacts(event) {
  event.stopPropagation();
  let container = document.getElementById('add-task-contacts-container-edit');
  let img = document.getElementById('dropdown-img-contacts-edit');
  if (container.classList.contains('d-none')) {
    openDropdown(container, img);
    hideSelectedEditContacts();
  } else {
    closeDropdown(container, img);
    showSelectedEditContacts();
  }
}

/**
 * Selects or deselects a contact in the edit contact list and updates their state.
 * @function selectEditContact
 * @param {number} i - The index of the contact to select or deselect.
 * @returns {void}
 */
function selectEditContact(i) {
  let container = document.getElementById(`contact-edit-container${i}`);
  let contactName = contacts[i]['name'];
  let contactColor = contacts[i]['color'];
  let indexSelected = selectedEditContacts.findIndex(contact => contact.name === contactName);
  if (contacts[i]['selected'] === true) {
    selectedEditContacts.splice(indexSelected, 1);
    contacts.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': false });
    container.classList.remove('contact-container-edit-focus');
  } else {
    selectedEditContacts.push({ 'name': contactName, 'color': contactColor, 'selected': true });
    contacts.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
    container.classList.add('contact-container-edit-focus');
  }
}

/**
 * Displays the list of selected contacts in the edit contacts section.
 * @function showSelectedEditContacts
 * @returns {void}
 */
function showSelectedEditContacts() {
  let container = document.getElementById('user-content-edit-letter');
  container.classList.remove('d-none');
  container.innerHTML = '';
  for (let i = 0; i < selectedEditContacts.length; i++) {
    let contact = selectedEditContacts[i];
    let name = contact['name'];
    let initials = getInitials(name); // from contact.js
    let color = selectedEditContacts[i]['color'];
    container.innerHTML += `
      <span style="background-color: ${color}" class="circle-name">${initials}</span>
    `;
  }
}

/**
 * Hides the list of selected contacts in the edit contacts section.
 * @function hideSelectedEditContacts
 * @returns {void}
 */
function hideSelectedEditContacts() {
  let container = document.getElementById('selected-contacts-edit');
  container.classList.add('d-none');
}

/**
 * Searches for contacts in the edit contacts list based on the user's input.
 * @function searchEditContacts
 * @returns {void}
 */
function searchEditContacts() {
  let search = document.getElementById('add-task-edit-assigned').value.toLowerCase();
  editContactsSearch = [];
  if (search.length > 0) {
    for (let i = 0; i < contacts.length; i++) {
      findEditContacts(i, search);
    }
    showEditContactResults();
  } else {
    renderEditContacts();
  }
}

/**
 * Finds contacts that match the search query and adds them to the editContactsSearch array.
 * @function findEditContacts
 * @param {number} i - The index of the contact to check.
 * @param {string} search - The search query to match against contact names.
 * @returns {void}
 */
function findEditContacts(i, search) {
  let contactName = contacts[i]['name'];
  let contactSelected = contacts[i]['selected'];
  let contactColor = contacts[i]['color'];
  if (contactName.toLowerCase().includes(search)) {
    editContactsSearch.push({ 'name': contactName, 'color': contactColor, 'selected': contactSelected });
  }
}

/**
 * Displays the search results for contacts in the edit contacts section.
 * @function showEditContactResults
 * @returns {void}
 */
function showEditContactResults() {
  let container = document.getElementById('add-task-contacts-container-edit');
  container.innerHTML = '';
  for (let i = 0; i < editContactsSearch.length; i++) {
    const contact = editContactsSearch[i];
    let name = contact['name'];
    let initials = getInitials(name);
    let color = contact['color'];
    container.innerHTML += templateEditContactSearch(i, name, initials, color);
    if (contact['selected'] === true) {
      document.getElementById(`contact-edit-container${i}`).classList.add('contact-container-edit-focus');
    } else {
      document.getElementById(`contact-edit-container${i}`).classList.remove('contact-container-edit-focus');
    }
  }
}

/**
 * Creates the HTML structure for a contact search result item.
 * @function templateEditContactSearch
 * @param {number} i - The index of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The background color for the contact's initials.
 * @returns {string} The HTML string representing the contact search result item.
 */
function templateEditContactSearch(i, name, initials, color) {
  return `
  <div id="contact-edit-container${i}" onclick="selectEditContactSearch(${i})" class="contact-container" tabindex="1">
    <div class="contact-container-name">
      <span style="background-color: ${color}" id="contact-edit-initals${i}" class="circle-name">${initials}</span>
      <span id="contact-name${i}">${name}</span>
    </div>
    <div class="contact-container-check"></div>
  </div> 
  `;
}

/**
 * Toggles the selection state of a contact in the search results.
 * @function selectEditContactSearch
 * @param {number} i - The index of the contact to toggle.
 * @returns {void}
 */
function selectEditContactSearch(i) {
  let contactSelected = editContactsSearch[i]['selected'];
  if (contactSelected === true) {
    removeEditContactSearch(i);
  } else {
    addEditContactSearch(i);
  }
}

/**
 * Adds a contact from the search results to the selected contacts list and updates their state.
 * @function addEditContactSearch
 * @param {number} i - The index of the contact to add.
 * @returns {void}
 */
function addEditContactSearch(i) {
  let container = document.getElementById(`contact-edit-container${i}`);
  let contactName = editContactsSearch[i]['name'];
  let contactColor = editContactsSearch[i]['color'];
  let index = contacts.findIndex(contact => contact.name === contactName);
  selectedEditContacts.push({ 'name': contactName, 'color': contactColor, 'selected': true });
  contacts.splice(index, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
  editContactsSearch.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
  container.classList.add('contact-container-edit-focus');
}

/**
 * Removes a contact from the search results and updates its state.
 * @function removeEditContactSearch
 * @param {number} i - The index of the contact to remove.
 * @returns {void}
 */
function removeEditContactSearch(i) {
  let container = document.getElementById(`contact-edit-container${i}`);
  let contactName = editContactsSearch[i]['name'];
  let contactColor = editContactsSearch[i]['color'];
  let index = contacts.findIndex(contact => contact.name === contactName);
  let indexSelected = selectedEditContacts.findIndex(contact => contact.name === contactName);
  selectedEditContacts.splice(indexSelected, 1);
  contacts.splice(index, 1, { 'name': contactName, 'color': contactColor, 'selected': false });
  editContactsSearch.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
  container.classList.remove('contact-container-edit-focus');
}