const jsPsych = initJsPsych({
    show_progress_bar: true,
    preload_video: [],
    preload_audio: [],
    preload_images: [],
});

const timeline = [];

/*define instructions*/
const config = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        `
        <p>Hello!</p>
        <p>Please edit exp/conf.php to configure the experiment.</p>
        <p>You may set the experiment name: ` +
        experimentName +
        `</p>
        <p>Experiment alias: ` +
        experimentAlias +
        `</p>
        <p>And the language: ` +
        language +
        `</p>
        <p>You may also set other variables as you choose.</p>
        <p>Press Space to continue.</p>
    `,
    key_forward: " ",
};

const instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Welcome to the server-side experiment!</p>
        <p>In this experiment, you will be presented with the words red and green. Please press the key "y" if the word is congruent or "n" if the word is incongruent.</p>
        <p>Press Space to continue.</p>
    `,
    key_forward: " ",
};

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
        interview_date: today,
    },
};

/*define procedure*/
const procedure = {
    timeline: [fixation, trial],
    timeline_variables: stroopVariables,
};

const dataSave = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: dataSaveAnimation,
    choices: "NO_KEYS",
    trial_duration: 5000,
    on_finish: function () {
        saveDataPromise(
            experimentAlias + "_" + subjectId,
            jsPsych.data.get().csv()
        )
            .then((response) => {
                console.log("Data saved successfully.", response);
                // Update the stimulus content directly via DOM manipulation
                const thankYou = `
                <div class="body-white-theme">
                    <p>Thank you!</p>
                    <p>You have successfully completed the experiment and your data has been saved.</p>
                    <!-- <p>To leave feedback on this task, please click the following link:</p> -->
                    <!-- <p><a href="${feedbackLink}">Leave Task Feedback!</a></p> -->
                    <!-- <p>Please wait for the experimenter to continue.</p> -->
                    <p><i>You may now close the experiment window at any time.</i></p>
                </div>`;
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

$.getScript("exp/main.js");
