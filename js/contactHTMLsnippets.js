/**
 * Generates the HTML for displaying detailed contact information, including options to edit or delete the contact.
 * 
 * @param {Object} source - The source object containing contact details.
 * @param {string} contactId - The unique identifier for the contact.
 * @returns {string} The HTML string for the detailed contact view.
 */
function detailedContactHtml(source, contactId) {
    return `
        <div class="contact-profile">
            <div id="singleLetterProfile" class="single-letter">${source['name'][0]}</div>
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
    return `
        <div onclick="renderDetailedContact('${contact.id}')" id="${contact.id}" class="contactCard">
             <div id="letter${contact.id}" class="single_letter" style="background-color: ${contactColor};">${contact.name[0]}</div>
             <div class="fullName-email">
               <span>${contact.name}</span>
               <a class="email" href="#">${contact.email}</a>
             </div>
        </div>
    `;
}