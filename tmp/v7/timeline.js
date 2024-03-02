"use strict";

const jsPsych = initJsPsych({
    show_progress_bar: true,
});

const timeline = [];

/*define instructions*/

const config = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: instructions[0],
    key_forward: " ",
};

const welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: instructions[1],
    key_forward: " ",
};

const instruction1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: instructions[2],
    key_forward: ["y", "n"],
};

const instructionSet = [instruction1];

/*add fixation*/
const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "+",
    trial_duration: 1000,
    response_ends_trial: false,
};

/*initialize the trails array with the instructions trial and loop through each stroop variable defined in stroop variable, also add the fixation trial to the trials array for each stroop variable*/
const trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => {
        return (
            '<p style="color: ' +
            jsPsych.timelineVariable("colour", true) +
            '">' +
            jsPsych.timelineVariable("text", true) +
            "</p>"
        );
    },
    choices: ["n", "y"],
    data: {
        colour: jsPsych.timelineVariable("colour"),
        text: jsPsych.timelineVariable("text"),
        condition: jsPsych.timelineVariable("condition"),
        subjectId: subjectId,
        interview_date: interview_date,
    },
};

/*define procedure*/
const procedure = {
    timeline: [fixation, trial],
    timeline_variables: stroopVariables,
    repetitions: getRepetitions(),
};

const dataSave = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: dataSaveAnimation(),
    choices: "NO_KEYS",
    trial_duration: 5000,
    on_finish: () => {
        const updatedScore =
            typeof score !== "undefined"
                ? score
                : jsPsych.data.get().select("score").values.slice(-1)[0]; // Replace 'score' with actual data key if necessary

        // Now, generate the thank you message with the updated score
        const thankYou = instructions[3](updatedScore);

        saveDataPromise(
            `${experimentAlias}_${subjectId}`,
            jsPsych.data.get().csv()
        )
            .then((response) => {
                console.log("Data saved successfully.", response);
                // Update the stimulus content directly via DOM manipulation
                document.querySelector("#jspsych-content").innerHTML = thankYou;
            })
            .catch((error) => {
                console.log("Failed to save data.", error);
                // Check if the error object has 'error' property and use it, otherwise convert object to string
                let errorMessage = error.error || JSON.stringify(error);
                switch (errorMessage) {
                    case '{"success":false}':
                        errorMessage =
                            "The ./data directory does not exit on this server.";
                        break;
                    case "Not Found":
                        errorMessage =
                            "There was an error saving the file to disk.";
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
                document.querySelector("#jspsych-content").innerHTML =
                    dataFailure;
            })
            .finally(() => {
                document.getElementById("unload").onbeforeunload = ""; // Removes popup
                $("body").addClass("showCursor"); // Returns cursor functionality
                closeFullscreen(); // Kill fullscreen
            });
    },
};

// Load and execute "exp/main.js" using jQuery's $.getScript method.
$.getScript("exp/main.js");
