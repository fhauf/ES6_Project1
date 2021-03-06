/* TO DO:
    REMOVE THIS
*/
 localStorage.clear();

document.addEventListener("DOMContentLoaded", initializePage);
let newUser;
let existingUser;
let firstName;
let lastName;
let emailAddress;
let password;
let dashboard;
let editList;
let userData;
let curActiveListTitle;

// Ensure that our button click event listeners are only set up once
let validateNewUserListener = false;
let validateExistingUserListener = false;
let editToDoListListener = false;
let renameToDoListListener = false;
let addToToDoListListener = false;
let saveToDoListListener = false;

// Set up the Sign Up button click event
const btnSignUp = document.getElementById("signUp");
btnSignUp.addEventListener("click", signUp);

// Set up the Login button click event
const btnLogin = document.getElementById("userLogin");
btnLogin.addEventListener("click", logInUser);

function initializePage() {
    newUser = document.getElementById("newUserDiv");
    newUser.hidden = true;
    existingUser = document.getElementById("loginDiv");
    existingUser.hidden = true;
    dashboard = document.getElementById("dashboard");
    dashboard.hidden = true;
    editList = document.getElementById("editList");
    editList.hidden=true;
}

// Hide welcome screen and display the Sign Up screen
function signUp() {
    const welCome = document.getElementById("welcome");
    welCome.hidden = true;
    newUser.hidden=false;
    
    // No input errors yet
    clearError();
    
    //Set up the new user form Submit event listener
    if (!validateNewUserListener) {
        const newUserSubmit = document.getElementById("signUpForm");
        newUserSubmit.addEventListener("submit", validateNewUser);
        validateNewUserListener = true;
    }
}

// Hide welcome screen and display the Login screen
function logInUser() {
    const welCome = document.getElementById("welcome");
    welCome.hidden = true;
    existingUser.hidden=false;

    // No input errors yet
    clearError();

     //Set up the login user form Submit event listener
     if (!validateExistingUserListener) {
        const loginSubmit = document.getElementById("logInForm");
        loginSubmit.addEventListener("submit", validateExistingUser);
        validateExistingUserListener = true;
     }
}

// Check new user input
function validateNewUser(e) {

    // Prevent the default behaviour which is to redirect to somewhere else
    e.preventDefault();
    const blnValidated = validateInput(true);

    if (blnValidated) {
        // Go to the Dashboard
        loadDashboard();
    }
}

function validateExistingUser(e) {

    // Prevent the default behaviour which is to redirect to somewhere else
    e.preventDefault();
    const blnValidated = validateInput(false);

    if (blnValidated) {
        // Go to the Dashboard
        loadDashboard();
    }
}

function validateInput(blnNewUser) {
    
    if (blnNewUser) {
        firstName = document.getElementById("fName").value;
        if (firstName === "") {
            displayError("A first name is required.");
            return false;
        }
    }

    if (blnNewUser) {
        lastName = document.getElementById("lName").value;
        if (lastName === "") {
            displayError("A last name is required.");
            return false;
        }
    }

    if (blnNewUser) {
        emailAddress = document.getElementById("newEmailAddress").value;
    } else {
        emailAddress = document.getElementById("loginEmailAddress").value;
    }
    if (emailAddress === "") {
        displayError("An email address is required.");
        return false;
    }

    if (blnNewUser) {
        password = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (confirmPassword === "") {
            displayError("Please confirm your new password.");
            return false;
        } else if (password != confirmPassword) {
            displayError("Confirm password does not match. Please try again");
            return false;
        }

    } else {
        password = document.getElementById("loginPassword").value;
    }
    
    if (password === "") {
        displayError("Please enter a password.");
        return false;
    }

    if (blnNewUser) {
        const agreeTerms = document.getElementById("agreeTerms").checked;
        if (!agreeTerms) {
            displayError("You must agree to the Terms of Use.");
            return false;
        }
    }

    // If we got here then the new user input is valid
    // Hide the error message
    clearError();

    if (blnNewUser) { 
        // Save input to local storage, the key is the concatenation of email address and password, and the value is the concatenation of first name, last name, email address, and password
        localStorage.setItem(emailAddress + " " + password, firstName + " " + lastName + " " + emailAddress + " " + password);
    }

    return true;
}

