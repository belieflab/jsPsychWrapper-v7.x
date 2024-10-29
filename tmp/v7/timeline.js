"use strict";

const jsPsych = initJsPsych({
    show_progress_bar: true,
});

const timeline = [];

const preload = {
    type: jsPsychPreload,
    images: [],
    show_detailed_errors: true,
};

/*define instructions*/

const config = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: instructions[0],
    key_forward: " ",
};

const welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: instructions[1],
    on_load: () => handleFullscreen(),
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
    on_finish: writeCsvRedirect,
};

// Load and execute "exp/main.js" using jQuery's $.getScript method.
$.getScript("exp/main.js");
