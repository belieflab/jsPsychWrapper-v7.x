"use strict";

// 1. FIRST: Initialize jsPsych
var jsPsych = initJsPsych();

// 2. SECOND: Create timeline
var timeline = [];

// 3. THIRD: Push elements to timeline
timeline.push(preload);
timeline.push(config);
timeline.push(welcome);
timeline.push(...instructionSet);
timeline.push(procedure);
timeline.push(dataSave);

// 4. Run the experiment
if (subjectId) {
    jsPsych.run(timeline);
}