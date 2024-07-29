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
    } else if (window.innerWidth < 800) {
        document.getElementById('desktopAddContactBtn').classList.add('displayNone')
        document.getElementById('return_mobilePopUp').classList.remove('displayNone');
        document.getElementById('return_editMobilePopUp').classList.remove('displayNone');
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
    }
}

function changeMobileButton() {

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

