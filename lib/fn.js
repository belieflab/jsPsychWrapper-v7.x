"use strict";

/**
 * Initiates the experiment by entering fullscreen mode and starting the jsPsych timeline.
 * This function should be called when you are ready to start the experiment.
 * It first calls `openFullscreen` to request the browser to enter fullscreen mode,
 * which is typically required for psychological experiments to prevent distractions and ensure consistent presentation.
 * Then, it starts the jsPsych experiment using the `jsPsych.run` method, passing in the predefined `timeline`.
 *
 * Note: Ensure that the `openFullscreen` function is defined and properly requests fullscreen on the document or specific element.
 * Also, make sure that the `timeline` variable is defined and contains the sequence of trials/tasks for the experiment.
 */

function toggleDebugMode(debug) {
    setTimeout(() => {
        if (debug) {
            $("body").removeClass("hideCursor").addClass("showCursor");
        } else {
            $("body").removeClass("showCursor").addClass("hideCursor");
        }
        // Hide progress bar
        document.getElementById(
            "jspsych-progressbar-container"
        ).style.visibility = "hidden";
    }, 100);
}
/**
 * Sends experiment data to the server to be saved. This function creates an XMLHttpRequest
 * to POST the provided data to 'data.php'. It uses default values for 'name' and 'data'
 * if they are not specified when the function is called.
 *
 * The 'name' defaults to a combination of 'experimentAlias' and 'subjectId', and 'data'
 * defaults to the CSV representation of the jsPsych data object. The server response
 * should be JSON formatted including at least a 'success' field. If the server returns
 * a status code of 200, the response is parsed and passed to the callback along with
 * the success status.
 *
 * @param {string} [name=`${experimentAlias}_${subjectId}`] - The default name associated with the data,
 * which could be used as the filename or identifier on the server. It is constructed from the
 * 'experimentAlias' and 'subjectId' variables, which should be defined prior to calling this function.
 * @param {Object|string} [data=jsPsych.data.get().csv()] - The actual data to be sent to the server,
 * defaulting to the CSV representation of the jsPsych data. This will be stringified to JSON format
 * before sending. Ensure jsPsych is initialized and has data if using the default.
 * @param {Function} callback - A callback function that is called when the request completes.
 * The callback should expect two arguments: a boolean indicating success and the server's response object.
 * The server's response is expected to contain a 'success' attribute indicating the operation's outcome.
 *
 */
function saveData(
    name = `${experimentAlias}_${subjectId}`,
    data = jsPsych.data.get().csv(),
    callback = () => {}
) {
    if (visit) {
        name = `${experimentAlias}_${subjectId}_v${visit}`;
    }

    if (week) {
        name = `${experimentAlias}_${subjectId}_w${week}`;
    }

    if (phase) {
        name = `${experimentAlias}_${subjectId}_phase${phase}`;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "data.php");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText); // Log the response text
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    callback(response.success, response);
                } catch (e) {
                    // Handle parsing error
                    console.error("Parsing error:", e);
                    callback(false, {
                        error: "Parsing error",
                        details: e.message,
                    });
                }
            } else {
                callback(false, { error: xhr.statusText });
            }
        }
    };

    xhr.send(
        JSON.stringify({
            filename: name,
            filedata: data,
        })
    );
}

/**
 * Returns a promise that resolves or rejects based on the success of data submission to the server.
 * This function is a wrapper around `saveData`, converting its callback pattern into a Promise pattern.
 * It uses default values for 'name' and 'data' if they are not specified when the function is called.
 *
 * The 'name' defaults to a combination of 'experimentAlias' and 'subjectId'. 'data' defaults to the
 * CSV representation of the jsPsych data object. This function is intended to be used in asynchronous
 * contexts where waiting for the data submission result is needed.
 *
 * @param {string} [name=`${experimentAlias}_${subjectId}`] - The default name associated with the data,
 * constructed from the 'experimentAlias' and 'subjectId' variables. Ensure these are defined before
 * calling this function if you wish to use the default name.
 * @param {Object|string} [data=jsPsych.data.get().csv()] - The actual data to be sent to the server,
 * defaulting to the CSV representation of the jsPsych data. This data will be stringified to JSON format
 * before sending. Ensure jsPsych is initialized and has data if using the default.
 *
 * @returns {Promise<Object>} A promise that resolves with the server's response object if the data
 * is successfully saved, or rejects with the server's response object if saving fails.
 *
 */
function saveDataPromise(
    name = `${experimentAlias}_${subjectId}`,
    data = jsPsych.data.get().csv()
) {
    return new Promise((resolve, reject) => {
        // Check if subjectId is undefined and set it to a timestamp if so
        if (subjectId === undefined) {
            // Generate a timestamp in the format of 'YYYYMMDDHHmmss'
            const timestamp = new Date()
                .toISOString()
                .replace(/T/, "") // Replace T with nothing
                .replace(/\..+/, "") // Remove milliseconds and anything after
                .replace(/-/g, "") // Remove dashes
                .replace(/:/g, ""); // Remove colons
            name = `${experimentAlias}_${timestamp}`; // Set subjectId to the generated timestamp
        }
        saveData(name, data, (isSuccessful, response) => {
            if (isSuccessful) {
                resolve(response); // Data saved successfully
            } else {
                reject(response); // Failed to save data
            }
        });
    });
}

/**
 * Saves experiment data to MongoDB.
 * Collects all data from jsPsych, creates a payload with subject identifiers
 * and experiment data, then sends it to a MongoDB database via API.
 * 
 * @async
 * @function
 * @returns {Promise<Object>} The parsed JSON response from the server
 * @throws {Error} If the server response is not OK
 */