// Display error message if there is one
function displayError(strErrorMessage) {
    let errMsgEl;
    errMsgEl = document.getElementsByClassName("errorMessage");

    for(let i = 0; i < errMsgEl.length; i++) {
        errMsgEl[i].innerText = strErrorMessage;
        errMsgEl[i].hidden=false;
    }
}

function clearError() {
    let errMsgEl;
    errMsgEl = document.getElementsByClassName("errorMessage");

    for(let i = 0; i < errMsgEl.length; i++) {
        errMsgEl[i].innerText = "";
        errMsgEl[i].hidden=true;
    }
}

function loadDashboard() {

    let retrievedStorage;
    // Retrieve stored user info based on concatenation of email address and password
    userData = localStorage.getItem(emailAddress + " " + password);

    if (userData === null) {
        displayError("User was not found");
    } else {
        console.log("In Dashboard for user: " + userData);

        // Display the dashboard
        newUser.hidden = true;
        existingUser.hidden = true;
        dashboard.hidden = false;

        // Retrieve the existing to do list(s) for this user
        retrievedStorage = localStorage.getItem(userData);
        console.log("Retrieved storage for user " + userData);
        console.log(retrievedStorage);

        if (retrievedStorage === null || retrievedStorage === undefined) {
            // No list for this user yet
            console.log("No list created yet for this user");

            const ul = document.getElementById("dashboardList");
            const li = document.createElement('li');
            li.appendChild(document.createTextNode("No To Do lists created yet. Click the button to add one."));
            ul.appendChild(li);

            curActiveListTitle = '';

        } else {
            // One or more lists exist for this user
            console.log("One or more lists exist for this user");

            // Display the list titles in the unordered list
            displayExistingLists(retrievedStorage);
        }

        // Set up the to do list button event handler
        if (!editToDoListListener) {
            const btnNewList = document.getElementById("createToDoList");
            btnNewList.addEventListener("click", editToDoList);
            editToDoListListener = true;
        }
    }
}

function editToDoList() {
    console.log("In editToDoList()");

    dashboard.hidden = true;
    editList.hidden = false;

    // Clear the list display
    document.getElementById("listNameLabel").innerText = "To Do List";
    const ul = document.getElementById("toDoList");
    for(let index=0; index<ul.childNodes.length; index++) {
        console.log("Number of nodes: " + ul.childNodes.length);
        console.log("removing " + ul.childNodes[index].innerText);
        ul.removeChild(ul.childNodes[index]);
    }
    // Why do I have to do this twice to remove the last child node?
    for(let index=0; index<ul.childNodes.length; index++) {
        console.log("Number of nodes: " + ul.childNodes.length);
        console.log("removing " + ul.childNodes[index].innerText);
        ul.removeChild(ul.childNodes[index]);
    }

    if (curActiveListTitle !== '') {
        // Load the current list for editing

    }

    // Set up the list edit button handlers: name/rename the list, add item, check/uncheck item as done, Save
    if (!renameToDoListListener) {
        const renameList = document.getElementById("renameList");
        renameList.addEventListener("click", renameToDoList);
        renameToDoListListener = true;
    }

    if (!addToToDoListListener) {
        const addToList = document.getElementById("addItemToList");
        addToList.addEventListener("click", addToToDoList);
        addToToDoListListener = true;
    }

    if (!saveToDoListListener) {
        const saveList = document.getElementById("saveList");
        // Disable the Save button since there are no changes to save yet
        saveList.disabled = true;
        saveList.addEventListener("click", saveToDoList);
        saveToDoListListener = true;
    }
}

