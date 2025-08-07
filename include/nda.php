
<!-- style="background-color:lightgray; text-align:center; margin:35px; vertical-align:middle" -->
<div class="screening">
<br>
<h1 style="text-align:center;">Participant Intake</h1>

  <!-- <div id="intake"> -->
    

  <form>

  <!-- <div class="custom-radio-container"> -->
    <h4 style="color:black">Which is your dominant hand?</h4>

<label class="custom-radio-button">Left
  <input type="radio" name="handedness" value="left" id="left">
  <span class="checkmark"></span>
</label>

<label class="custom-radio-button">Right
  <input type="radio" name="handedness" value="right" id="right">
  <span class="checkmark"></span>
</label>




<!-- </div> -->


    <!-- <p style="color:black"><b>Before proceeding to the task, please confirm the following are true:</b></p>
    <label class="container">Screen brightness is up to 100% &nbsp&nbsp&nbsp&nbsp  
    <input type="checkbox" name="brightness" id="brightness" value="1"/>
    </label>
    <br> -->
    <!-- <label class="container">Browser window is in full screen &nbsp&nbsp&nbsp&nbsp&nbsp
    <input type="checkbox" name="fullscreen" id="fullscreen" value="1"/>
    </label>
    <p style="color:black">(Please press F11 on Windows or Linux, or Command + Ctrl + F on Mac)</p>  -->
    <!-- <br>
    <label class="container">Headphones plugged in? &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp      
    <input type="checkbox" name="headphones" id="headphones" value="1"/>
    </label>
    <br>
    <label class="container">Headphone volume is set to 50% &nbsp&nbsp&nbsp  
    <input type="checkbox" name="volume" id="volume" value="1"/>
  </label> -->
  
  <!-- <label class="container">Headphones plugged in? &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp               
    <input type="checkbox"> 
    <br>
  </label>

  <label class="container">Headphones volume at 50%? &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp          
    <input type="checkbox"> 
    <br>
  </label>
</form>
<br> -->
<button id="submitButton" class="loadMain" onclick="validateNda()" type="button">SUBMIT</button>

<h5><?php echo gitCommitHash();?></h5>

</form>

</div>


<!-- At the end of nda.php, just before the closing </div> tag -->
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

// Initialize page when DOM is loaded - but DON'T load experiment scripts yet
document.addEventListener('DOMContentLoaded', function() {
    console.log("NDA page loaded, waiting for user to submit form");
    // Only run initial page setup here, not experiment loading
});
</script>