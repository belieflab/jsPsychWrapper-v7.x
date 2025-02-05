// Function to get parameter from URL
function getParamFromUrl(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regexS = "[?&]" + name + "=([^&#]*)";
    const regex = new RegExp(regexS);
    const results = regex.exec(window.location.href);
    if (results == null) return undefined;
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Identifier configuration
const identifierConfig = [
    { type: "workerId", value: getParamFromUrl("workerId") },
    { type: "PROLIFIC_PID", value: getParamFromUrl("PROLIFIC_PID") },
    { type: "participantId", value: getParamFromUrl("participantId") },
];

// Function to determine the identifier and its type
function getIdentifierInfo() {
    for (const { type, value } of identifierConfig) {
        if (value) {
            return { type, value };
        }
    }
    return { type: null, value: null };
}

// Use the function to set identifier and identifierType
const { type: identifierType, value: identifier } = getIdentifierInfo();

// Function to get feedback link
function getRedirectLink(version, urlConfig) {
    if (!identifier || !identifierType) return undefined;

    // Default to "default" if version is not provided
    const selectedVersion = version || "default";

    // Check if urlConfig[selectedVersion] exists
    if (urlConfig[selectedVersion]) {
        // Check if urlConfig[selectedVersion] is nested (object) or not
        if (typeof urlConfig[selectedVersion] === "object") {
            // It's a nested structure, calculate the modulus based on the number of keys
            const modulus = Object.keys(urlConfig[selectedVersion]).length;

            // Calculate the phase based on the identifier if not already set
            if (counterbalance && !phase) {
                phase = counterbalanceParticipants(identifier, modulus);
            }

            // Select the redirect path based on phase
            redirectPath = urlConfig[selectedVersion][phase];
        } else {
            // It's not nested, use the flat link
            redirectPath = urlConfig[selectedVersion];
        }
    } else {
        console.error(`Version "${selectedVersion}" not found in urlConfig.`);
        // Fallback to the default redirect path if version not found
        redirectPath = urlConfig.default;
    }

    // Create the final redirect link
    let link = `${redirectPath}?${identifierType}=${identifier}`;

    // Include phase if it exists
    if (phase || phase > -1) {
        link += `&phase=${phase}`;
    }

    return link;
}

function handleFullscreen() {
    if (debug) {
        handleDebugSwitch();
    }

    if (!debug) {
        openFullscreen(); // Additional actions for switching to production mode
    }
}