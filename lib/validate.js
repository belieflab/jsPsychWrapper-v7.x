"use strict";

// jsPsych API for NDA variables
let handedness;
let antihandedness;

// assign date, assoc vars
const date = new Date();
const dd = String(date.getDate()).padStart(2, "0");
const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = date.getFullYear();
const isoDate = `${yyyy}-${mm}-${dd}`;
const interview_date = `${mm}/${dd}/${yyyy}`;

// build array of alerts
const validateAlerts = [];

const validateHandedness = () => {
    const rightHandedness = document.getElementById("rightHanded").checked;
    const leftHandedness = document.getElementById("leftHanded").checked;

    if (!rightHandedness && !leftHandedness) {
        validateAlerts.push("Please select the participant's dominant hand.");
        return;
    }

    if (rightHandedness === true) {
        handedness = "right";
        antihandedness = "left";
    }

    if (leftHandedness === true) {
        handedness = "left";
        antihandedness = "right";
    }

    //return handedness;
};

const validateBrightness = () => {
    const brightness = document.getElementById("brightness").checked;
    if (!brightness) {
        validateAlerts.push("Please confirm the screen brightness is 100%.");
        return;
    }
    return brightness;
};

const validateHeadphones = () => {
    const headphones = document.getElementById("headphones").checked;
    if (!headphones) {
        validateAlerts.push(
            "Please confirm the participant's headphones are plugged in and connected."
        );
        return;
    }
};

const validateVolume = () => {
    const volume = document.getElementById("volume").checked;
    if (!volume) {
        validateAlerts.push(
            "Please confirm the participant's headphone volume is 50%."
        );
        return;
    }
};
const validateSubject = () => {
    const subject = document.getElementById("subject").value;

    if (!subject) {
        validateAlerts.push("Please enter a valid subject id.");
    }
    return;
};

const validateSubjectId = () => {
    if (!subjectId) {
        validateAlerts.push(
            "There is no value present for subjectId. Please ensure the appropriate variable (workerId, participantId, PROLIFIC_PID) is present and defined in the query string of the URL."
        );
    }
    return;
};

const validateSex = () => {
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
};

const validateSite = () => {
    const site = document.getElementById("site").value;
    if (!site) {
        validateAlerts.push(
            "Please select a valid research site.\nTo add your site to this list, please contact: " +
                adminEmail
        );
        return;
    }
    return site;
};

const validateGUID = () => {
    const subjectkey = document.getElementById("guid").value.toUpperCase();
    // Regular expression to check if the first four characters are NDAR
    const regex = /^NDAR/;

    if (!subjectkey) {
        validateAlerts.push(
            "Please enter the GUID provided by the NDA GUID Client."
        );
        return;
    } else if (!regex.test(subjectkey)) {
        // Check if the subjectkey matches the pattern
        validateAlerts.push("GUID does not meet format.");
        return;
    }
    return subjectkey;
};

const validateAge = () => {
    const dob = document.getElementById("dob").value;
    if (!dob) {
        validateAlerts.push("Please enter the participant's date of birth.");
        return;
    }

    const DOByyyy = dob.slice(0, 4);
    let DOBmm = dob.slice(5, 7);
    const DOBdd = dob.slice(8, 10);
    if (DOBdd > 15) {
        DOBmm++;
    }
    let ageInMonths = yyyy * 12 - DOByyyy * 12 + (mm - DOBmm);
    ageInMonths = parseInt(ageInMonths);
    return ageInMonths;
};

// ./warp/include/nda.php
const validateNda = () => {
    if (screenResolutionHeight < 768) {
        validateAlerts.push(
            "Your screen resolution is too low to view the experiment correctly.\nYour experimenter can help you increase your screen resolution.\nThank you!"
        );
        return;
    }

    if (!src_subject_id) {
        validateAlerts.push(
            "There is no query string value present for src_subject_id."
        );
    }
    if (!subjectkey) {
        validateAlerts.push(
            "There is no query string value present for subjectkey."
        );
    }
    if (!interview_age) {
        validateAlerts.push(
            "There is no query string value present for interview_age."
        );
    }

    if (!sex) {
        validateAlerts.push("There is no query string value present for sex.");
    }

    if (!site) {
        validateAlerts.push("There is no query string value present for site.");
    }

    if (!phenotype) {
        validateAlerts.push(
            "There is no query string value present for phenotype."
        );
    }

    validateHandedness();

    return;
};

// ./wrap/include/consent.php
const validateConsent = () => {
    if (screenResolutionHeight < 768) {
        validateAlerts.push(
            "Your screen resolution is too low to view the experiment correctly.\nYour experimenter can help you increase your screen resolution.\nThank you!"
        );
        return;
    }
    validateSubjectId();
    validateHandedness();
    if (validateAlerts.length > 0) {
        const alertMessage = "Validation Errors:\n" + validateAlerts.join("\n");
        alert(alertMessage);
        location.reload(true);
        return;
    }
};

// ./wrap/include/intake.php
const validateIntake = () => {
    if (screenResolutionHeight < 768) {
        validateAlerts.push(
            "Your screen resolution is too low to view the experiment correctly.\nYour experimenter can help you increase your screen resolution.\nThank you!"
        );
        return;
    }
    validateSite();
    validateSubject();
    validateSex();
    validateAge();
    validateHandedness();
    validateGUID();

    if (validateAlerts.length > 0) {
        const alertMessage = "Validation Errors:\n" + validateAlerts.join("\n");
        alert(alertMessage);
        location.reload(true);
        return;
    }
};
