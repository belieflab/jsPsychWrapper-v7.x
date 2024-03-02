"use strict";

// main order in which things are pushed to timeline

timeline.push(config);
timeline.push(welcome);
timeline.push(...instructionSet);
timeline.push(procedure);
timeline.push(dataSave);

// New jsPsych 7.x syntax
jsPsych.run(timeline);
