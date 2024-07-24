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

function counterbalanceParticipants(inputString) {
    let digits = inputString.match(/\d/g);
    let sum = digits ? digits.reduce((acc, digit) => acc + parseInt(digit), 0) : 0;
    return sum % 4;
}
// Run the test and load the experiment if successful
document.addEventListener('DOMContentLoaded', function() {
      testDataSave().then((result) => {
        if (!result) {
          alert("ERROR: Failed save data check.\nPlease make sure you are using Chrome, Firefox, or Safari.");
        }
        if (result) {
          $.getScript('exp/timeline.js', function() {
            validateStart();
          });
        }
      });
    });
</script>