function renameToDoList() {
    console.log("In renameToDoList()");

    const newListName = prompt("Please enter the list name", "To-Do List");
    if (newListName == null || newListName == "") {
        console.log("User cancelled list renaming");
    } else {
        document.getElementById("listNameLabel").innerText = newListName;
        // Enable the Save button
        document.getElementById("saveList").disabled = false;
    }
}

function addToToDoList() {
    console.log("In addToToDoList()");
    const newListItem = prompt("Please enter the new list item");

    if (newListItem == null || newListItem == "") {
        console.log("User cancelled list item addition");
    } else {
        // Create the new list item checkbox
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = false;

        // Create the new list item
        const entry = document.createElement('li');

        // Create the text node and append to the list item
        entry.appendChild(document.createTextNode(newListItem));
        // Append the checkbox to the list item
        entry.appendChild(cb);
        // Append the list item to the list
        document.getElementById("toDoList").appendChild(entry);
        // Enable the Save button
        document.getElementById("saveList").disabled = false;
    }
}

function saveToDoList() {
        
    let curListString = '';
    let curListArray = [];
    let curMasterListString;
    let curMasterListArray = [];
    let trimmedMasterListArray = [];
    let blnNewList;

    console.log("In saveToDoList()");

    // Retrieve stored user info based on concatenation of email address and password
    userData = localStorage.getItem(emailAddress + " " + password);

    // Retrieve the to do list
    const list = document.getElementById("toDoList");

    // create an array of to do list objects
    curListString = traverseList(list);
    console.log('This to do list as a string: ' + curListString);

    curListArray = curListString.split('^');
    console.log('This to do list as an array: ' + curListArray);

    //Retrieve current master list from local storage
    curMasterListString = localStorage.getItem(userData);
    if (curMasterListString !== null) {
        console.log('Master to do list as a string: ' + curMasterListString);
        curMasterListArray = curMasterListString.split('**^');

        console.log("curMasterListArray Step 1:" + curMasterListArray);

        for (let i=0; i<curMasterListArray.length; i++ ) {
            if (i < curMasterListArray.length - 1) {
                trimmedMasterListArray[i] = curMasterListArray[i];
            }
        }

        console.log("trimmedMasterListArray Step 2 " + trimmedMasterListArray);
            
        // Add a '**^' delimiter in between lists and at the end
        for (let i=0; i< trimmedMasterListArray.length; i++) {
            if (i % 2 !== 0) {
                trimmedMasterListArray.splice(i,0,'**^');
                console.log("Step 3: " + trimmedMasterListArray);
            }
        }
        trimmedMasterListArray.push('**^');

        console.log('Master to do list as an array Step 4: ' + trimmedMasterListArray);
    } else {
        curMasterListString = '';
        console.log('Master to do list is empty');
    }
        
    // Append the current list to the master list, first checking whether the current list is already in the master list i.e. we were editing an existing list
    blnNewList = true;
    for (let index = 0; index < trimmedMasterListArray.length; index++) {
        if (trimmedMasterListArray[index].indexOf(curListArray[0]) >= 0) {
            // This list is already in the master list, so update it rather than appending
            console.log("This list is already in the master list, so update rather than append");

            trimmedMasterListArray[index] = '';
            for (let j=0; j < curListArray.length; j++) {
                trimmedMasterListArray[index] += curListArray[j] + ' ';
            }
                 
            blnNewList = false;
            break;
        }
    }

    if (blnNewList === true) {
        console.log("New list to be appended to end of master list");
            
        // Append the current list to the end of the master list
        trimmedMasterListArray.push('');

        for (let j=0;j < curListArray.length; j++) {
            trimmedMasterListArray[trimmedMasterListArray.length - 1] += curListArray[j] + '^';
        }
        // Add a '**^' delimiter to the end
        trimmedMasterListArray.push('**^');
    }

    console.log('Updated master list as an array: ' + trimmedMasterListArray);
        
    // Convert the updated master list to a string
    curMasterListString = '';
    for (let j=0; j < trimmedMasterListArray.length; j++) {
        curMasterListString += trimmedMasterListArray[j];
    }
        
    console.log('Updated master list as a string: ' + curMasterListString);
        
    // Save to local storage, the key is the concatenation of first name, last name, email address, and password, and the value is the master list converted to a string
    localStorage.setItem(userData, curMasterListString);

    // Go Back to the dashboard
    editList.hidden = true;
    loadDashboard();
}

