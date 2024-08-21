/**
 * Checks if the window width is less than or equal to the mobile width (800px)
 * and performs specific actions if it is.
 */
function checkUserMaxWidth() {
    const mobileWidth = 800;
    if (window.matchMedia(`(max-width: ${mobileWidth}px)`).matches) {
        contactViewed = true;
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
        document.getElementById('contactList').classList.add('displayNone'); 
        document.getElementById('contentSection').classList.remove('dNone'); 
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
    checkIfContactViewed();

    if (window.innerWidth > 800) {
        document.getElementById('desktopAddContactBtn').classList.remove('displayNone'); 
        document.getElementById('mobileContactReturn').classList.add('displayNone'); 
        document.getElementById('return_mobilePopUp').classList.add('displayNone'); 
        document.getElementById('return_editMobilePopUp').classList.add('displayNone'); 
        changeMobileButton('add');
    } else if (window.innerWidth < 800) { 
        changeMobileButton('remove'); 
        document.getElementById('desktopAddContactBtn').classList.add('displayNone'); 
        document.getElementById('return_mobilePopUp').classList.remove('displayNone'); 
        document.getElementById('return_editMobilePopUp').classList.remove('displayNone'); 
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
    }
}

/**
 * Changes the mobile button state based on the parameter.
 *
 * @param {string} param - The state to change the mobile button to ('add' or 'remove').
 */
function changeMobileButton(param) {
    if (param === 'add') { 
        document.getElementById('mobileAddContact').classList.add('displayNone');
    } else if (param === 'remove') { 
        document.getElementById('mobileAddContact').classList.remove('displayNone');
    }
}

/**
 * Checks if the contact view has been seen and adjusts the contact list visibility accordingly.
 */
function checkIfContactViewed() {
    if (contactViewed === true) { 
        if (window.innerWidth > 800) { 
            document.getElementById('contactList').classList.remove('displayNone');
        } if (window.innerWidth < 800) { 
            document.getElementById('contactList').classList.add('displayNone');
        }
    }
}

/**
 * Adds event listeners that trigger when the DOM content is fully loaded and handle image hover effects.
 */
document.addEventListener('DOMContentLoaded', (event) => {

    const img = document.getElementById('mobileAddContactImg');
    if (img) { 
        const originalSrc = img.src;
        const hoverSrc = 'contact-assets/img/mobileAddContactHover.png'; 

        img.addEventListener('mouseover', () => {
            img.src = hoverSrc;
        });
        img.addEventListener('mouseout', () => {
            img.src = originalSrc;
        });
    } 
});

/**
 * Adds event listeners that trigger when the DOM content is fully loaded and handle image hover effects.
 */
document.addEventListener('DOMContentLoaded', (event) => {
   
    const img2 = document.getElementById('mobileEditBtnImg');
    if (img2) { 
        const originalSrc = img2.src;
        const hoverSrc = 'contact-assets/img/mobileEditHover.png'; 
        img2.addEventListener('mouseover', () => {
            img2.src = hoverSrc;
        });
        img2.addEventListener('mouseout', () => {
            img2.src = originalSrc;
        });
    } 
});