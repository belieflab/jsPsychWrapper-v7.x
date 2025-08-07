<!-- style="background-color:lightgray; text-align:center; margin:35px; vertical-align:middle" -->
<div class="screening">
<br>
<h1 style="text-align:center;">Participant Intake</h1>

  <form>
    <h4 style="color:black">Which is your dominant hand?</h4>

    <label class="custom-radio-button">Left
      <input type="radio" name="handedness" value="left" id="left">
      <span class="checkmark"></span>
    </label>

    <label class="custom-radio-button">Right
      <input type="radio" name="handedness" value="right" id="right">
      <span class="checkmark"></span>
    </label>

    <button id="submitButton" class="loadMain" onclick="validateStart()" type="button">SUBMIT</button>

    <h5><?php echo gitCommitHash();?></h5>

  </form>

</div>

<!-- At the end of start.php, just before the closing </div> tag -->
<script>

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

// Initialize page when DOM is loaded - but DON'T load experiment scripts yet
document.addEventListener('DOMContentLoaded', function() {
    console.log("START page loaded, waiting for user to submit form");
    // Only run initial page setup here, not experiment loading
});
</script>