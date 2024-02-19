"use strict";

// jsPsych API for NDA variables

// declare handedness, assoc vars
let handedness;
let antihandedness;
let EasyKey_uCase;
let HardKey_uCase;

// assign date, assoc vars
const date = new Date();
const dd = String(date.getDate()).padStart(2, "0");
const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = date.getFullYear();
const interview_date = mm + "/" + dd + "/" + yyyy;
const todayStandard = yyyy + "-" + mm + "-" + dd;

/* Get the documentElement (<html>) to display the page in fullscreen */
const elem = document.documentElement;
const screenResolutionHeight = screen.height;

/* View in fullscreen */
const openFullscreen = () => {
    if (elem.requestFullscreen) {
        /* Chrome, Firefox */
        elem.requestFullscreen();
    }
    if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    }
    if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
};

/**
 * Exits fullscreen mode across different browsers.
 * This function checks for the existence of different exitFullscreen methods due to browser compatibility.
 * It will attempt to exit fullscreen mode in the following order: Standard, WebKit (Safari), and MS (IE11).
 */
const closeFullscreen = () => {
    if (document.exitFullscreen) {
        // Chrome, Firefox, and new browsers that support the standard method
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        // IE11
        document.msExitFullscreen();
    }
};

// build array of alerts
const validateAlerts = [];

const validateHandedness = () => {
    const rightHandedness = document.getElementById("rightHanded").checked;
    const leftHandedness = document.getElementById("leftHanded").checked;

    if (!rightHandedness && !leftHandedness) {
        validateAlerts.push("Please select the participant's dominant hand.");
        return;
    }

    let handedness;
    let antihandedness;

    if (rightHandedness) {
        handedness = "right";
        antihandedness = "left";
    }

    if (leftHandedness) {
        handedness = "left";
        antihandedness = "right";
    }

    return handedness;
};

const validateBrightness = () => {
    const brightness = document.getElementById("brightness").checked;
    if (!brightness) {
        validateAlerts.push("Please confirm the screen brightness is 100%.");
        return;
    }
    return brightness;
};

// const validateFullscreen = () => {
//     if (document.getElementById("fullscreen").checked === false) {
//         alert("Please confirm your browser window is in full screen");
//     }
// };

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
    if (!subjectkey) {
        validateAlerts.push(
            "Please enter the GUID provided by the NDA GUID Client."
        );
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
    const DOBmm = dob.slice(5, 7);
    const DOBdd = dob.slice(8, 10);
    if (DOBdd > 15) {
        DOBmm++;
    }
    const ageInMonths = yyyy * 12 - DOByyyy * 12 + (mm - DOBmm);
    const interview_age = parseInt(ageInMonths);
    return interview_age;
};

// this function is called when GET parameters are passed to the URL
const validateConsent = () => {
    const intake = document.getElementById("consent");
    const consent = document.getElementById("load");
    if (intake.style.display === "none") {
        intake.style.display = "block";
    } else {
        intake.style.display = "none";
        consent.style.display = "block";
    }
};

// these functions are called when intake.php is loaded
const validateIntake = () => {
    const intake = document.getElementById("intake");
    const consent = document.getElementById("load");
    if (intake.style.display === "none") {
        intake.style.display = "block";
    } else {
        intake.style.display = "none";
        consent.style.display = "block";
    }
};

// this function runs when the submit button is pressed

const submitIntake = () => {
    if (screenResolutionHeight < 768) {
        validateAlerts.push(
            "Your screen resolution is too low to view the experiment correctly.\nYour experimenter can help you increase your screen resolution.\nThank you!"
        );
        return;
    }

    if (validateAlerts.length > 0) {
        const alertMessage = "Validation Errors:\n" + validateAlerts.join("\n");
        alert(alertMessage);
        location.reload(true);
        return;
    }

    validateIntake();
};
