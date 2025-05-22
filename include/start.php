<!-- consent.php -->
<div id="consentContent">
  <!-- Your consent form content here -->
</div>

<script>
  let handedness = undefined;

  // check to see what platform the reidrect is coming from based on Id
  

// Function to get parameter from URL
function getParamFromUrl(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regexS = "[?&]" + name + "=([^&#]*)";
    const regex = new RegExp(regexS);
    const results = regex.exec(window.location.href);
    if (results == null)
        return undefined;
    else 
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function counterbalanceParticipants(inputString, modulus) {
    let digits = inputString.match(/\d/g);
    let sum = digits ? digits.reduce((acc, digit) => acc + parseInt(digit), 0) : null;
    
    return sum === null ? (alert(`The ${identifierType} must contain digits for counterbalancing.\nCounterbalancing is disabled. If you would like to continue, only the first redirect condition will be used as fallback: ${urlConfig[version][0]}`), null) : sum % modulus;
  }

// Run the test and load the experiment if successful
  // Run the test and load the experiment if successful
  document.addEventListener('DOMContentLoaded', function() {
      testDataSave().then((result) => {
        if (result) {
          // First load var.js
          $.getScript('exp/var.js', function() {
            // Then load timeline.js
            $.getScript('exp/timeline.js');
          });
        } else {
          alert("ERROR: Failed save data check.\nPlease make sure you are using Chrome, Firefox, or Safari.");
        }
      });
    });
</script>