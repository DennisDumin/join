function checkUserMaxWidth() {
    const mobileWidth = 800;

    if (window.matchMedia(`(max-width: ${mobileWidth}px)`).matches) {
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
        document.getElementById('contactList').classList.add('displayNone');
        document.getElementById('contentSection').classList.remove('dNone');
    }
}

window.addEventListener('resize', hideMobileAssets)

function hideMobileAssets() {
    if (window.innerWidth > 800) {
        document.getElementById('mobileContactReturn').classList.add('displayNone');
        document.getElementById('return_mobilePopUp').classList.add('displayNone');
        document.getElementById('return_editMobilePopUp').classList.add('displayNone');
    } else if (window.innerWidth < 800) {
        document.getElementById('return_mobilePopUp').classList.remove('displayNone');
        document.getElementById('return_editMobilePopUp').classList.remove('displayNone');
        document.getElementById('mobileContactReturn').classList.remove('displayNone');
    }
}