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

/**
 * Fixed version of validateField that handles validation correctly
 * Replace your current validateField function with this one
 */
function validateField(fieldId, errorMessage) {
    const element = document.getElementById(fieldId);

    // If element doesn't exist or has no value
    if (!element || !element.value) {
        addValidationAlert(errorMessage);
        return null;
    }

    // GUID validation
    if (fieldId === "guid") {
        element.value = element.value.toUpperCase();
        const regex = /^NDAR[0-9A-Z]{8}$/;

        if (!regex.test(element.value)) {
            addValidationAlert("GUID does not meet format.");
            return null;
        }
    }

    // Subject ID validation
    if (fieldId === "subject") {
        element.value = element.value.toUpperCase();

        // Check for intake.subject configuration
        if (
            typeof intake !== "undefined" &&
            intake.subject &&
            intake.subject.prefix &&
            intake.subject.minLength &&
            intake.subject.maxLength
        ) {
            // Check if the value starts with the prefix
            if (!element.value.startsWith(intake.subject.prefix)) {
                addValidationAlert(
                    `Subject ID must begin with ${intake.subject.prefix}.`
                );
                return null;
            }

            // Check total length
            if (element.value.length !== intake.subject.minLength) {
                addValidationAlert(
                    `Subject ID must be exactly ${intake.subject.minLength} characters long.`
                );
                return null;
            }

            // Check that the part after prefix contains only digits
            const digitPart = element.value.substring(
                intake.subject.prefix.length
            );
            const expectedDigitCount =
                intake.subject.minLength - intake.subject.prefix.length;

            if (
                digitPart.length !== expectedDigitCount ||
                !/^\d+$/.test(digitPart)
            ) {
                addValidationAlert(
                    `Subject ID must have ${expectedDigitCount} digits after ${intake.subject.prefix}.`
                );
                return null;
            }
        }

        // Site-specific validation
        if (site === "UCD" && !/^C10D.{4}$/.test(element.value)) {
            addValidationAlert(
                "Subject Id must begin with C10D and be 8 characters long."
            );
            return null;
        }

        if (site === "UMN" && !/^C10M.{4}$/.test(element.value)) {
            addValidationAlert(
                "Subject Id must begin with C10M and be 8 characters long."
            );
            return null;
        }

        if (site === "Maryland" && !/^C10B.{4}$/.test(element.value)) {
            addValidationAlert(
                "Subject Id must begin with C10B and be 8 characters long."
            );
            return null;
        }

        if (site === "UChicago" && !/^C10C.{4}$/.test(element.value)) {
            addValidationAlert(
                "Subject Id must begin with C10C and be 8 characters long."
            );
            return null;
        }

        if (site === "WashU" && !/^C10W.{4}$/.test(element.value)) {
            addValidationAlert(
                "Subject Id must begin with C10W and be 8 characters long."
            );
            return null;
        }
    }

    // Date of birth validation
    if (fieldId === "dob") {
        const dob = new Date(element.value);
        const today = new Date();

        // Check if the provided date is invalid
        if (isNaN(dob.getTime())) {
            addValidationAlert("Invalid date of birth.");
            return null;
        }

        // Check if the date of birth is in the future
        if (dob > today) {
            addValidationAlert("Date of birth cannot be in the future.");
            return null;
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

        return ageInMonths; // Return the age in months if all checks pass
    }

    // Return the element value for all other fields
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
        addValidationAlert(
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
                    // Special handling for subject field with prefix
                    if (
                        key === "subject" &&
                        typeof intake !== "undefined" &&
                        intake.subject &&
                        intake.subject.prefix
                    ) {
                        // Only restore if the saved value includes the prefix or is longer than just the prefix
                        if (
                            values[key] &&
                            values[key].length > intake.subject.prefix.length
                        ) {
                            element.value = values[key];
                        } else {
                            // Set to prefix if saved value is empty or just the prefix
                            element.value = intake.subject.prefix;
                        }
                    } else {
                        element.value = values[key];
                    }
                }
            }
        });
        // Consider when to remove the item based on your app's flow
        localStorage.removeItem("formValues"); // Might move this to after validation complete
    }
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", restoreFormValues);

/**
 * Fixed displayValidationErrors function that prevents multiple alerts
 */
function displayValidationErrors() {
    // Check if there are alerts to display
    if (window.validateAlerts && window.validateAlerts.length > 0) {
        // Display the alert message
        const alertMessage =
            "Validation Errors:\n" + window.validateAlerts.join("\n");
        alert(alertMessage);

        // Save form values
        saveFormValues();

        // Clear the alerts to prevent duplicate alerts
        window.validateAlerts = [];
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

function validateStart() {
    checkScreenResolution();
    validateSubjectId();
}

/**
 * Simple validateIntake function - maintains localStorage functionality
 * Just adds the validation for the VIP prefix and conditionally handles NIH fields
 */
function validateIntake() {
    // Reset validation alerts at the beginning
    window.validateAlerts = [];

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

    // Only validate GUID and DOB if NIH study
    if (typeof intake !== "undefined" && intake.nih === true) {
        subjectkey = validateField(
            "guid",
            "Please enter the GUID provided by the NDA GUID Client."
        );
        interview_age = validateField(
            "dob",
            "Please enter the participant's date of birth."
        );
    }

    phenotype = validateField(
        "phenotype",
        `Please select a phenotype (group status)
         If your study's phenotypes are not listed, please contact: ${adminEmail}`
    );
    sex = validateRadio(
        "sex",
        "Please select the participant's sex assigned at birth."
    );

    // Check for visit field and validate if present
    const visitElement = document.getElementById("visit");
    if (visitElement) {
        visit = validateField("visit", "Please enter the visit number.");
    }

    // Check for week field and validate if present
    const weekElement = document.getElementById("week");
    if (weekElement) {
        week = validateField("week", "Please enter the week number.");
    }

    // no need to assign handedness and anti-handedness, they are window global variables
    validateRadio(
        "handedness",
        "Please select the participant's dominant hand."
    );

    // Only display validation errors if there are any
    if (window.validateAlerts && window.validateAlerts.length > 0) {
        displayValidationErrors();
        return; // Exit early if there are validation errors
    }

    // Disable submit button to prevent multiple clicks
    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = "Processing...";
    }

    // Run test save with proper subject ID
    console.log("VALIDATION PASSED: Proceeding to test data save");
    if (typeof testDataSave === "function") {
        testDataSave()
            .then((result) => {
                if (result && result.success) {
                    console.log("TEST SAVE SUCCESSFUL: Loading experiment");
                    // Load the experiment timeline
                    $.getScript("exp/timeline.js");
                } else {
                    console.error(
                        "TEST SAVE FAILED:",
                        result?.error || "Unknown error"
                    );
                    alert(
                        "Failed to save data. Please ensure you're using Chrome, Firefox, or Safari."
                    );
                    // Re-enable submit button
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = "SUBMIT";
                    }
                }
            })
            .catch((error) => {
                console.error("TEST SAVE ERROR:", error);
                alert("Error testing data save. Please try again.");
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = "SUBMIT";
                }
            });
    } else {
        console.error("TEST SAVE FUNCTION NOT AVAILABLE");
        alert(
            "Error: Test save function not available. Please refresh the page."
        );
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = "SUBMIT";
        }
    }
}

// Initialize alerts array
window.validateAlerts = [];

// Debug: Log when validate.js is loaded
console.log(
    "validate.js loaded - validateIntake function available:",
    typeof validateIntake === "function"
);
