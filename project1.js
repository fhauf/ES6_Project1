document.addEventListener("DOMContentLoaded", initializePage);

// Define global variables
let welcome;
let newUser;
let existingUser;
let btnLogout;
let btnAccountSettings;
let curFirstName = '';
let updatedFirstName;
let curLastName = '';
let updatedLastName;
let curEmailAddress = '';
let updatedEmailAddress;
let curPassword = '';
let updatedPassword;
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
let logoutListener = false;
let accountSettingsListener = false;

// Set up the Sign Up button click event
const btnSignUp = document.getElementById("signUp");
btnSignUp.addEventListener("click", signUp);

// Set up the Login button click event
const btnLogin = document.getElementById("userLogin");
btnLogin.addEventListener("click", logInUser);

function initializePage() {
    welcome = document.getElementById("welcome");
    welcome.hidden = false;
    newUser = document.getElementById("newUserDiv");
    newUser.hidden = true;
    existingUser = document.getElementById("loginDiv");
    existingUser.hidden = true;
    dashboard = document.getElementById("dashboard");
    dashboard.hidden = true;
    editList = document.getElementById("editList");
    editList.hidden=true;
    btnLogout = document.getElementById("logout");
    btnLogout.hidden = true;
    btnAccountSettings = document.getElementById("accountSettings");
    btnAccountSettings.hidden = true;
}

