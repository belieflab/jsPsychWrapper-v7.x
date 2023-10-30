const jsPsych = initJsPsych({
    show_progress_bar: true,
    preload_video: [],
    preload_audio: [],
    preload_images: [],
});

const timeline = [];

/*define instructions*/
const instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <p> Hello Ivy! Welcome to the server side experiment!</p>
    <p> In this experiment you will be presented with the words red and green. Please press the key "y" if the word is congruent or "n" if the word is incongruent </p>
    <p> Press Space to continue. </p>
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
        workerId: workerId,
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
    on_finish: () => {
        saveData(experimentAlias + "_" + subjectId, jsPsych.data.get().csv()); //function with file name and which type of file as the 2 arguments
        document.getElementById("unload").onbeforeunload = ""; //removes popup (are you sure you want to exit) since data is saved now
        // returns cursor functionality
        $(document).ready(function () {
            $("body").addClass("showCursor"); // returns cursor functionality
            closeFullscreen(); // kill fullscreen
        });
    },
};

const end = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        "<p style='color:white;'>Thank you!</p>" +
        "<p style='color:white;'>You have successfully completed the experiment and your data has been saved.</p>" +
        // "<p style='color:white;'>To leave feedback on this task, please click the following link:</p>"+
        // "<p style='color:white;'><a href="+feedbackLink+">Leave Task Feedback!</a></p>"+
        // "<p style='color:white;'>Please wait for the experimenter to continue.</p>"+
        "<p style='color:white;'><i>You may now close the expriment window at anytime.</i></p>",
    choices: "NO_KEYS",
    // on_load: function() {
    //   alert(reward);
    // }
};

$.getScript("exp/main.js");
