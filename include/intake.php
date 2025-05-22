<div class="screening" style="background-color:lightgray; text-align:center; margin:35px; vertical-align:middle">
<br>
<h1 style="text-align:center;">Participant Intake</h1>
  <div id="intake">
  <form>

  <div class="form-group">
    <p style="color:black; text-align:center;"><b>Research Site:</b></p>
    <select name="site" id="site" class="custom-select">
        <option value="">---</option>
    </select>
</div>

    <h4 style="color:black">Subject ID:</h4>
    <input required id="subject" type="text" name="subject" class="custom-input">
    
    <!-- GUID - only show if NIH study -->
    <div id="guid-container" style="display: none;">
        <h4 style="color:black">GUID:</h4>
        <input id="guid" type="text" name="guid" minlength="12" maxlength="12" oninput="this.value = this.value.toUpperCase()" class="custom-input">
    </div>

    <!-- DOB - only show if NIH study -->
    <div id="dob-container" style="display: none;">
        <h4 style="color:black"><label for="dob">Date of Birth:</label></h4>
        <input id="dob" type="date" class="custom-input">
    </div>

<div class="form-group">
<h4 style="color:black"><label for="phenotype">Phenotype:</label></h4>
    <select name="phenotype" id="phenotype" class="custom-select">
        <option value="">---</option>
    </select>
</div>

</div>

    <h4 style="color:black">Sex at Birth:</h4>

<label class="custom-radio-button">Male
  <input type="radio" id="male" name="sex" value="M" class="custom-radio">
  <span class="checkmark"></span>
</label>

<label class="custom-radio-button">Female
  <input type="radio" id="female" name="sex" value="F" class="custom-radio">
  <span class="checkmark"></span>
</label>

    <h4 style="color:black">Which is your dominant hand?</h4>

<label class="custom-radio-button">Left
  <input type="radio" name="handedness" value="left" id="left">
  <span class="checkmark"></span>
</label>

<label class="custom-radio-button">Right
  <input type="radio" name="handedness" value="right" id="right">
  <span class="checkmark"></span>
</label>

<button id="submitButton" class="loadMain" type="button">SUBMIT</button>

<h5><?php echo gitCommitHash();?></h5>

</form>

</div>


<script>
  document.addEventListener('DOMContentLoaded', function() {
    console.log("INTAKE PAGE LOADED: Ready for user input");
    restoreFormValues(); // Keep this to restore saved form values
    
    // Add event listener for submit button
    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
        submitButton.addEventListener("click", function() {
            // Ensure validateIntake function exists before calling
            if (typeof validateIntake === "function") {
                validateIntake();
            } else {
                console.error("validateIntake function not found");
                alert("Error: Validation function not loaded. Please refresh the page.");
            }
        });
    }
    
    // Show/hide GUID and DOB fields based on NIH configuration
    if (typeof intake !== 'undefined' && intake.nih === true) {
        console.log("NIH study detected - showing GUID and DOB fields");
        
        // Show and require GUID field
        const guidContainer = document.getElementById("guid-container");
        const guidInput = document.getElementById("guid");
        if (guidContainer && guidInput) {
            guidContainer.style.display = "block";
            guidInput.setAttribute("required", "required");
        }
        
        // Show and require DOB field
        const dobContainer = document.getElementById("dob-container");
        const dobInput = document.getElementById("dob");
        if (dobContainer && dobInput) {
            dobContainer.style.display = "block";
            dobInput.setAttribute("required", "required");
        }
    } else {
        console.log("Non-NIH study - GUID and DOB fields remain hidden");
    }
  });
</script>

<!-- Add this script at the end of intake.php, just before the closing </div> tag -->
<script>
  // Clear any previous validation state
  window.validateAlerts = [];
  
  // Ensure proper event handling for the submit button
  document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
      // Remove any existing click handlers to prevent duplicates
      const newButton = submitButton.cloneNode(true);
      submitButton.parentNode.replaceChild(newButton, submitButton);
      
      // Add a clean event handler
      newButton.addEventListener('click', function(event) {
        // Prevent the default button behavior
        event.preventDefault();
        
        // Reset validation alerts
        window.validateAlerts = [];
        
        // Call validation function
        if (typeof validateIntake === 'function') {
          validateIntake();
        } else {
          alert('Validation function not found. Please refresh the page.');
        }
      });
    }
  });
</script>