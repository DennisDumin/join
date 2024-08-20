/**
 * Generates the HTML for displaying detailed contact information, including options to edit or delete the contact.
 * 
 * @param {Object} source - The source object containing contact details.
 * @param {string} contactId - The unique identifier for the contact.
 * @returns {string} The HTML string for the detailed contact view.
 */
function detailedContactHtml(source, contactId) {
    const nameParts = source['name'].split(' ');
    const initials = nameParts.length > 1 
        ? nameParts[0][0] + nameParts[1][0] 
        : nameParts[0][0];
    return `
        <div class="contact-profile">
            <div id="singleLetterProfile" class="single-letter">${initials}</div>
            <div id="editDelete" class="h4_edit-delete">
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
        <!-- Mini action buttons for editing and deleting -->
      <div class="edit_contact" id="editContact" onclick="toggleMiniReg()" >
        <img class="hoverr" src="contact-assets/img/mobileEditBtn.png" alt="">
        <div class="miniReg" id="miniReg">
            <img class="edit_hoverr" src="contact-assets/img/mini_edit.png" onclick="openClosePopUp('open', true)" alt="">
            <img class="delete_hoverr" src="contact-assets/img/mini_delete.png" onclick="deleteContact('contact', '${contactId}')" alt="">
        </div>          
      </div>
    `;
}

/**
 * Generates the HTML for rendering a contact in the contact list.
 * 
 * @param {string} contactColor - The background color for the contact's initial.
 * @param {Object} contact - The contact object containing name, email, and id.
 * @returns {string} The HTML string for displaying the contact in the list.
 */
function renderContactHtml(contactColor, contact) {
    const nameParts = contact.name.split(' ');
    const initials = nameParts.length > 1 
        ? nameParts[0][0] + nameParts[1][0] 
        : nameParts[0][0];
    return `
        <div onclick="renderDetailedContact('${contact.id}')" id="${contact.id}" class="contactCard">
            <div id="letter${contact.id}" class="single_letter" style="background-color: ${contactColor};">${initials}</div>
            <div class="fullName-email">
                <span>${contact.name}</span>
                <a class="email" href="#">${contact.email}</a>
            </div>
        </div>
    `;
}