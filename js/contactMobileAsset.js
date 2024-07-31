
function checkUserMaxWidth() {
    const mobileWidth = 800;

    if (window.matchMedia(`(max-width: ${mobileWidth}px)`).matches) {
        contactViewed = true;
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
        document.getElementById('contactList').classList.add('displayNone');
        document.getElementById('contentSection').classList.remove('dNone');
    }
}

window.addEventListener('resize', hideMobileAssets)

function hideMobileAssets() {
    checkIfContactViewed()

    if (window.innerWidth > 800) {
        document.getElementById('desktopAddContactBtn').classList.remove('displayNone')
        document.getElementById('mobileContactReturn').classList.add('displayNone');
        document.getElementById('return_mobilePopUp').classList.add('displayNone');
        document.getElementById('return_editMobilePopUp').classList.add('displayNone');
        changeMobileButton('add');
    } else if (window.innerWidth < 800) {
        changeMobileButton('remove');
        document.getElementById('desktopAddContactBtn').classList.add('displayNone')
        document.getElementById('return_mobilePopUp').classList.remove('displayNone');
        document.getElementById('return_editMobilePopUp').classList.remove('displayNone');
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
    }
}

function changeMobileButton(param) {
    if(param === 'add') {
        document.getElementById('mobileAddContact').classList.add('displayNone');
        document.getElementById('mobileEditBtn').classList.add('displayNone');
    } else if (param === 'remove') {
        document.getElementById('mobileAddContact').classList.remove('displayNone');
        document.getElementById('mobileEditBtn').classList.remove('displayNone');
    }
}

function checkIfContactViewed() {
    if (contactViewed === true) {
         if (window.innerWidth > 800) {
            document.getElementById('contactList').classList.remove('displayNone');
        } if (window.innerWidth < 800) {
            document.getElementById('contactList').classList.add('displayNone');
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const img = document.getElementById('mobileAddContactImg');
    if (img) {
        const originalSrc = img.src; // Das ursprüngliche src speichern
        const hoverSrc = 'contact-assets/img/mobileAddContactHover.png'; // Cache-Busting

        img.addEventListener('mouseover', () => {
            img.src = hoverSrc;
        });

        img.addEventListener('mouseout', () => {
            img.src = originalSrc;
        });
    } 
});


document.addEventListener('DOMContentLoaded', (event) => {
    const img2 = document.getElementById('mobileEditBtnImg');
    if (img2) {
        const originalSrc = img2.src; // Das ursprüngliche src speichern
        const hoverSrc = 'contact-assets/img/mobileEditHover.png'; // Cache-Busting

        img2.addEventListener('mouseover', () => {
            img2.src = hoverSrc;
        });

        img2.addEventListener('mouseout', () => {
            img2.src = originalSrc;
        });
    } 
});