async function saveMongo() {
    // Get the full data set as an array of objects from jsPsych
    const data = jsPsych.data.get().values();

    // Find the subjectkey, if available
    const subjectkey = data.find((d) => d.subjectkey)?.subjectkey || null;

    const payload = {
        studyAlias: database, // Database name in MongoDB
        taskAlias: collection, // Collection name in MongoDB
        subjectkey: subjectkey, // NDA GUID (if available)
        src_subject_id: src_subject_id, // Subject ID (if available)
        workerId: workerId, // MTurk worker ID (if available)
        participantId: participantId, // Connect participant ID (if available)
        PROLIFIC_PID: PROLIFIC_PID, // Prolific PID(if available)
        data: data, // Full jsPsych data object
    };

    // Perform the fetch request and await its completion
    const response = await fetch(KLOOJE_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok)
        throw new Error(`Failed to save data: ${response.statusText}`);

    return response.json(); // Parse and return JSON response on success
}

/**
 * Provides a message to be displayed in a confirmation dialog when the user attempts to leave the webpage.
 * This is typically used in conjunction with the browser's beforeunload event to alert the user that changes
 * they made may not be saved if they leave the page. The function returns a string which can be customized
 * to fit the context of the application or website.
 *
 * Note: Modern browsers may not display the returned string to the user but will use it to determine whether
 * or not to show a generic leaving confirmation dialog. Ensure this function is hooked properly to the
 * window's beforeunload event for it to work as expected.
 *
 * Usage example:
 * window.onbeforeunload = areYouSure;
 *
 * @returns {string} A message warning the user about unsaved changes that may be lost if they leave the page.
 * Customize the returned string to match the tone and style of your application.
 */
const areYouSure = () => {
    return "Write something clever here..."; // Customize this message
};

// checks if string is empty, null, or undefined
// const isEmpty = (str) => {
//     return !str || !str.length;
// };

/**
 * Retrieves the value of a specified URL parameter.
 * This function uses regular expressions to search for the presence of a query parameter within the current page's URL.
 * It is adapted from a method shared by Gary Lupyan on the University of Wisconsin's Psychology Department website.
 *
 * If the specified parameter is found, the function returns its value. If the parameter is not found,
 * the function now returns `undefined`, aligning with JavaScript conventions for unspecified values.
 *
 * @param {string} name - The name of the URL parameter whose value is to be retrieved. This name is case-sensitive.
 *
 * @returns {string|undefined} The value of the specified URL parameter if found; otherwise, `undefined`.
 *
 * Usage example:
 * // Assume the current URL is http://example.com/?param=value
 * const value = getParamFromUrl('param'); // Returns 'value'
 * const nonExistent = getParamFromUrl('nonExistent'); // Returns undefined
 */
function getParamFromUrl(name) {
    // Escape potential regex characters in the parameter name
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regexS = "[?&]" + name + "=([^&#]*)";
    const regex = new RegExp(regexS);
    const results = regex.exec(window.location.href);
    if (results == null)
        return undefined; // Changed from returning an empty string to undefined
    else return decodeURIComponent(results[1].replace(/\+/g, " ")); // Decoding URI component
}

/**
 * Randomly shuffles the elements of an array using the Fisher-Yates (Durstenfeld) shuffle algorithm.
 * This method iterates over a copy of the array from the last element to the first, swapping each element
 * with another random element that comes before it (including itself). This ensures each element has an equal
 * probability of ending up in any position.
 *
 * Note: This function does not modify the original array. Instead, it returns a shuffled copy of the array.
 * The original array remains unchanged.
 *
 * @param {Array} array - The array to be shuffled. This can be an array of any type or a mix of types.
 *
 * @returns {Array} A new array containing the elements of the original array, shuffled randomly.
 *
 * Usage example:
 * const myArray = [1, 2, 3, 4, 5];
 * const shuffledArray = shuffleArray(myArray);
 * console.log(shuffledArray); // Could be [3, 1, 5, 2, 4] or any other permutation
 * console.log(myArray); // Original array remains unchanged: [1, 2, 3, 4, 5]
 */
function shuffleArray(array) {
    // Make a copy to avoid modifying the original array
    const arrayCopy = [...array];

    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy;
}

/**
 * Displays an animation and a message indicating that data is being saved.
 * This function creates and appends HTML elements to show a loading animation and a warning message
 * to the user not to close the window until the saving process is completed. The elements are styled
 * to indicate the ongoing data-saving process.
 *
 * Usage example:
 * stimulus: dataSaveAnimation();
 */
const dataSaveAnimation = () => {
    return `
<div class='data-save-animation'>
    <p>Data saving...</p>
    <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
    </div>
    <p>Do not close this window until the text disappears.</p>
</div>`;
};

/**
 * Translates the text of consent-related buttons based on the selected language.
 * Defaults to English if the selected language is unsupported.
 *
 * @param {string} language - The selected language for translation. Supported languages
 *                            include English, French, and German. Defaults to English
 *                            for any other inputs or unsupported languages.
 * @param {array} instructions - An array of instructions specified to be translated.
 */

