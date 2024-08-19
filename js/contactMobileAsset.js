/**
 * Checks if the window width is less than or equal to the mobile width (800px)
 * and performs specific actions if it is.
 */
function checkUserMaxWidth() {
    const mobileWidth = 800;

    // If the viewport width is less than or equal to mobileWidth, perform the following actions.
    if (window.matchMedia(`(max-width: ${mobileWidth}px)`).matches) {
        contactViewed = true; // Set a flag indicating the contact view has been seen.
        document.getElementById('mobileContactReturn').classList.remove('displayNone'); // Show the mobile contact return element.
        document.getElementById('contactList').classList.add('displayNone'); // Hide the contact list element.
        document.getElementById('contentSection').classList.remove('dNone'); // Show the content section element.
    }
}

/**
 * Adds an event listener to the window that triggers on resize and calls the hideMobileAssets function.
 */
window.addEventListener('resize', hideMobileAssets)

/**
 * Hides or shows mobile assets based on the window width.
 */
function hideMobileAssets() {
    checkIfContactViewed(); // Check if the contact view has been seen.

    // If the viewport width is greater than 800px, perform the following actions.
    if (window.innerWidth > 800) {
        document.getElementById('desktopAddContactBtn').classList.remove('displayNone'); // Show the desktop add contact button.
        document.getElementById('mobileContactReturn').classList.add('displayNone'); // Hide the mobile contact return element.
        document.getElementById('return_mobilePopUp').classList.add('displayNone'); // Hide the return mobile pop-up element.
        document.getElementById('return_editMobilePopUp').classList.add('displayNone'); // Hide the return edit mobile pop-up element.
        changeMobileButton('add'); // Change the mobile button to the 'add' state.
    } else if (window.innerWidth < 800) { // If the viewport width is less than 800px, perform the following actions.
        changeMobileButton('remove'); // Change the mobile button to the 'remove' state.
        document.getElementById('desktopAddContactBtn').classList.add('displayNone'); // Hide the desktop add contact button.
        document.getElementById('return_mobilePopUp').classList.remove('displayNone'); // Show the return mobile pop-up element.
        document.getElementById('return_editMobilePopUp').classList.remove('displayNone'); // Show the return edit mobile pop-up element.
        document.getElementById('mobileContactReturn').classList.remove('displayNone'); // Show the mobile contact return element.
    }
}

/**
 * Changes the mobile button state based on the parameter.
 *
 * @param {string} param - The state to change the mobile button to ('add' or 'remove').
 */
function changeMobileButton(param) {
    if (param === 'add') { // If the parameter is 'add', perform the following actions.
        document.getElementById('mobileAddContact').classList.add('displayNone'); // Hide the mobile add contact button.
    } else if (param === 'remove') { // If the parameter is 'remove', perform the following actions.
        document.getElementById('mobileAddContact').classList.remove('displayNone'); // Show the mobile add contact button.
    }
}

/**
 * Checks if the contact view has been seen and adjusts the contact list visibility accordingly.
 */
function checkIfContactViewed() {
    if (contactViewed === true) { // If the contact view has been seen, perform the following actions.
        if (window.innerWidth > 800) { // If the viewport width is greater than 800px, show the contact list.
            document.getElementById('contactList').classList.remove('displayNone');
        } if (window.innerWidth < 800) { // If the viewport width is less than 800px, hide the contact list.
            document.getElementById('contactList').classList.add('displayNone');
        }
    }
}

/**
 * Adds event listeners that trigger when the DOM content is fully loaded and handle image hover effects.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    // Get the element with the ID 'mobileAddContactImg'.
    const img = document.getElementById('mobileAddContactImg');
    if (img) { // If the element exists, perform the following actions.
        const originalSrc = img.src; // Store the original source of the image.
        const hoverSrc = 'contact-assets/img/mobileAddContactHover.png'; // Define the hover source of the image.

        // Add an event listener for mouseover to change the image source to hoverSrc.
        img.addEventListener('mouseover', () => {
            img.src = hoverSrc;
        });

        // Add an event listener for mouseout to revert the image source to originalSrc.
        img.addEventListener('mouseout', () => {
            img.src = originalSrc;
        });
    } 
});

/**
 * Adds event listeners that trigger when the DOM content is fully loaded and handle image hover effects.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    // Get the element with the ID 'mobileEditBtnImg'.
    const img2 = document.getElementById('mobileEditBtnImg');
    if (img2) { // If the element exists, perform the following actions.
        const originalSrc = img2.src; // Store the original source of the image.
        const hoverSrc = 'contact-assets/img/mobileEditHover.png'; // Define the hover source of the image.

        // Add an event listener for mouseover to change the image source to hoverSrc.
        img2.addEventListener('mouseover', () => {
            img2.src = hoverSrc;
        });

        // Add an event listener for mouseout to revert the image source to originalSrc.
        img2.addEventListener('mouseout', () => {
            img2.src = originalSrc;
        });
    } 
});