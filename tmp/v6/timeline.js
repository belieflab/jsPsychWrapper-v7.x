"use strict";

startExperiment = () => {
    jsPsych.init({
        timeline: timeline,
        show_progress_bar: true,
        preload_images: [],
        preload_audio: [],
        preload_video: [],
    });
};

const timeline = [];

/*define instructions*/

const config = {
    type: "html-keyboard-response",
    stimulus: instructions[0],
    key_forward: " ",
};

const welcome = {
    type: "html-keyboard-response",
    stimulus: instructions[1],
    key_forward: " ",
};

const instruction1 = {
    type: "html-keyboard-response",
    stimulus: instructions[2],
    key_forward: ["y", "n"],
};

const instructionSet = [instruction1];

/*add fixation*/
const fixation = {
    type: "html-keyboard-response",
    stimulus: "+",
    trial_duration: 1000,
    response_ends_trial: false,
};

/*initialize the trails array with the instructions trial and loop through each stroop variable defined in stroop variable, also add the fixation trial to the trials array for each stroop variable*/
const trial = {
    type: "html-keyboard-response",
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
    data: () => {
        return {
            colour: jsPsych.timelineVariable("colour", true),
            text: jsPsych.timelineVariable("text", true),
            condition: jsPsych.timelineVariable("condition", true),
            subjectId: subjectId,
            interview_date: interview_date,
        };
    },
};

/*define procedure*/
const procedure = {
    timeline: [fixation, trial],
    timeline_variables: stroopVariables,
    repetitions: getRepetitions(),
};

const dataSave = {
    type: "html-keyboard-response",
    stimulus: dataSaveAnimation(),
    choices: "NO_KEYS",
    trial_duration: 5000,
    on_finish: writeCsvRedirect,
};

// Load and execute "exp/main.js" using jQuery's $.getScript method.
$.getScript("exp/main.js");