// Function to translate instructions based on selected language
function translate(language, ...instructions) {
    // Load the consent language file based on the selected language
    // Check if the 'consentForm' element exists
    const consentForm = document.getElementById("consentForm");
    if (consentForm) {
        // If the element exists, proceed with fetching and updating content
        document.addEventListener("DOMContentLoaded", () => {
            const langFilePath = `wrap/include/lang/${language}.php`;

            fetch(langFilePath)
                .then((response) =>
                    response.ok
                        ? response.text()
                        : Promise.reject("Failed to load")
                )
                .then((result) => {
                    if (!result || result.trim().length === 0)
                        throw new Error("Empty response");
                    document.getElementById("consentForm").innerHTML = result;
                    document.getElementById("consentButton").style.display =
                        "block";
                    // Show consent form and submit button
                    $(".loading").css({ display: "none" });
                    $(".consent").css({ display: "block" });
                    $(".buttonHolder").css({ display: "block" });
                })
                .catch((error) => {
                    console.error("Error loading language file: ", error);
                    document.getElementById("consentButton").style.display =
                        "none"; // Ensure button is shown with fallback content
                });
        });

        let consent, submit; // Variables for the translated texts of the consent buttons

        // Determine the translation based on the selected language
        switch (language) {
            case "french":
                consent = "CONSENTEMENT";
                submit = "SOUMETTRE";
                break;

            case "german":
                consent = "ZUSTIMMUNG";
                submit = "EINREICHEN";
                break;

            default: // Default case for English and unsupported languages
                consent = "CONSENT";
                submit = "SUBMIT";
                break;
        }

        // Update the webpage elements with the translated text
        const consentButton = document.getElementById("consentButton"); // Update consent button
        const submitButton = document.getElementById("submitButton"); // Replace 'yourElementId' with the actual ID
        if (consentButton) {
            consentButton.innerHTML = consent; // Modify as needed
        }
        if (submitButton) {
            submitButton.innerHTML = submit; // Modify as needed
        }
    }

    let translatedInstructions = []; // Array to store translated instructions

    // Determine the translation based on the selected language
    switch (language) {
        case "french":
            translatedInstructions = instructions;
            break;

        case "german":
            translatedInstructions = instructions;
            break;

        default: // Default case for English and unsupported languages
            translatedInstructions = instructions; // No translation needed, keep original instructions
            break;
    }

    // Iterate through translated instructions and update corresponding webpage elements.
    translatedInstructions.forEach((translatedInstruction, index) => {
        // Construct the element ID. The first instruction element is named 'welcome_stim',
        // subsequent elements follow the pattern 'instructionX_stim' where X is the index.
        let instructionElementId =
            index === 0 ? "welcome_stim" : `instruction${index + 1}_stim`;

        // Check if an element with the constructed ID exists. If it does, update its content
        // with the translated instruction.
        if (document.getElementById(instructionElementId)) {
            document.getElementById(instructionElementId).innerHTML =
                translatedInstruction;
        }
    });
}

/**
 * Removes specified keys from a given data object. This function is designed for cleaning up the data object
 * in jsPsych experiments by removing unnecessary or unwanted information before it is stored or analyzed.
 *
 * @param {Object} data - The data object generated by a jsPsych trial. This object contains various
 *                        properties that are recorded during the trial, such as responses and timing information.
 * @param {...string} keysToRemove - The keys to remove from the data object. If no keys are provided,
 *                                   'response' and 'question_order' are removed by default.
 * @returns {Object} The cleaned data object with the specified keys removed.
 */
function removeOutputVariables(data, ...keysToRemove) {
    // Set default keys to remove if none are provided
    if (keysToRemove.length === 0) {
        keysToRemove = [];
    }

    // Iterate over the keys and delete them from the data
    keysToRemove.forEach((key) => {
        delete data[key];
    });

    return data; // Return the modified data
}

// handle trial repetition dynamically

// Current repetitions based on debug state
let currentRepetitions = { ...repetitions.production };

/**
 * Initializes currentRepetitions based on the debug state.
 * If debug is true, repetitions are set to minimal values (debug configuration),
 * otherwise, they are set to standard values (production configuration).
 */

function initializeRepetitions() {
    // Check if the configuration uses objects or single numbers
    if (typeof repetitions.production === "number") {
        // Configuration uses single number, apply directly
        currentRepetitions = debug ? repetitions.debug : repetitions.production;
    }

    if (
        typeof repetitions.production === "object" &&
        repetitions.production !== null
    ) {
        // Configuration uses objects, spread into currentRepetitions
        currentRepetitions = debug
            ? { ...repetitions.debug }
            : { ...repetitions.production };
    }
}

/**
 * Handles the potential switch from debug to production mode.
 * This function checks if an hour has passed since the last prompt, using timestamps stored in local storage.
 * If the conditions are met (one hour passed and no alert shown), it prompts the user to switch to production mode.
 * If the user agrees to switch, it updates the debug state to false, applies full screen mode, and reinitializes repetitions.
 * Local storage is updated to reflect the new state and time of the prompt.
 */
function handleDebugSwitch() {
    const currentTime = Date.now();
    const lastPromptTime =
        parseInt(localStorage.getItem("lastPromptTime")) || 0;
    const alertShown = localStorage.getItem("alertShown") === "true";
    const oneHour = 36; // Correct duration for one hour

    if (currentTime - lastPromptTime > oneHour && !alertShown) {
        localStorage.setItem("lastPromptTime", currentTime.toString());
        localStorage.setItem("alertShown", "true");

        const debugWarning = alert(
            "WARNING: This task is currently in debug mode, meaning all trials will not be administered and the data will be unusable! If you want to switch to production mode, change the debug configuration."
        );

        // if (debugWarning) {
        //     debug = false; // Update the debug state
        //     openFullscreen(); // Additional actions for switching to production mode
        // }
        initializeRepetitions(); // Reinitialize repetitions based on new state
    }
}

/**
 * Retrieves the current repetitions, handling the debug mode if active.
 * If the program is in debug mode, it will check and possibly handle a switch to production mode via handleDebugSwitch().
 * Returns the current configuration of repetitions, which could be affected by the debug switch handling.
 *
 * @returns {Object} An object with the current configuration for learning, blocking, and testing repetitions.
 */
function getRepetitions() {
    if (debug) {
        handleDebugSwitch();
    }

    if (!debug) {
        openFullscreen(); // Additional actions for switching to production mode
    }

    return currentRepetitions;
}

// Perform initial setup of repetitions based on the initial debug state
initializeRepetitions();

/**
 * Initializes fullscreen mode for the experiment when not in debug mode.
 * Wrapper function that calls openFullscreen() if debug mode is disabled.
 */
function handleFullscreen() {
    if (!debug) {
        openFullscreen(); // Additional actions for switching to production mode
    }
}

