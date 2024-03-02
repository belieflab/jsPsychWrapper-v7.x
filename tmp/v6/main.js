"use strict";

// main order in which things are pushed to timeline

timeline.push(config);
timeline.push(welcome);
timeline.push(...instructionSet);
timeline.push(procedure);
timeline.push(dataSave);

// don't allow experiment to start unless subjectId is set
if (subjectId) {
    // Old jsPsych 6.3 syntax
    startExperiment();
}
