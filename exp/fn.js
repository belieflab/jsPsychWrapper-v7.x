/* start the experiment */

const startExperiment = () => {
    openFullscreen();
    jsPsych.run(timeline); // new syntax
};
// write .csv to data/ directory
const saveData = (name, data) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "index.php"); // 'index.php' contains the php script described above
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            filename: name,
            filedata: data,
        })
    );
};

// leave site? changes you made may not be saved
const areYouSure = () => {
    return "Write something clever here...";
};
// areYouSure();

// checks if string is empty, null, or undefined
const isEmpty = (str) => {
    return !str || !str.length;
};

function getParamFromURL(name) {
    // BELOW COURTESY OF GARY LUPYAN -- COPIED FROM
    // http://sapir.psych.wisc.edu/wiki/index.php/MTurk
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
}
// translate consent button
function translate() {
    let consent;
    let load;
    switch (language) {
        case "english":
            consent = "CONSENT";
            load = "LOAD";
            break;

        case "french":
            consent = "CONSENTEMENT";
            load = "CHARGE";
            break;

        case "german":
            consent = "ZUSTIMMUNG";
            load = "BELASTUNG";
            break;
    }

    document.getElementById("submitButton").innerHTML = consent;
    document.getElementById("nextButton").innerHTML = load;
}