/**
 * Adjusts timeline variables based on the current mode (debug or production) and manages the transition between these modes.
 * This function checks if the system is in debug mode and, if so, whether it should switch to production mode.
 * The switch prompt is shown only once per session or after one hour has passed since the last prompt, to prevent frequent interruptions.
 *
 * @param {Array} timelineVariables - The array of timeline variables that may be modified based on the current mode.
 * @returns {Array} The modified array of timeline variables, adjusted based on whether the system is in debug or production mode.
 */
function shuffleTimelineVariables(timelineVariables) {
    // Check if the program is currently in debug mode.
    if (debug) {
        const currentTime = Date.now();
        // Retrieve the last prompt time from local storage and parse it as an integer.
        // If there is no value in local storage for lastPromptTime, default to 0.
        const lastPromptTime =
            parseInt(localStorage.getItem("lastPromptTime")) || 0;
        // Retrieve the alertShown flag from local storage and parse it as boolean.
        // If there is no value in local storage for alertShown, default to false.
        const alertShown = localStorage.getItem("alertShown") === "true";

        // Time in milliseconds (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
        const oneHour = 36; // Corrected value

        if (currentTime - lastPromptTime > oneHour && !alertShown) {
            // Update the last prompt time in local storage.
            localStorage.setItem("lastPromptTime", currentTime.toString());
            // Set the alertShown flag in local storage to true.
            localStorage.setItem("alertShown", "true");

            // Confirm with the user whether to switch to production mode.
            const debugWarning = alert(
                "WARNING: This task is currently in debug mode, meaning all trials will not be administered and the data will be unusable! If you want to switch to production mode, change the debug configuration."
            );

            // Update the debug mode based on user confirmation.
            // if (debugWarning) {
            //     debug = false; // Switch to production mode.
            //     // Add any specific actions required when switching to production mode, like opening fullscreen.
            //     openFullscreen();
            // } else {
            //     // If the user cancels, return the current repetitions without re-invoking the function.
            //     return debug
            //         ? shuffleArray(timelineVariables).slice(0, 1)
            //         : shuffleArray(timelineVariables);
            // }
        }
    }

    // Return the number of repetitions based on the current mode (debug or production).
    return debug
        ? shuffleArray(timelineVariables).slice(0, 1)
        : shuffleArray(timelineVariables);
}

// add on for shuffleTimelineVariables and getRepetitions
// Add event listener for the window load event.
document.addEventListener("DOMContentLoaded", (event) => {
    // Check if the alertShown flag is set in local storage.
    if (localStorage.getItem("alertShown") === "true") {
        // remove the alertShown flag from local storage.
        localStorage.removeItem("alertShown");
    }
});

/**
 * @fileoverview Configuration settings for the user interface theme of the application.
 * This file includes constants and settings that define the look and feel of the application's UI.
 */

/**
 * Represents the UI theme setting for the application.
 * This constant determines the overall color scheme and style applied to the application interface.
 * It should be set to either 'light' or 'dark' according to the preferred default appearance.
 *
 * @constant {string} theme - The theme setting for the UI. Possible values: 'light', 'dark'.
 */
switch (theme) {
    case "dark":
        document.documentElement.classList.add("dark-theme"); // Adds the dark theme
        break;
    case "light":
        document.documentElement.classList.add("light-theme"); // Adds the white theme
        break;
    case "white":
        document.documentElement.classList.add("white-theme"); // Adds the white theme
        break;
    case "gray":
        document.documentElement.classList.add("gray-theme"); // Adds the white theme
        break;
    default:
        document.documentElement.classList.add("light-theme"); // Adds the white theme
        break;
}

/* Get the documentElement (<html>) to display the page in fullscreen */
const elem = document.documentElement;
const screenResolutionHeight = screen.height;

/**
 * Requests fullscreen mode for the document element.
 * Attempts to enter fullscreen mode using various browser-specific methods,
 * with error handling for unsupported scenarios.
 * 
 * @function
 * @side-effects {DOM} Changes display mode to fullscreen if supported
 */
