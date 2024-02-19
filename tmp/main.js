// main order in which things are pushed to timeline

timeline.push(config);
timeline.push(welcome);
timeline.push(...instructionSet);
timeline.push(procedure);
timeline.push(dataSave);

// bypass validation phase if workerId, participantId, or PROLIFIC_PID is present in URL
if (
    getParamFromUrl("workerId") ||
    getParamFromUrl("participantId") ||
    getParamFromUrl("PROLIFIC_PID")
) {
    jsPsych.run(timeline); // no fullscreen; don't hide cursor
}
