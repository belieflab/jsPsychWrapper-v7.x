// "use strict";

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
    switch (debug) {
        case true:
            $(document).ready(() => {
                $("body").addClass("showCursor");
            });
            break;
        case false:
            $(document).ready(() => {
                $("body").addClass("hideCursor");
            });
            break;
    }
    // Hide progress bar from screen
    document.getElementById("jspsych-progressbar-container").style.visibility =
        "hidden";
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
    callback
) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "data.php");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            // console.log(xhr.responseText); // Log the response text
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    callback(response.success, response);
                } catch (e) {
                    // Handle parsing error
                    console.error("Parsing error:", e);
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
 * Randomly shuffles the elements of an array in place using the Fisher-Yates (also known as Durstenfeld) shuffle algorithm.
 * This method iterates over the array from the last element to the first, swapping each element with another random element
 * that comes before it (including itself). This ensures each element has an equal probability of ending up in any position.
 *
 * Note: This function modifies the original array directly (in-place). If you need to retain the original array,
 * consider making a copy of it before calling this function.
 *
 * @param {Array} array - The array to be shuffled. This should be an array of any type or a mix of types.
 *
 * @returns {Array} The same array that was passed in, shuffled randomly.
 *
 * Usage example:
 * const myArray = [1, 2, 3, 4, 5];
 * shuffleArray(myArray);
 * console.log(myArray); // Could be [3, 1, 5, 2, 4] or any other permutation
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index lower than the current index
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
                break;

            case "german":
                consent = "ZUSTIMMUNG";
                break;

            default: // Default case for English and unsupported languages
                consent = "CONSENT";
                break;
        }

        // Update the webpage elements with the translated text
        document.getElementById("consentButton").innerHTML = consent; // Update consent button
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

        const switchToProduction = confirm(
            "WARNING: This task is currently in debug mode, meaning all trials will not be administered and the data will be unusable! Do you want to switch to production mode instead?"
        );

        if (switchToProduction) {
            debug = false; // Update the debug state
            openFullscreen(); // Additional actions for switching to production mode
        }
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
            const switchToProduction = confirm(
                "WARNING: This task is currently in debug mode, meaning all trials will not be administered and the data will be usable for analysis. Do you want to switch to production mode instead?"
            );

            // Update the debug mode based on user confirmation.
            if (switchToProduction) {
                debug = false; // Switch to production mode.
                // Add any specific actions required when switching to production mode, like opening fullscreen.
                openFullscreen();
            } else {
                // If the user cancels, return the current repetitions without re-invoking the function.
                return debug
                    ? shuffleArray(timelineVariables).slice(0, 1)
                    : shuffleArray(timelineVariables);
            }
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
        document.documentElement.classList.add("light-white"); // Adds the white theme
        break;
    default:
        document.documentElement.classList.add("light-theme"); // Adds the white theme
        break;
}

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

function shuffleKeys(obj) {
    // get keys of input object; Object.keys() method returns an array containing keys of the object
    let shuffledKeys = Object.keys(obj).sort(() => Math.random() - 0.5);
    let shuffledObj = {};
    shuffledKeys.forEach(function (key) {
        shuffledObj[key] = obj[key];
    });
    return shuffledObj;
}

// Define a function to calculate the percentage done
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

// Create a conditional function to decide whether to show the progress message
const shouldShowProgressMessage = () => {
    // Show the message after every 25% completion
    let percentComplete = calculatePercentComplete();
    // console.log("Percent Complete: ", percentComplete);
    return [25, 50, 75].includes(percentComplete); // Show the message at 25%, 50%, and 75%
};

document.addEventListener("DOMContentLoaded", (event) => {
    // Check if the query string is empty
    // this means we are in intake mode
    if (!location.search) {
        // Use the sites from config
        const selectElement = document.getElementById("site");

        sites.forEach((site) => {
            const option = new Option(site, site);
            selectElement.add(option);
        });
    }
});

document.addEventListener("DOMContentLoaded", (event) => {
    // Check if the query string is empty
    // this means we are in intake mode
    if (!location.search) {
        // Use the phenotypes from config
        const selectElement2 = document.getElementById("phenotype");

        phenotypes.forEach((phenotype) => {
            const option = new Option(phenotype, phenotype);
            selectElement2.add(option);
        });
    }
});

function loadTimeline() {
    var scriptUrl = '';

    if (version === "audio") {
        scriptUrl = 'exp/timeline-audio.js';
    } else if (version === "visual") {
        scriptUrl = 'exp/timeline-visual.js';
    } else {
      scriptUrl = 'exp/timeline.js';
    }

    $.getScript(scriptUrl)
        .done(function(script, textStatus) {
            console.log(textStatus);
        })
        .fail(function(jqxhr, settings, exception) {
            console.log("Script loading failed: " + exception);
        });
}