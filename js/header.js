/**
 * Navigates to the previous page in the browser's history.
 * This function uses the `history.back()` method to go back one step in the browser history.
 * @function goToLastPage
 * @returns {void}
 */
function goToLastPage() {
  history.back();
}

/**
 * Toggles the visibility of the dropdown menu in the header.
 * This function adds or removes the "d-block" class from the dropdown menu container,
 * which controls its display state.
 * @function showDropdownMenu
 * @returns {void}
 */
function showDropdownMenu() {
  document
    .getElementById("container-header-dropdown-menu")
    .classList.toggle("d-block");
}
