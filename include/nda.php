<div class="screening" style="background-color:lightgray; text-align:center; margin:35px; vertical-align:middle">
<br>
<h1 style="text-align:center;">Participant Intake</h1>
<p><?php echo gitCommitHash();?></p>
  <div id="intake">
    

  <form>
    <!-- <label for="handedness"><b>Are you right or left handed?</b></label> -->
    <p style="color:black"><b>Which is your dominant hand?</b></p>
        <label for="right">Right</label>
        <input type="radio" name="handedness" id="rightHanded" value="rightHanded">

        <label for="left">Left</label>
        <input type="radio" name="handedness" id="leftHanded" value="leftHanded">

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
  </form>
  
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
<button id="submitButton" class="btn btn-primary btn-lg loadMain" onclick="$.getScript('exp/timeline.js'), validateSrcSubjectId(), /*validateBrightness(), validateFullscreen(), validateHeadphones(), validateVolume(),*/ submitIntake()" type="button">SUBMIT</button>
</div>