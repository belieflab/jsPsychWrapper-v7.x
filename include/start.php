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

function participantRandomization(inputString) {
    let digits = inputString.match(/\d/g);
    let sum = digits ? digits.reduce((acc, digit) => acc + parseInt(digit), 0) : 0;
    return sum % 4;
}


  // Call your JavaScript function here
  $.getScript('exp/timeline.js', function() {
    validateStart();
  });
</script>