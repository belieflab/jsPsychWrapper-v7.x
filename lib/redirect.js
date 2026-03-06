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

    let redirectPath;
    const hasSelectedVersion =
        urlConfig && Object.prototype.hasOwnProperty.call(urlConfig, selectedVersion);
    const resolvedVersion = hasSelectedVersion ? selectedVersion : "default";

    if (!hasSelectedVersion) {
        console.error(`Version "${selectedVersion}" not found in urlConfig. Using "${resolvedVersion}".`);
    }

    // Check if resolved urlConfig exists
    if (urlConfig[resolvedVersion]) {
        // Check if urlConfig[selectedVersion] is nested (object) or not
        if (typeof urlConfig[resolvedVersion] === "object") {
            // It's a nested structure, calculate the modulus based on the number of keys

            // if modulus is not declared in conf, getRedirectLink() sets:
            if (typeof modulus === "undefined") {
                modulus = Object.keys(urlConfig[resolvedVersion]).length;
            }
            
            // if phase is not declared in conf, getRedirectLink() sets :
            if (typeof phase === "undefined") {
                phase = counterbalanceParticipants(identifier, modulus);        
            }

            // Select the redirect path based on phase
            redirectPath = urlConfig[resolvedVersion][phase];
            
        } else {
            // It's not nested, use the flat link
            redirectPath = urlConfig[resolvedVersion];
        }
    } else {
        console.error(`No redirect path could be resolved for "${selectedVersion}".`);
        return undefined;
    }

    // Create the final redirect link
    let link = `${redirectPath}?${identifierType}=${identifier}`;

    // Include phase if it exists
    if (
        typeof phase !== "undefined" &&
        phase !== null &&
        Number.isFinite(Number(phase)) &&
        Number(phase) > -1
    ) {
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
