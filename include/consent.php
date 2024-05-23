<script type="text/javascript" src="wrap/lib/jquery-3.5.1.min.js"></script>

<div class="screening">
    <div id="consent">
        <h1 id="hide" class="consent-title">Study Consent Form</h1>
        <div class="loading centeredDiv">
            <h1>Loading...</h1>
        </div>
        <div id="consentHolder" class="consent centeredDiv">
            <h3 id="consentPreamble">In order for us to conduct this experiment online, we need to include the standard consent form below: <br /> <br /> </h3>
            <div id="consentForm" class="consent-box"> 
                <!-- Language-specific content will be loaded here by JavaScript Event Listener in fn.js translate() -->
            </div>
        </div>
        <form>
    <!-- <label for="handedness"><b>Are you right or left handed?</b></label> -->

    <h4 style="color:black">Which is your dominant hand?</h4>

<label class="custom-radio-button">Left
  <input type="radio" name="handedness" value="left" id="left">
  <span class="checkmark"></span>
</label>

<label class="custom-radio-button">Right
  <input type="radio" name="handedness" value="right" id="right">
  <span class="checkmark"></span>
</label>
        <!-- <span class="checkmark"></span> -->

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
  
        <!-- Button with conditional script loading -->
        <button id="consentButton" class="loadMain" onclick="$.getScript('exp/timeline.js'), validateConsent()" type="button" style="display: none;"><script>consent</script></button>

        <h5><?php echo gitCommitHash();?></h5>
  
      </form>
</div>