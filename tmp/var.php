<!-- Purpose of var.js: To include all global variables (e.g., trialIterator) -->
<!-- And any php server side logic -->

<?php
// include any php code here
?>


<!-- define all javascript globals here -->

<script>
"use strict";

let trialIterator = 0;

let score = 0;

/*define stroop_variables(stroop stimuli)*/
const stroopVariables = [
    { colour: "red", text: "red", condition: "congruent" },
    { colour: "red", text: "green", condition: "incongruent" },
];

const trials = stroopVariables.length;
const blocks = 1;

const totalTrials = trials * blocks;

</script>

