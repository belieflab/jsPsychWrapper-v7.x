"use strict";

// main order in which things are pushed to timeline
timeline.push(preload);
timeline.push(config);
timeline.push(welcome);
timeline.push(...instructionSet);
timeline.push(procedure);
timeline.push(dataSave);

// don't allow experiment to start unless subjectId is set
if (subjectId) {
    // New jsPsych 7.x syntax
    jsPsych.run(timeline);
}
