let prioBtn = "";

// addTask.js

async function initTask() {
    await initInclude(); // from include.js
    displayUserInitials(); // from summary.js
    addTaskBgMenu();
    await loadTasks(); // from storage.js
    renderContacts('add-task-contacts-container');
    chooseMedium();
}

function chooseMedium() {
    let button = document.getElementById('medium-button')
    button.classList.add('medium-button-focus');
}

function hideRequiredInfo(borderId, textId) {
    let border = document.getElementById(`${borderId}`);
    let text = document.getElementById(`${textId}`);
    border.classList.remove('empty');
    text.classList.add('transparent');
}

function hideRequiredCategory() {
    document.getElementById('add-task-category').classList.remove('empty');
}

function openDropdown(container, img) {
    container.classList.remove('d-none');
    img.classList.add('dropdown-img-rotated');
}

function closeDropdown(container, img) {
    container.classList.add('d-none');
    img.classList.remove('dropdown-img-rotated');
}

function selectUrgent() {
    let button = document.getElementById('urgent-button');

    if (button.classList.contains('urgent-button-focus')) {
        button.classList.remove('urgent-button-focus');
    } else {
        button.classList.add('urgent-button-focus');
        document.getElementById('medium-button').classList.remove('medium-button-focus');
        document.getElementById('low-button').classList.remove('low-button-focus');
    }
}

function selectMedium() {
    let button = document.getElementById('medium-button');

    if (button.classList.contains('medium-button-focus')) {
        button.classList.remove('medium-button-focus');
    } else {
        button.classList.add('medium-button-focus');
        document.getElementById('urgent-button').classList.remove('urgent-button-focus');
        document.getElementById('low-button').classList.remove('low-button-focus');
    }
}

function selectLow() {
    let button = document.getElementById('low-button');

    if (button.classList.contains('low-button-focus')) {
        button.classList.remove('low-button-focus');
    } else {
        button.classList.add('low-button-focus');
        document.getElementById('urgent-button').classList.remove('urgent-button-focus');
        document.getElementById('medium-button').classList.remove('medium-button-focus');
    }
}

function openCategories(event) {
    event.stopPropagation();
    hideRequiredCategory();
    let container = document.getElementById('add-task-category-container');
    let img = document.getElementById('dropdown-img-category');
    if (container.classList.contains('d-none')) {
        openDropdown(container, img);
    } else {
        closeDropdown(container, img);
    }
    let selectedCategory = document.getElementById('select-task-text');
    selectedCategory.innerHTML = `Select task category`;
}

function openCategoriesWindow() {
    let container = document.getElementById('add-task-category');
    let categories = document.getElementById('add-task-category-container');
    let img = document.getElementById('dropdown-img-category');

    window.addEventListener('click', function (e) {
        if (container.contains(e.target)) {
            openDropdown(categories, img);
        } else {
            closeDropdown(categories, img);
        }
    });
}

function selectCategory(categoryId) {
    let container = document.getElementById('add-task-category-container');
    let img = document.getElementById('dropdown-img-category');
    let categoryElement = document.getElementById(categoryId);

    if (categoryElement) {
        let category = categoryElement.innerHTML;
        let selectedCategory = document.getElementById('select-task-text');
        selectedCategory.innerHTML = category;
        closeDropdown(container, img);
    } else {
        console.error(`Element with ID ${categoryId} not found`);
    }
}

async function createTask() {
    let title = document.getElementById('task-title').value;
    let date = document.getElementById('task-date').value;
    let category = document.getElementById('select-task-text').innerHTML;

    if (title !== '' && date !== '' && category !== `Select task category`) {
        document.getElementById('create-task-button').disabled = true;
        getValues();
        await saveTask();
        showTaskAdded();
        setTimeout(() => {
            redirectToBoard();
        }, 2000);
        clearAddTask();
    } else {
        checkInput(title, date, category);
    }
}

function getValues() {
    let title = document.getElementById('task-title').value;
    let description = document.getElementById('add-task-description').value;
    if (description === '') { description = '' };
    let date = document.getElementById('task-date').value;
    let prio = getPrio();
    let category = document.getElementById('select-task-text').innerHTML;
    pushTaskElements(title, description, date, prio, category, prioBtn);
}

function getPrio() {
    if (document.getElementById('urgent-button').classList.contains('urgent-button-focus')) {
        prio = 'Urgent'
        prioBtn = './assets/img/icon_PrioAltaRed.svg'
    } else if (document.getElementById('medium-button').classList.contains('medium-button-focus')) {
        prio = 'Medium'
        prioBtn = './assets/img/icon_PrioMediaOrange.svg'
    } else if (document.getElementById('low-button').classList.contains('low-button-focus')) {
        prio = 'Low'
        prioBtn = './assets/img/icon_PrioBajaGreen.svg'
    } else {
        prio = ''
    }
    return prio
}

function pushTaskElements(title, description, date, prio, category, prioBtn) {
    if (selectedContacts.length < 1) { selectedContacts = '' };
    if (subtasks.length < 1) { subtasks = '' };
    let currentId = tasks.length;
    tasks.push({
        'title': title,
        'description': description,
        'contacts': selectedContacts,
        'date': date,
        'prio': prio,
        'category': category,
        'subtasks': subtasks,
        'phases': 'To Do',
        'ID': currentId++,
        'prioIcon': prioBtn
    })
}

async function saveTask() {
    if (tasks === '') {
        tasks.push({
            'ID': 0,
        })
        await postData("/tasks", tasks) // from storage.js
    } else {
        await putData("/tasks", tasks) // from storage.js
    }
}


function showTaskAdded() {
    document.getElementById('added-container').classList.remove('d-none');
}

function checkInput(title, date, category) {
    checkTitle(title);
    checkDate(date);
    checkCategory(category);
}

function checkTitle(title) {
    if (title === '') {
        document.getElementById('add-task-title').classList.add('empty');
        document.getElementById('required-title').classList.remove('transparent');
    }
}

function checkDate(date) {
    if (date === '') {
        document.getElementById('add-task-due-date').classList.add('empty');
        document.getElementById('required-date').classList.remove('transparent');
    }
}

function checkCategory(category) {
    if (category === `Select task category`) {
        document.getElementById('add-task-category').classList.add('empty');
    }
}

async function clearAddTask() {
    hideRequiredInfo('add-task-title', 'required-title');
    hideRequiredInfo('add-task-due-date', 'required-date');
    hideRequiredCategory();
    deletePrio();
    emptyInput();
    selectedContacts = [];
    subtasks = [];
    contacts = [];
    renderContacts('add-task-contacts-container');
}

function deletePrio() {
    document.getElementById('urgent-button').classList.remove('urgent-button-focus');
    document.getElementById('medium-button').classList.remove('medium-button-focus');
    document.getElementById('low-button').classList.remove('low-button-focus');
}

function emptyInput() {
    document.getElementById('task-title').value = '';
    document.getElementById('add-task-description').value = '';
    document.getElementById('add-task-assigned').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('select-task-text').innerHTML = `Select task category`;
    document.getElementById('add-task-subtasks').value = '';
    document.getElementById('subtasks-list').innerHTML = '';
}