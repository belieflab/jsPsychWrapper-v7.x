// main order in which things are pushed to timeline

timeline.push(config);
timeline.push(welcome);
timeline.push(...instructionSet);
timeline.push(procedure);
timeline.push(dataSave);

// Old jsPsych 6.3 syntax
startExperiment();