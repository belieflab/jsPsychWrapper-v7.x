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
// Function to get feedback link
function getRedirectLink(version, urlConfig) {
    if (!identifier || !identifierType) return undefined;

    // Calculate the phase based on the identifier if not already set
    if (counterbalance && !phase) {
        phase = counterbalanceParticipants(identifier, remainder);
    }

    let redirectPath;

    if (version === "default") {
        redirectPath = urlConfig.default;
    } else if (urlConfig[version] && urlConfig[version][phase] !== undefined) {
        redirectPath = urlConfig[version][phase];
    } else {
        redirectPath = urlConfig.default;
    }

    let link = `${redirectPath}?${identifierType}=${identifier}`;

    if (phase || phase > -1) {
        link += `&phase=${phase}`;
    }

    return link;
}
