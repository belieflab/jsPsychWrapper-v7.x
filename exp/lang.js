// Translation
// This file contains the instructions for the experiment,
// which will be translated to the language specified in exp/conf.js

let instructions = [];

// Switch version to determine the instructions for the experiment and language
/**
 * Translates the text of instuctions, buttons, etc. based on the selected language.
 *
 * @param {string} version - The version of the task defined in exp/conf.js.
 *                           Default version is "standard".
 */
switch (version) {
    default:
        var english1 = `<p>Hello!</p>
        <p>Please edit exp/conf.php to configure the experiment.</p>
        <p>You may set the experiment name: ${experimentName}</p>
        <p>Experiment alias: ${experimentAlias} </p>
        <p>And the language: ${language}</p>
        <p>You may also set other variables as you choose.</p>
        <p>Press Space to continue.</p>`;

        var english2 = `
        <p>Welcome to the server-side experiment!</p>
        <p>In this experiment, you will be presented with the words red and green. Please press the key "y" if the word is congruent or "n" if the word is incongruent.</p>
        <p>Press Space to continue.</p>`;
        break;
}

// Aggregate the instructions of your language choice
// These will be bassed to the translate function
/**
 * Translates the text of instuctions, buttons, etc. based on the selected language.
 *
 * @param {language} version - The language of the task defined exp/conf.js.
 *                             Default language is English.
 */

switch (language) {
    default:
        instructions = [english1, english2];
        break;
}

// Translate the instructions to the specified language
translate(language, ...instructions);
