"use strict";

// Helper function to add validation alerts
function addValidationAlert(message) {
    if (!window.validateAlerts) {
        window.validateAlerts = [];
    }
    window.validateAlerts.push(message);
}

// Helper function for screen resolution check
function checkScreenResolution() {
    if (window.screen.height < 768) {
        addValidationAlert(
            "Your screen resolution and/or scaling is too low to view the experiment correctly. Your experimenter can help you increase your screen resolution and/or scaling. Thank you!"
        );
    }
}

// Helper function to validate the presence of input values
function validateFieldPresence(fieldId, errorMessage) {
    const element = document.getElementById(fieldId);
    if (fieldId === "guid") {
        element.value = element.value.toUpperCase();
        const regex = /^NDAR/;

        if (!regex.test(element.value)) {
            // Check if the subjectkey matches the pattern
            validateAlerts.push("GUID does not meet format.");
            return;
        }
    }

    // Regular expression to check if the first four characters are NDAR
    if (!element || !element.value) {
        addValidationAlert(errorMessage);
    }
}

// Helper function to validate checked state of inputs
function validateCheckedState(fieldId, errorMessage) {
    const element = document.getElementById(fieldId);
    if (!element || !element.checked) {
        addValidationAlert(errorMessage);
    }
}

// Calculate age in months from date of birth
function calculateAgeInMonths(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
    ageInMonths += today.getMonth() - birthDate.getMonth();
    // Adjust for days if necessary here
    return ageInMonths;
}

// Validation functions for each form section
function validateHandedness() {
    const rightHandedness = document.getElementById("rightHanded")?.checked;
    const leftHandedness = document.getElementById("leftHanded")?.checked;

    if (!rightHandedness && !leftHandedness) {
        addValidationAlert("Please select the participant's dominant hand.");
    } else {
        // These could be stored elsewhere as needed
        window.handedness = rightHandedness ? "right" : "left";
        window.antihandedness = rightHandedness ? "left" : "right";
    }
}

function validateSex() {
    const male = document.getElementById("male").checked;
    const female = document.getElementById("female").checked;

    if (!male && !female) {
        validateAlerts.push(
            "Please select the participant's sex assigned at birth."
        );
        return;
    }

    let sex = male ? "M" : female ? "F" : undefined;

    return sex;
}

function saveFormValues() {
    const elements = document.querySelectorAll("input, select");
    const values = {};
    elements.forEach((element) => {
        if (element.id) {
            // Only save values for elements with an ID
            if (element.type === "radio" || element.type === "checkbox") {
                values[element.id] = element.checked;
            } else {
                values[element.id] = element.value;
            }
        }
    });
    localStorage.setItem("formValues", JSON.stringify(values));
}

function restoreFormValues() {
    const savedValues = localStorage.getItem("formValues");
    if (savedValues) {
        const values = JSON.parse(savedValues);
        Object.keys(values).forEach((key) => {
            const element = document.getElementById(key);
            if (element) {
                if (element.tagName.toLowerCase() === "select") {
                    // Ensure the element is fully loaded or populated
                    setTimeout(() => {
                        element.value = values[key];
                        // This checks if the value set doesn't exist in the options and logs an error
                        if (element.value !== values[key]) {
                            console.warn(
                                `Option '${values[key]}' not found for '${key}'.`
                            );
                        }
                    }, 0); // Delaying with setTimeout to allow for dynamic population
                } else if (
                    element.type === "radio" ||
                    element.type === "checkbox"
                ) {
                    element.checked = values[key];
                } else {
                    element.value = values[key];
                }
            }
        });
        // Consider when to remove the item based on your app's flow
        // localStorage.removeItem("formValues"); // Might move this to after validation complete
    }
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", restoreFormValues);

// Common function to display validation errors and reload if necessary
function displayValidationErrors() {
    if (window.validateAlerts && window.validateAlerts.length > 0) {
        // Display the alert message
        const alertMessage =
            "Validation Errors:\n" + window.validateAlerts.join("\n");
        alert(alertMessage);

        // Save form values right before reloading
        saveFormValues();

        // Reload the page
        location.reload();
    }
}

// Specific validation functions for different scenarios
function validateNda() {
    checkScreenResolution();
    validateHandedness();
    // Add other specific validation checks as needed for NDA
    displayValidationErrors();
}

function validateConsent() {
    checkScreenResolution();
    validateHandedness();
    displayValidationErrors();
}

function validateIntake() {
    checkScreenResolution();
    validateFieldPresence(
        "site",
        `Please select a valid research site.
If your site is not listed, please contact: ${adminEmail}`
    );
    validateFieldPresence("subject", "Please enter a valid subject id.");
    validateFieldPresence(
        "guid",
        "Please enter the GUID provided by the NDA GUID Client."
    );
    const dob = document.getElementById("dob")?.value;
    if (dob) {
        const ageInMonths = calculateAgeInMonths(dob);
        if (isNaN(ageInMonths) || ageInMonths < 0) {
            addValidationAlert("Invalid date of birth.");
        }
        // Optionally use ageInMonths for further validation
    } else {
        addValidationAlert("Please enter the participant's date of birth.");
    }
    validateSex();
    validateHandedness();

    // Add other specific checks as needed
    displayValidationErrors();
}

// Initialize date and formatted strings
const date = new Date();
const dd = String(date.getDate()).padStart(2, "0");
const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
const yyyy = date.getFullYear();
const isoDate = `${yyyy}-${mm}-${dd}`;
const interview_date = `${mm}/${dd}/${yyyy}`;

// Initialize alerts array
window.validateAlerts = [];