const openFullscreen = () => {
    // Make sure elem is defined
    const element = document.documentElement; // or whatever element you want fullscreen

    try {
        // Add event listeners for both keydown and touch events
        document.addEventListener('keydown', (event) => {
            // Check if the pressed key is the spacebar (key code 32 or ' ')
            if (event.key === ' ' || event.keyCode === 32) {
                requestFullscreenForElement(element);
            }
        });
        
        document.addEventListener('touchend', () => {
            requestFullscreenForElement(element);
        });
        
        // Helper function to request fullscreen with browser compatibility
        function requestFullscreenForElement(elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { // Firefox
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { // IE/Edge
                elem.msRequestFullscreen();
            }
        }
    } catch (error) {
        console.error('Error attempting to enable full-screen:', error);
    }
};

/**
 * Exits fullscreen mode across different browsers.
 * This function checks for the existence of different exitFullscreen methods due to browser compatibility.
 * It will attempt to exit fullscreen mode in the following order: Standard, WebKit (Safari), and MS (IE11).
 */
// const closeFullscreen = () => {
//     if (document.exitFullscreen) {
//         // Chrome, Firefox, and new browsers that support the standard method
//         document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//         // Safari
//         document.webkitExitFullscreen();
//     } else if (document.msExitFullscreen) {
//         // IE11
//         document.msExitFullscreen();
//     }
// };
const closeFullscreen = () => {
    try {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    } catch (error) {
        console.error("Failed to exit full screen:", error);
    }
};

/**
 * Shuffles the keys of an object randomly.
 * Creates a new object with the same values but with randomly reordered keys.
 * 
 * @param {Object} obj - The object whose keys should be shuffled
 * @returns {Object} A new object with the same values but randomly reordered keys
 */
function shuffleKeys(obj) {
    // get keys of input object; Object.keys() method returns an array containing keys of the object
    let shuffledKeys = Object.keys(obj).sort(() => Math.random() - 0.5);
    let shuffledObj = {};
    shuffledKeys.forEach(function (key) {
        shuffledObj[key] = obj[key];
    });
    return shuffledObj;
}

/**
 * Calculates the percentage of trials completed in the experiment.
 * Uses global variables trialIterator and totalTrials to compute progress.
 * 
 * @returns {number} The percentage of trials completed, rounded to the nearest integer
 */
const calculatePercentComplete = () => {
    // const updatedTrials =
    //     typeof trials !== "undefined"
    //         ? trials
    //         : jsPsych.data.get().select("trials").values.slice(-1)[0]; // Replace 'score' with actual data key if necessary

    // Get the current trial index and divide by total number of trials
    let percentComplete = (trialIterator / totalTrials) * 100;
    // console.log("Percent Complete: ", percentComplete);
    return Math.round(percentComplete); // Round to the nearest integer
};

/**
 * Updates the width of a progress bar to reflect the confidence level in a trial.
 * Increments the bar's width up to a maximum of 100%. 
 *
 * @returns {number} The updated confidence level as a percentage of the progress bar's width.
 */
function moveConfidenceBasic() {
    let progressBar = document.getElementById("keyBar");
    let currentWidth = parseFloat(progressBar.style.width); // Get current width percentage

    if (currentWidth >= 100) {
        progressBar.style.width = "100%"; // Reset progress bar to 0%
        totalConfidence = 100;
    } else {
        const increment = 3.7;
        currentWidth = Math.min(currentWidth + increment, 100); // Cap increment at 100%
        progressBar.style.width = `${currentWidth}%`; // Update the progress bar's width
        totalConfidence = currentWidth; // Update total confidence level
        // trialComplete = 0;
    }
    // console.log("Confidence level: ", totalConfidence);
    return totalConfidence;
}

/**
 * Updates the width of a progress bar to reflect the confidence level in a trial.
 * Increments the bar's width up to a maximum of 100%. Once the progress bar reaches 100%,
 * it resets the bar to 0%, marks the trial as complete, and ends the trial.
 *
 * @returns {number} The updated confidence level as a percentage of the progress bar's width.
 */
function moveConfidence() {
    let progressBar = document.getElementById("keyBar");
    let currentWidth = parseFloat(progressBar.style.width); // Get current width percentage

    if (currentWidth >= 100) {
        progressBar.style.width = "0%"; // Reset progress bar to 0%
        totalConfidence = 100; // Set total confidence level to 100%
        // trialComplete = 1;
        jsPsych.finishTrial(); // Finish the trial if width reaches 100%
    } else {
        const increment = 3.7;
        currentWidth = Math.min(currentWidth + increment, 100); // Cap increment at 100%
        progressBar.style.width = `${currentWidth}%`; // Update the progress bar's width
        totalConfidence = currentWidth; // Update total confidence level
        // trialComplete = 0;
    }
    // console.log("Confidence level: ", totalConfidence);
    return totalConfidence;
}

/**
 * Updates the width of a progress bar to reflect the confidence level in a trial.
 * Increments the bar's width up to a maximum of 100%. Once the progress bar reaches 100%,
 * it resets the bar to 0%, marks the trial as complete, and ends the trial.
 *
 * @returns {number} The updated confidence level as a percentage of the progress bar's width.
 */

function moveConfidenceWithBeep() {
    let progressBar = document.getElementById("keyBar");
    let currentWidth = parseFloat(progressBar.style.width);
    let beep = document.getElementById("beep");

    if (currentWidth >= 100) {
        progressBar.style.width = "0%";
        totalConfidence = 100;
        beep.play(); // Play beep at 100%
        jsPsych.finishTrial();
    } else {
        const increment = 3.7;
        let newWidth = Math.min(currentWidth + increment, 100);
        progressBar.style.width = `${newWidth}%`;
        totalConfidence = newWidth;

        // Check for beep points
        if (currentWidth < 1 && newWidth >= 1) {
            beep.src = "stim/audio_tones/confidence.mp3";
            beep.play();
        } else if (currentWidth < 25 && newWidth >= 25) {
            beep.src = "stim/audio_tones/confidence_25.mp3";
            beep.play();
        } else if (currentWidth < 50 && newWidth >= 50) {
            beep.src = "stim/audio_tones/confidence_50.mp3";
            beep.play();
        } else if (currentWidth < 75 && newWidth >= 75) {
            beep.src = "stim/audio_tones/confidence_75.mp3";
            beep.play();
        } else if (currentWidth < 99 && newWidth >= 99) {
            beep.src = "stim/audio_tones/confidence_100.mp3";
            beep.play();
        }
    }

    return totalConfidence;
}

/**
 * Handles key press events to dynamically update the confidence bar based on user input.
 * This function sets up event listeners on a specified text box to detect and manage keydown and keyup events,
 * adjusting the confidence level accordingly. The function assumes the presence of a progress bar (`barFill`)
 * and a text input (`tapTapElement`) in the DOM.
 *
 * When keys '0' (key code 48) or '1' (key code 49) are pressed, it either increases or maintains a level of
 * 'totalConfidence' and updates the display through `moveConfidenceBasic()`. The function ensures the UI elements
 * are properly focused and handles the key events to prevent default behaviors and stop event propagation.
 */
function buttonPressBasic() {
    const barFill = document.getElementById("fillUp");
    if (barFill) {
        barFill.innerHTML = responseOptions; // Assuming 'responseOptions' is defined
    }
    const tapTapElement = document.getElementById("tapTap");
    if (tapTapElement) {
        tapTapElement.focus(); // Focus on the text box to capture key events
        let keyHeld48 = false;
        let keyHeld49 = false;

        const handleKeyPress = (keycode, isKeyDown) => {
            if (keycode === 48) {
                keyHeld48 = isKeyDown;
            } else if (keycode === 49) {
                keyHeld49 = isKeyDown;
            }
            responseKey = keycode;

            if (keyHeld48 || keyHeld49) {
                totalConfidence = moveConfidenceBasic();
            }
        };

        $(tapTapElement).keydown(function (event) {
            const keycode = event.which;
            if (keycode === 48 || keycode === 49) {
                handleKeyPress(keycode, true);
                event.preventDefault(); // Prevent default action and stop propagation
            }
        });

        $(tapTapElement).keyup(function (event) {
            const keycode = event.which;
            if (keycode === 48 || keycode === 49) {
                handleKeyPress(keycode, false);
                event.preventDefault(); // Prevent default action and stop propagation
            }
        });
    }
}

/**
 * Handles key press events to dynamically update the confidence bar based on user input.
 * This function sets up event listeners on a specified text box to detect and manage keydown and keyup events,
 * adjusting the confidence level accordingly. The function assumes the presence of a progress bar (`barFill`)
 * and a text input (`tapTapElement`) in the DOM.
 *
 * When keys '0' (key code 48) or '1' (key code 49) are pressed, it either increases or maintains a level of
 * 'totalConfidence' and updates the display through `moveConfidence()`. The function ensures the UI elements
 * are properly focused and handles the key events to prevent default behaviors and stop event propagation.
 */
function buttonPress() {
    const barFill = document.getElementById("fillUp");
    if (barFill) {
        barFill.innerHTML = responseOptions; // Assuming 'responseOptions' is defined
    }
    const tapTapElement = document.getElementById("tapTap");
    if (tapTapElement) {
        tapTapElement.focus(); // Focus on the text box to capture key events
        let keyHeld48 = false;
        let keyHeld49 = false;

        const handleKeyPress = (keycode, isKeyDown) => {
            if (keycode === 48) {
                keyHeld48 = isKeyDown;
            } else if (keycode === 49) {
                keyHeld49 = isKeyDown;
            }
            responseKey = keycode;

            if (keyHeld48 || keyHeld49) {
                totalConfidence = moveConfidence();
            }
        };

        $(tapTapElement).keydown(function (event) {
            const keycode = event.which;
            if (keycode === 48 || keycode === 49) {
                handleKeyPress(keycode, true);
                event.preventDefault(); // Prevent default action and stop propagation
            }
        });

        $(tapTapElement).keyup(function (event) {
            const keycode = event.which;
            if (keycode === 48 || keycode === 49) {
                handleKeyPress(keycode, false);
                event.preventDefault(); // Prevent default action and stop propagation
            }
        });
    }
}

/**
 * Handles key press events to dynamically update the confidence bar based on user input.
 * This function sets up event listeners on a specified text box to detect and manage keydown and keyup events,
 * adjusting the confidence level accordingly. The function assumes the presence of a progress bar (`barFill`)
 * and a text input (`tapTapElement`) in the DOM.
 *
 * Parameters:
 *   key1 - The key code for the first key to monitor.
 *   key2 - The key code for the second key to monitor.
 *
 * This function ensures the UI elements are properly focused and handles the key events to prevent
 * default behaviors and stop event propagation.
 */
function buttonPressWithArguments(key1, key2, beep) {
    console.log("Trial loaded"); // Debug: Check if the trial is loading

    const barFill = document.getElementById("fillUp");
    if (barFill) {
        barFill.innerHTML = responseOptions; // Assuming 'responseOptions' is defined
        console.log("Bar fill set"); // Debug: Check if bar fill is set
    } else {
        console.log("Bar fill element not found"); // Debug: Check if element exists
    }

    const tapTapElement = document.getElementById("tapTap");
    if (tapTapElement) {
        tapTapElement.focus(); // Focus on the text box to capture key events
        console.log("Focus set on tapTap element"); // Debug: Check if focus is set

        let keyHeld1 = false;
        let keyHeld2 = false;

        const handleKeyPress = (keycode, isKeyDown) => {
            console.log(`Key ${keycode} ${isKeyDown ? "pressed" : "released"}`); // Debug: Log key press/release

            if (keycode === key1) {
                keyHeld1 = isKeyDown;
                console.log(`${String.fromCharCode(key1)} key held:`, keyHeld1); // Debug: Check key1 state
            } else if (keycode === key2) {
                keyHeld2 = isKeyDown;
                console.log(`${String.fromCharCode(key2)} key held:`, keyHeld2); // Debug: Check key2 state
            }
            responseKey = keycode;
            console.log("Response key:", responseKey); // Debug: Log response key

            if (keyHeld1 || keyHeld2) {
                if (beep) {
                    totalConfidence = moveConfidenceWithBeep();
                }
                if (!beep) {
                    totalConfidence = moveConfidence();
                }
                console.log("Total confidence:", totalConfidence); // Debug: Log confidence
            }
        };

        $(tapTapElement).keydown(function (event) {
            const keycode = event.which;
            console.log("Keydown event:", keycode); // Debug: Log keydown event
            if (keycode === key1 || keycode === key2) {
                handleKeyPress(keycode, true);
                event.preventDefault(); // Prevent default action and stop propagation
            }
        });

        $(tapTapElement).keyup(function (event) {
            const keycode = event.which;
            console.log("Keyup event:", keycode); // Debug: Log keyup event
            if (keycode === key1 || keycode === key2) {
                handleKeyPress(keycode, false);
                event.preventDefault(); // Prevent default action and stop propagation
            }
        });
    } else {
        console.log("tapTap element not found"); // Debug: Check if element exists
    }
}

/**
 * Determines whether a progress message should be displayed based on completion percentage.
 * Shows messages at 25%, 50%, and 75% completion points.
 * 
 * @returns {boolean} True if the current completion percentage is 25%, 50%, or 75%, false otherwise
 */
const shouldShowProgressMessage = () => {
    // Show the message after every 25% completion
    let percentComplete = calculatePercentComplete();
    // console.log("Percent Complete: ", percentComplete);
    return [25, 50, 75].includes(percentComplete); // Show the message at 25%, 50%, and 75%
};

/**
 * Populates a select element with options and autopopulates if there's only one option
 * @param {HTMLSelectElement} selectElement - The select element to populate
 * @param {string[]} options - Array of option values
 */
function populateAndAutofillSelect(selectElement, options) {
    selectElement.innerHTML = '<option value="">---</option>';
    options.forEach((option) => {
        const optionElement = new Option(option, option);
        selectElement.add(optionElement);
    });

    if (options.length === 1) {
        selectElement.value = options[0];
        selectElement.disabled = true;
    }
}

// Event listener for include/intake.php
document.addEventListener("DOMContentLoaded", (event) => {
    // Check if the query string is empty, which means we are in intake mode
    if (!location.search) {
        // Log an error message to inform the user to add relevant info to exp/conf.js
        console.error(
            `Intake settings are not defined. Please ensure intake object is added to exp/conf.js:
            // Intake Settings
            const intake = {
                subject: {
                    minLength: 5,
                    maxLength: 5,
                    prefix: "VIP",
                },
                sites: ["Yale", "Vanderbilt"],
                phenotypes: ["hc", "sz"],
                visits: ["1", "2"],
                weeks: ["1", "3"],
            };`
        );

        // Populate and autofill 'site' select element
        const siteSelectElement = document.getElementById("site");
        if (siteSelectElement) {
            populateAndAutofillSelect(siteSelectElement, intake.sites);
        }

        // Populate and autofill 'phenotype' select element
        const phenotypeSelectElement = document.getElementById("phenotype");
        if (phenotypeSelectElement) {
            populateAndAutofillSelect(
                phenotypeSelectElement,
                intake.phenotypes
            );
        }

        // Populate and autofill 'visit' select element
        const visitSelectElement = document.getElementById("visit");
        if (visitSelectElement) {
            populateAndAutofillSelect(visitSelectElement, intake.visits);
        }

        // Populate and autofill 'week' select element
        const weekSelectElement = document.getElementById("week");
        if (weekSelectElement) {
            populateAndAutofillSelect(weekSelectElement, intake.weeks);
        }
    }

    // Configure 'subject' input field
    const subjectElement = document.getElementById("subject");
    if (subjectElement) {
        subjectElement.setAttribute("minlength", intake.subject.minLength);
        subjectElement.setAttribute("maxlength", intake.subject.maxLength);
        subjectElement.setAttribute("placeholder", intake.subject.prefix);
        subjectElement.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    }

    const intakeForm = document.getElementById("intake");

    // Dynamically add 'visit' field if not already present
    if (
        intake.visits &&
        intake.visits.length > 0 &&
        !document.getElementById("visit")
    ) {
        const visitHtml = `
            <h4 style="color:black"><label for="visit">Visit:</label></h4>
            <select name="visit" id="visit" class="custom-select">
                <option value="">---</option>
                ${intake.visits
                    .map(
                        (visit) => `<option value="${visit}">${visit}</option>`
                    )
                    .join("")}
            </select>
        `;
        intakeForm.insertAdjacentHTML("beforeend", visitHtml);
        const newVisitSelect = document.getElementById("visit");
        populateAndAutofillSelect(newVisitSelect, intake.visits);
    }

    // Dynamically add 'week' field if not already present
    if (
        intake.weeks &&
        intake.weeks.length > 0 &&
        !document.getElementById("week")
    ) {
        const weekHtml = `
            <h4 style="color:black"><label for="week">Week:</label></h4>
            <select name="week" id="week" class="custom-select">
                <option value="">---</option>
                ${intake.weeks
                    .map((week) => `<option value="${week}">${week}</option>`)
                    .join("")}
            </select>
        `;
        intakeForm.insertAdjacentHTML("beforeend", weekHtml);
        const newWeekSelect = document.getElementById("week");
        populateAndAutofillSelect(newWeekSelect, intake.weeks);
    }
});

/**
 * Tests the data saving functionality using a test string.
 * Attempts to save test data and returns success status.
 * 
 * @returns {Promise<boolean>} Resolves to true if save was successful, false otherwise
 */
async function testDataSave() {
    try {
        // Instead of using jsPsych.data.get().csv(), we'll just use a test string
        const testData = "This is a test save";
        const response = await saveDataPromise(
            `${experimentAlias}_${subjectId}`,
            testData
        );

        console.log("Data saved successfully.", response);
        return response.success;
    } catch (error) {
        console.error("Failed to save data.", error);
        return false;
    }
}

/**
 * Saves experiment data to CSV and handles redirect after completion.
 * Gets final score and earnings, displays thank you message, saves data using saveDataPromise,
 * and optionally redirects to a survey link.
 * 
 * @async
 * @function
 * @side-effects {DOM} Updates page content with success/failure message
 * @side-effects {Storage} Saves experimental data to CSV file
 * @side-effects {Navigation} May redirect to another URL after 5 seconds
 */
async function writeCsvRedirect() {
    const updatedScore =
        typeof score !== "undefined"
            ? score
            : jsPsych.data.get().select("score").values.slice(-1)[0]; // Replace 'score' with actual data key if necessary

    const updatedEarnings =
        typeof earnings !== "undefined"
            ? earnings
            : jsPsych.data.get().select("earnings").values.slice(-1)[0];

    console.log("updated earnings", updatedEarnings);

    // Now, generate the thank you message with the updated score
    const thankYou = instructions[instructions.length - 1](
        updatedScore,
        updatedEarnings
    );

    saveDataPromise(`${experimentAlias}_${subjectId}`, jsPsych.data.get().csv())
        .then((response) => {
            // response will tell us if data has been saved on server
            console.log("Data saved successfully.", response);
            // Update the stimulus content directly via DOM manipulation
            document.querySelector("#jspsych-content").innerHTML = thankYou;
            if (redirectLink) {
                setTimeout(() => {
                    window.location.replace(redirectLink); // redirect to qualtrics survey link after a delay of 5s
                }, 5000);
            }
        })
        .catch((error) => {
            console.error("Failed to save data.", error);
            // Check if the error object has 'error' property and use it, otherwise convert object to string
            let errorMessage = error.error || JSON.stringify(error);
            switch (errorMessage) {
                case '{"success":false}':
                    errorMessage = `The ./data directory does not exit on this server.`;
                    break;
                case "Not Found":
                    errorMessage = `There was an error saving the file to disk.`;
                    break;
                default:
                    errorMessage = "Unknown error.";
            }
            // Update the stimulus content directly via DOM manipulation
            const dataFailure = `
            <div class="error-page">
                <p>Oh no!</p>
                <p>An error has occured and your data has not been saved:</p>
                <p>${errorMessage}</p>
                <p>Please wait for the experimenter to continue.</p>
            </div>`;
            document.querySelector("#jspsych-content").innerHTML = dataFailure;
        })
        .finally(() => {
            document.getElementById("unload").onbeforeunload = ""; // Removes popup
            $("body").addClass("showCursor"); // Returns cursor functionality
            closeFullscreen(); // Kill fullscreen
        });
}

/**
 * Saves experiment data to MongoDB and handles redirect after completion.
 * Gets final score and earnings, displays thank you message, saves data to MongoDB,
 * and optionally redirects to a survey link.
 * 
 * @async
 * @function
 * @side-effects {DOM} Updates page content with success/failure message
 * @side-effects {Storage} Saves experimental data to MongoDB
 * @side-effects {Navigation} May redirect to another URL after 5 seconds
 */
async function writeMongoRedirect() {
    const updatedScore =
        typeof score !== "undefined"
            ? score
            : jsPsych.data.get().select("score").values.slice(-1)[0];

    const updatedEarnings =
        typeof earnings !== "undefined"
            ? earnings
            : jsPsych.data.get().select("earnings").values.slice(-1)[0];

    console.log("updated earnings", updatedEarnings);

    // Generate the thank you message with the updated score and earnings
    const thankYou = instructions[instructions.length - 1](
        updatedScore,
        updatedEarnings
    );

    try {
        // Await the saveMongo call to ensure data is saved before proceeding
        const response = await saveMongo();
        console.log("Data saved successfully to MongoDB.", response);

        // Display thank you message on the page
        document.querySelector("#jspsych-content").innerHTML = thankYou;
        if (redirectLink) {
            setTimeout(() => {
                window.location.replace(redirectLink); // Redirect after 5 seconds
            }, 5000);
        }
    } catch (error) {
        console.error("Failed to save data to MongoDB.", error);

        // Process error message for user display
        let errorMessage = error.message || "Unknown error.";
        if (errorMessage === '{"success":false}') {
            errorMessage =
                "The ./data directory does not exist on this server.";
        } else if (errorMessage === "Not Found") {
            errorMessage = "There was an error saving the file to MongoDB.";
        }

        // Display error message to user
        const dataFailure = `
            <div class="error-page">
                <p>Oh no!</p>
                <p>An error has occurred and your data has not been saved:</p>
                <p>${errorMessage}</p>
                <p>Please wait for the experimenter to continue.</p>
            </div>`;
        document.querySelector("#jspsych-content").innerHTML = dataFailure;
    } finally {
        document.getElementById("unload").onbeforeunload = ""; // Removes unload warning
        $("body").addClass("showCursor"); // Show cursor again
        closeFullscreen(); // Exit fullscreen mode
    }
}

/**
 * Generates a feedback link based on the experiment version and URL configuration.
 *
 * @param {string} version - The current version of the experiment (e.g., "deck", "loss", "gain").
 * @param {Object} urlConfig - An object containing URL configurations for different versions.
 * @param {string} urlConfig.default - The default URL to use if no version-specific URL is found.
 * @param {string} [urlConfig.loss] - The URL to use for the "loss" version.
 * @param {string} [urlConfig.gain] - The URL to use for the "gain" version.
 * @returns {string|undefined} The generated feedback link with the appropriate identifier appended as a query parameter,
 *                             or undefined if no valid identifier is available.
 */
const redirectLink = getRedirectLink(version, urlConfig);

/**
 * Gets the current browser window size.
 * Checks multiple properties to ensure cross-browser compatibility.
 *
 * @returns {Object} An object containing viewport dimensions
 * @returns {number} returns.width - The viewport width in pixels
 * @returns {number} returns.height - The viewport height in pixels
 */
const getViewportSize = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
};

/**
 * Function from Brian Scholl's lab
 * Handles violations of experiment requirements like tab switching or exiting fullscreen.
 * Cleans up event listeners, displays termination message, and ends the experiment.
 * 
 * @returns {void} This function doesn't return a value
 * @side-effects {DOM} Replaces entire document body with termination message
 * @side-effects {Event} Removes window.beforeunload event listener
 * @side-effects {jsPsych} Calls jsPsych.endExperiment()
 */
const multitaskingViolation = () => {
    // Remove any beforeunload listeners
    window.onbeforeunload = null;
    
    // End the experiment immediately
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif; max-width: 600px; margin-left: auto; margin-right: auto;">
            <h2>Experiment Terminated</h2>
            <p>You switched tabs, clicked outside the browser, or exited fullscreen mode.</p>
            <p>Please refresh this browser page to start over.</p>
            <p style="color: #666; margin-top: 20px;">Note: Your progress was not saved.</p>
        </div>
    `;
    
    // End jsPsych
    jsPsych.endExperiment();
};
