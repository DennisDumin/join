
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
    } else if (param === 'remove') {
        document.getElementById('mobileAddContact').classList.remove('displayNone');
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