function traverseList(ul) {
    let buildList = '';
    let trimmedBuildList;
    const listTitle = document.getElementById("listNameLabel").innerText;

    for(let index=0;index<ul.childNodes.length;index++) {
        let strListItem = ul.childNodes[index].innerText;
        let blnItemCompleted = ul.childNodes[index].childNodes[1].checked;

        // Each list item contains the list title, the to do item, and the completed flag
        buildList += listTitle + '^' + strListItem + '^' + blnItemCompleted + '^';
        console.log("traverseList() buildList: " + buildList);
    }
    // Remove the last '^'
    trimmedBuildList = buildList.substring(0, buildList.length - 1);
    return trimmedBuildList;
}

function displayExistingLists(storedLists) {
    let curListArray = [];
    let trimmedListArray = [];
    let li;
    let listTitleLink;
    let liText;

    console.log("In displayExistingLists");
        
    // Remove existing dashboard line items
    const ul = document.getElementById("dashboardList");
    console.log("Before removal, Number of line items: " + ul.childNodes.length);

    for(let index=0; index<ul.childNodes.length; index++) {
        console.log("Number of nodes: " + ul.childNodes.length);
        console.log("Removing dashboard list line item: " + ul.childNodes[index].innerText);
        ul.removeChild(ul.childNodes[index]);
    }
    // Why do I have to do this twice to remove the last child node?
    for(let index=0; index<ul.childNodes.length; index++) {
        console.log("Number of nodes: " + ul.childNodes.length);
        console.log("Removing dashboard list line item: " + ul.childNodes[index].innerText);
        ul.removeChild(ul.childNodes[index]);
    }
    
    console.log("After removal, Number of line items: " + ul.childNodes.length);

    // Extract unique list titles from storedLists and add them to the dashboard as list item links
    // storedLists syntax: List Title^to do list item^list item completed^List Title^to do list item^list item completed^...**
    curListArray = storedLists.split('^');

    for (let i=0; i < curListArray.length - 1; i++) {
        trimmedListArray.push(curListArray[i]);
    }

    console.log('To do list as an array: ' + trimmedListArray);

    // Create the first list title line item
    console.log("Adding title line item: " + trimmedListArray[0]);
    li = document.createElement('li');
    //li.appendChild(document.createTextNode(trimmedListArray[0]));
    listTitleLink = document.createElement("LINK");
    listTitleLink.innerText = trimmedListArray[0];
    listTitleLink.addEventListener("click", loadListfromTitle);
    li.appendChild(listTitleLink);
    ul.appendChild(li);
        
    for (let index = 1; index < trimmedListArray.length; index++) {

        if (index === trimmedListArray.length - 1) {
            // We're at the end of the master list
            console.log('At the end of the master list');

        } else if (trimmedListArray[index] === '**') {
            // We're at the end of the current list in the overall master list
            console.log('At the end of the current list in the overall master list');

            // Create the next list title line item
            liText = trimmedListArray[index + 1];
            console.log("Adding title line item: " + liText);
            li = document.createElement('li');
            //li.appendChild(document.createTextNode(liText));
            listTitleLink = document.createElement("LINK");
            listTitleLink.innerText = liText;
            listTitleLink.addEventListener("click", loadListfromTitle);
            li.appendChild(listTitleLink);
            ul.appendChild(li);
        }
    
    }

    //Add edit buttons for each list title that directs to editToDoList(), passing in the list indicated by curActiveListTitle
    //set curActiveListTitle = the list title associated with the edit button that was clicked

}

function loadListfromTitle() {
    console.log("In to do list title link click event handler");
}
