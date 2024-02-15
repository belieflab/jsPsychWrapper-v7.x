/* start the experiment */

const startExperiment = () => {
    openFullscreen();
    jsPsych.run(timeline); // new jsPsychg 7.x syntax
};
// write .csv to data/ directory
const saveData = (name, data, callback) => {
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
};

function saveDataPromise(name, data) {
    return new Promise((resolve, reject) => {
        saveData(name, data, (isSuccessful, response) => {
            if (isSuccessful) {
                resolve(response); // Data saved successfully
            } else {
                reject(response); // Failed to save data
            }
        });
    });
}

// leave site? changes you made may not be saved
const areYouSure = () => {
    return "Write something clever here...";
};
// areYouSure();

// checks if string is empty, null, or undefined
const isEmpty = (str) => {
    return !str || !str.length;
};

const getParamFromURL = (name) => {
    // BELOW COURTESY OF GARY LUPYAN -- COPIED FROM
    // http://sapir.psych.wisc.edu/wiki/index.php/MTurk
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regexS = "[?&]" + name + "=([^&#]*)";
    const regex = new RegExp(regexS);
    const results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index lower than the current index
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const dataSaveAnimation = `
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

$(document).ready(() => {
    // Define the path to your language files based on the language variable
    const langFilePath = "wrap/include/lang/" + language + ".php";

    // Use jQuery's AJAX method to load the language-specific content dynamically
    $.ajax({
        url: langFilePath,
        success: (result) => {
            $("#consentForm").html(result);
        },
        error: () => {
            console.error("Failed to load language file.");
            // Handle failure: Maybe load a default language or display an error message
        },
    });
});

switch (theme) {
    case "dark":
        document.documentElement.classList.add("dark-theme"); // Adds the dark theme
        break;
    case "light":
        document.documentElement.classList.add("light-theme"); // Adds the white theme
        break;
    default:
        document.documentElement.classList.add("light-theme"); // Adds the white theme
        break;
}
