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
function validateField(fieldId, errorMessage) {
    const element = document.getElementById(fieldId);
    if (fieldId === "guid") {
        element.value = element.value.toUpperCase();
        const regex = /^NDAR[1-9A-Z]{8}$/;

        if (!regex.test(element.value)) {
            // Check if the subjectkey matches the pattern
            validateAlerts.push("GUID does not meet format.");
            return;
        }
    }

    // Special handling for the 'dob' field
    if (fieldId === "dob") {
        const dob = new Date(element.value);
        console.log(dob, "dob");
        const today = new Date();

        // Check if the provided date is invalid
        if (isNaN(dob.getTime())) {
            addValidationAlert("Invalid date of birth.");
            return null; // Exit the function as the date is invalid
        }

        // Check if the date of birth is in the future
        if (dob > today) {
            addValidationAlert("Date of birth cannot be in the future.");
            return null; // Exit the function as the date is invalid
        }

        // Calculate age in months considering the day of the month
        let ageInMonths = (today.getFullYear() - dob.getFullYear()) * 12;
        ageInMonths += today.getMonth() - dob.getMonth();

        // Add an additional month if the day of the birth date is greater than 15
        if (dob.getDate() > 15) {
            ageInMonths++;
        }

        // Ensure age in months is not negative
        ageInMonths = Math.max(0, ageInMonths);

        // You can use ageInMonths for additional validation if needed
        // For example, if there's a minimum age requirement:
        // if (ageInMonths < 18 * 12) { // Example: 18 years old requirement
        //     addValidationAlert("Participants must be at least 18 years old.");
        //     return null;
        // }

        return ageInMonths; // Return the age in months if all checks pass
    }

    // Regular expression to check if the first four characters are NDAR
    if (!element || !element.value) {
        addValidationAlert(errorMessage);
    }

    return element.value;
}

function validateRadio(groupName, alertMessage) {
    const radioButtons = document.querySelectorAll(
        `input[name="${groupName}"]`
    );
    let selectedValue = null;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            break; // Stop the loop once you've found the checked radio button
        }
    }

    if (!selectedValue) {
        addValidationAlert(alertMessage);
        return null; // No option selected
    } else {
        // Assign selected value to a global variable based on the group name
        if (groupName === "handedness") {
            window.handedness = selectedValue;
            window.antihandedness =
                selectedValue === "right" ? "left" : "right";
        }
        // sex is a sigular value and declared in the return
    }

    return selectedValue; // Return the selected value for further use
}

function validateSubjectId() {
    if (!subjectId) {
        validateAlerts.push(
            "There is no value present for subjectId. Please ensure the appropriate variable (workerId, participantId, PROLIFIC_PID) is present and defined in the query string of the URL."
        );
    }
    return;
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
        localStorage.removeItem("formValues"); // Might move this to after validation complete
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
    validateSubjectId();
    validateRadio(
        "handedness",
        "Please select the participant's dominant hand."
    );
    displayValidationErrors();
}

function validateConsent() {
    checkScreenResolution();
    validateSubjectId();
    validateRadio(
        "handedness",
        "Please select the participant's dominant hand."
    );
    displayValidationErrors();
}

function validateIntake() {
    checkScreenResolution();
    site = validateField(
        "site",
        `Please select a valid research site.
         If your site is not listed, please contact: ${adminEmail}`
    );
    src_subject_id = subjectId = validateField(
        "subject",
        "Please enter a valid subject id."
    );
    subjectkey = validateField(
        "guid",
        "Please enter the GUID provided by the NDA GUID Client."
    );
    interview_age = validateField(
        "dob",
        "Please enter the participant's date of birth."
    );
    sex = validateRadio(
        "sex",
        "Please select the participant's sex assigned at birth."
    );
    // no need to assign handedness and anti-handedness, they are window global variables
    validateRadio(
        "handedness",
        "Please select the participant's dominant hand."
    );
    displayValidationErrors();
}

// Initialize alerts array
window.validateAlerts = [];