// Hide welcome screen and display the Sign Up screen
function signUp(blnSignUp = true) {
    initializePage();
    welcome.hidden = true;
    
    if (!blnSignUp) {
        // Change the page title from Sign Up to Account Settings
        document.getElementById("signUpTitle").innerText = "Account Settings";
    } else {
        // Keep the page title as Sign Up
        document.getElementById("signUpTitle").innerText = "Sign Up";

        // Clear any existing values
        document.getElementById("fName").value = "";
        document.getElementById("lName").value = "";
        document.getElementById("newEmailAddress").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
        document.getElementById("agreeTerms").checked = false;
    }
    
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
    welcome.hidden = true;
    existingUser.hidden=false;
    document.getElementById("loginEmailAddress").value = "";
    document.getElementById("loginPassword").value = "";

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

        // Update this user's master list credentials


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

    updatedFirstName = '';
    updatedLastName = '';
    updatedEmailAddress = '';
    updatedPassword = '';
    
    if (blnNewUser) {
        if (curFirstName === '') {
            curFirstName = document.getElementById("fName").value;
            if (curFirstName === "") {
                displayError("A first name is required.");
                return false;
            }
        } else {
            updatedFirstName = document.getElementById("fName").value;
            if (updatedFirstName === "") {
                displayError("A first name is required.");
                return false;
            }
        }
    }

    if (blnNewUser) {
        if (curLastName === '') {
            curLastName = document.getElementById("lName").value;
            if (curLastName === "") {
                displayError("A last name is required.");
                return false;
            }
        } else {
            updatedLastName = document.getElementById("lName").value;
            if (updatedLastName === "") {
                displayError("A last name is required.");
                return false;
            }
        }
    }

    if (blnNewUser) {
        if (curEmailAddress === '') {
            curEmailAddress = document.getElementById("newEmailAddress").value;
        } else {
            updatedEmailAddress = document.getElementById("newEmailAddress").value;
        }

        if (curEmailAddress === '' && updatedEmailAddress === '') {
            displayError("An email address is required.");
            return false;
        }

    } else {
        curEmailAddress = document.getElementById("loginEmailAddress").value;
    }
    if (curEmailAddress === "") {
        displayError("An email address is required.");
        return false;
    }

    if (blnNewUser) {
        
        if (curPassword === '') {
            curPassword = document.getElementById("newPassword").value;
            let confirmPassword = document.getElementById("confirmPassword").value;

            if (confirmPassword === "") {
                displayError("Please confirm your new password.");
                return false;
            } else if (curPassword != confirmPassword) {
                displayError("Confirm password does not match. Please try again");
                return false;
            }

        } else {
            updatedPassword = document.getElementById("newPassword").value;
            let confirmPassword = document.getElementById("confirmPassword").value;

            if (confirmPassword === "") {
                displayError("Please confirm your new password.");
                return false;
            } else if (updatedPassword != confirmPassword) {
                displayError("Confirm password does not match. Please try again");
                return false;
            }
        }

    } else {
        curPassword = document.getElementById("loginPassword").value;
    }
    
    if (curPassword === "" && updatedPassword === "") {
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
        if (updatedFirstName !== "" || updatedLastName !== "" || updatedEmailAddress !== "" || updatedPassword !== "") {
            // One or more of the user credentials have changed. Retrieve the master list associated with the current user credentials
            userData = localStorage.getItem(curEmailAddress + " " + curPassword);
            let masterToDoListForUser = localStorage.getItem(userData);

            // Update the user credentials
            if (updatedFirstName !== "") {
                curFirstName = updatedFirstName;
                updatedFirstName = "";
            }
            
            if (updatedLastName !== "") {
                curLastName = updatedLastName;
                updatedLastName = "" ;
            }

            if (updatedEmailAddress !== "") {
                curEmailAddress = updatedEmailAddress;
                updatedEmailAddress = "";
            }

            if (updatedPassword != "") {
                curPassword = updatedPassword;
                updatedPassword = "";
            }

            // Save the master list to the updated user credentials
            userData = curFirstName + " " + curLastName + " " + curEmailAddress + " " + curPassword;
            localStorage.setItem(userData, masterToDoListForUser);

        }

        // Save input to local storage, the key is the concatenation of email address and password, and the value is the concatenation of first name, last name, email address, and password
        localStorage.setItem(curEmailAddress + " " + curPassword, curFirstName + " " + curLastName + " " + curEmailAddress + " " + curPassword);
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

function logoutUser() {
    curEmailAddress = '';
    curPassword = '';
    userData = '';

    initializePage();
}

function userAcctSettings() {
    console.log("In Account Settings handler");
    signUp(false);
}

function loadDashboard() {

    let retrievedStorage;
    let ul;
    let li;

    // Retrieve stored user info based on concatenation of email address and password
    userData = localStorage.getItem(curEmailAddress + " " + curPassword);

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

        if (retrievedStorage === "null" || retrievedStorage === null || retrievedStorage === undefined) {
            // No list for this user yet
            console.log("No list created yet for this user");

            // Clear the list display
            ul = document.getElementById("dashboardList");
            li = document.createElement('li');

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

        // Set up the logout button event handler
        if (!logoutListener) {
            console.log("Adding click listener to logout button");
            btnLogout.addEventListener("click", logoutUser);
            logoutListener = true;
        }
        btnLogout.hidden = false;

        // Set up the account settings button event handler
        if (!accountSettingsListener) {
            console.log("Adding click listener to account settings button");
            btnAccountSettings.addEventListener("click", userAcctSettings);
            accountSettingsListener = true;
        }
        btnAccountSettings.hidden = false;
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
        console.log("In editToDoList(), curActiveListTitle = " + curActiveListTitle);

        let trimmedCurActiveListArray = [];

        // Retrieve stored user info based on concatenation of email address and password
        userData = localStorage.getItem(curEmailAddress + " " + curPassword);

        trimmedMasterListArray = getMasterListFromLocalStorage(userData);

        if (trimmedMasterListArray !== undefined) {
            console.log("Curent Master list: " + trimmedMasterListArray);
        }

        for (let index = 0; index < trimmedMasterListArray.length; index++) {
            if (trimmedMasterListArray[index].indexOf(curActiveListTitle) >= 0) {
                // Found the active list in the master list
                // Format is List Title^list item^completed^...
                let curActiveListArray = [];
                curActiveListArray = trimmedMasterListArray[index].split('^');

                for (j = 0; j < curActiveListArray.length - 1; j++) {
                    trimmedCurActiveListArray[j] = curActiveListArray[j];
                }

                console.log('Current active list extracted from the master list and converted to an array: ' + trimmedCurActiveListArray);
                break;
            }
        }

        // Update the list title, add the list items and display
        document.getElementById("listNameLabel").innerText = trimmedCurActiveListArray[0];

        let liIndex = 1;
        for (let index = 1; index < trimmedCurActiveListArray.length; index++) {
            
            let cb;
            let entry;

            if (index == liIndex) {
                 // Create the new list item checkbox
                 cb = document.createElement("input");
                 cb.type = "checkbox";
                 cb.classList.add("chkBoxClass");
                 if (trimmedCurActiveListArray[index + 1] === "true") {
                     cb.checked = true;
                 } else {
                     cb.checked = false;
                 }

                // Create the new list item
                entry = document.createElement('li');

                // Create the text node and append to the list item
                entry.appendChild(document.createTextNode(trimmedCurActiveListArray[index]));
                // Append the checkbox to the list item
                entry.appendChild(cb);
                // Append the list item to the list
                document.getElementById("toDoList").appendChild(entry);

                liIndex += 3;   //skip over the completed and list title elements to get to the next list item
            }

        }

        //Set up the checkbox event handler
        let listCheckBoxes = document.getElementsByClassName("chkBoxClass");
        for (let chkBx of listCheckBoxes) {
            console.log("Adding click listener to list checkboxes");
            chkBx.addEventListener("click", onCheckBoxClick);
        }

        // Disable the Save button, no changes yet
        document.getElementById("saveList").disabled = true;

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

    let curListName;
    let newListName;
    let blnNewList;
    let trimmedMasterListArray = [];

    newListName = prompt("Please enter the list name");
    if (newListName == null || newListName == "") {
        console.log("User cancelled list renaming");
    } else {

        // Naming a new list or renaming an existing list is allowed as long as the list title is not already in use in a previous list
        // Retrieve this user's existing master list and determine if the list title is already in use
        // Retrieve stored user info based on concatenation of email address and password
        curListName = document.getElementById("listNameLabel").innerText;

        userData = localStorage.getItem(curEmailAddress + " " + curPassword);
        trimmedMasterListArray = getMasterListFromLocalStorage(userData);
        console.log("Retrieved master list for checking list titles: " + trimmedMasterListArray);

        blnNewList = true;
        for (let index = 0; index < trimmedMasterListArray.length; index++) {
            if (trimmedMasterListArray[index].indexOf(newListName) >= 0) {
                // This list title is already in the master list
                console.log(newListName + " is already in use");
                alert(newListName + " is already in use as a To Do List title, please select another name");
                blnNewList = false
                break;
            }
        }

        if (blnNewList === true) {
            document.getElementById("listNameLabel").innerText = newListName;

            // Are we renaming an existing list?
            for (let index = 0; index < trimmedMasterListArray.length; index++) {
                if (trimmedMasterListArray[index].indexOf(curListName) >= 0) {
                    console.log("Renaming an existing list");

                    let blnLastListEntry;
                    if (trimmedMasterListArray[index + 1].indexOf('^**^') >= 0) {
                        blnLastListEntry = true;
                    } else {
                        blnLastListEntry = false;
                    }

                    let strThisList = trimmedMasterListArray[index];
                    let arrThisList = strThisList.split('^');
                    console.log('This to do list as an array: ' + arrThisList);

                    for (let j=0; j < arrThisList.length; j++) {
                        if (arrThisList[j] === curListName) {
                            console.log("Replacing " + curListName + " with " + newListName + " as the list title");
                            arrThisList[j] = newListName;
                        }
                    }

                    // Insert this list back into the master list and save
                    trimmedMasterListArray[index] = '';
                    for (let j=0; j < arrThisList.length; j++) {
                        if (j === arrThisList.length - 1) {
                            trimmedMasterListArray[index] += arrThisList[j];
                        } else {
                            trimmedMasterListArray[index] += arrThisList[j] + '^';
                        }
                    }
                                 
                    // Convert the updated master list to a string
                    let strMasterListString = '';
                    for (let j=0; j < trimmedMasterListArray.length; j++) {
                        strMasterListString += trimmedMasterListArray[j];
                    }
                        
                    console.log('Updated master list as a string: ' + strMasterListString);
                        
                    // Save updated list to local storage
                    localStorage.setItem(userData, strMasterListString);    
                       
                    break;
                }
            }

            // Enable the Save button
            document.getElementById("saveList").disabled = false;
        }

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
        cb.classList.add("chkBoxClass");
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

        //Set up the checkbox event handler
        let listCheckBoxes = document.getElementsByClassName("chkBoxClass");
        for (let chkBx of listCheckBoxes) {
            console.log("Adding click listener to list checkboxes");
            chkBx.addEventListener("click", onCheckBoxClick);
        }

    }
}

function saveToDoList() {
        
    let curListString = '';
    let curListArray = [];
    let curMasterListString;
    let trimmedMasterListArray = [];
    let blnNewList;

    console.log("In saveToDoList()");

    // Retrieve stored user info based on concatenation of email address and password
    userData = localStorage.getItem(curEmailAddress + " " + curPassword);

    // Retrieve the to do list
    const list = document.getElementById("toDoList");

    // create an array of to do list objects
    curListString = traverseList(list);
    console.log('This to do list as a string: ' + curListString);

    curListArray = curListString.split('^');
    console.log('This to do list as an array: ' + curListArray);

    trimmedMasterListArray = getMasterListFromLocalStorage(userData);
        
    // Append the current list to the master list, first checking whether the current list is already in the master list i.e. we were editing an existing list
    blnNewList = true;
    for (let index = 0; index < trimmedMasterListArray.length; index++) {
        if (trimmedMasterListArray[index].indexOf(curListArray[0]) >= 0) {
            // This list is already in the master list, so update it rather than appending
            console.log("This list is already in the master list, so update rather than append");

            trimmedMasterListArray[index] = '';
            for (let j=0; j < curListArray.length; j++) {
                trimmedMasterListArray[index] += curListArray[j] + '^';
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

function getMasterListFromLocalStorage(userData) {

    let curMasterListString;
    let curMasterListArray = [];
    let trimmedMasterListArray = [];

    //Retrieve current master list from local storage
    curMasterListString = localStorage.getItem(userData);
    if (curMasterListString !== null && curMasterListString !== "null") {
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

    return trimmedMasterListArray;

}

function displayExistingLists(storedLists) {
    let curListArray = [];
    let trimmedListArray = [];
    let li;
    let listTitleLink;
    let linkText;
    let liText;

    console.log("In displayExistingLists");

    // No list selected yet
    curActiveListTitle = '';
        
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
    liText = trimmedListArray[0] + " --> Click to Edit";

    console.log("Creating link");
    listTitleLink = document.createElement('a');
    listTitleLink.classList.add("linkClass");
    linkText = document.createTextNode(liText);
    listTitleLink.appendChild(linkText);
    listTitleLink.addEventListener("click", loadListfromTitle);

    console.log("Adding title line item: " + trimmedListArray[0]);
    li = document.createElement('li');
    console.log("Appending link to list item");
    li.appendChild(listTitleLink);
    console.log("Appending list item to ul");
    ul.appendChild(li);
        
    for (let index = 1; index < trimmedListArray.length; index++) {

        if (index === trimmedListArray.length - 1) {
            // We're at the end of the master list
            console.log('At the end of the master list');

        } else if (trimmedListArray[index] === '**') {
            // We're at the end of the current list in the overall master list
            console.log('At the end of the current list in the overall master list');

            // Create the next list title line item
            liText = trimmedListArray[index + 1] + " --> Click to Edit";
            
            console.log("Creating link");
            listTitleLink = document.createElement('a');
            listTitleLink.classList.add("linkClass");
            linkText = document.createTextNode(liText);
            listTitleLink.appendChild(linkText);
            listTitleLink.addEventListener("click", loadListfromTitle);
            
            console.log("Adding title line item: " + liText);
            li = document.createElement('li');
            console.log("Appending link to list item");
            li.appendChild(listTitleLink);
            console.log("Appending list item to ul");
            ul.appendChild(li);
        }
    
    }

}

function loadListfromTitle(e) {

    //set curActiveListTitle = the list title associated with the link that was clicked
    curActiveListTitle = e.target.innerText.replace(' --> Click to Edit','');

    console.log("In loadListfromTitle(), clicked list title: " + curActiveListTitle);
    
    //Call editToDoList() in order to load and display the list indicated by curActiveListTitle
    editToDoList();
}

function onCheckBoxClick() {
	// Enable the Save button
    document.getElementById("saveList").disabled = false;
}
