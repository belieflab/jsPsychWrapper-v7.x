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

    // Calculate the stage based on the identifier
    const stage = participantRandomization(identifier);

    let redirectPath;

    if (version === "default") {
        redirectPath = urlConfig.default;
    } else if (urlConfig[version] && urlConfig[version][stage] !== undefined) {
        redirectPath = urlConfig[version][stage];
    } else {
        redirectPath = urlConfig.default;
    }

    return `${redirectPath}?${identifierType}=${identifier}&stage=${stage}`;
}
