document.addEventListener("DOMContentLoaded", initializePage);
let newUser;
let existingUser;

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
}

// Hide welcome screen and display the Sign Up screen
function signUp() {
    const welCome = document.getElementById("welcome");
    welCome.hidden = true;
    newUser.hidden=false;
    
    //Set up the new user info Submit button click event listener
    const newUserSubmit = document.getElementById("newUserSubmit");
    newUserSubmit.addEventListener("click", validateNewUser);
}

// Hide welcome screen and display the Login screen
function logInUser(e) {
    const welCome = document.getElementById("welcome");
    welCome.hidden = true;
    existingUser.hidden=false;
}

// Check new user input
function validateNewUser() {

    let blnValidated = validateInput();

    if (blnValidated) {
        // Input is valid
        alert("Input is valid, saving...");
    }
    
}

function validateInput() {

    const newFirstName = document.getElementById("fName").value;
    if (newFirstName === "") {
        displayError("A first name is required.");
        return false;
    }

    const newLastName = document.getElementById("lName").value;
    if (newLastName === "") {
        displayError("A last name is required.");
        return false;
    }

    const newEmail = document.getElementById("emailAddress").value;
    if (newEmail === "") {
        displayError("An email address is required.");
        return false;
    }

    const newPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword === "") {
        displayError("Please enter a password.");
        return false;
    } else if (confirmPassword === "") {
        displayError("Please confirm your new password.");
        return false;
    } else if (newPassword != confirmPassword) {
        displayError("Confirm password does not match. Please try again");
        return false;
    }

    const agreeTerms = document.getElementById("agreeTerms").checked;
    if (!agreeTerms) {
        displayError("You must agree to the Terms of Use.");
        return false;
    }

    return true;
}

// Display error message if there is one
function displayError(strErrorMessage) {
    alert(strErrorMessage);
}



