// Identifier configuration
const identifierConfig = [
    { type: "workerId", value: workerId },
    { type: "PROLIFIC_PID", value: PROLIFIC_PID },
    { type: "participantId", value: participantId },
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
    const baseUrl = urlConfig[version] || urlConfig.default;
    return `${baseUrl}?${identifierType}=${identifier}`;
}
