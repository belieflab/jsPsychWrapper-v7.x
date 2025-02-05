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
    <input required id="subject" type="text" name="subject" minlength="8" maxlength="8" class="custom-input">
    
    <!-- GUID -->
    <h4 style="color:black">GUID:</h4>
    <input required id="guid" type="text" name="guid" minlength="12" maxlength="12" oninput="this.value = this.value.toUpperCase()" class="custom-input">
    <!-- <input required type="hidden" id="guid" name="guid" value="< ?php echo $guid ?>"> -->

    <!-- <button onclick="submitIntake()">submit subjectid</button> -->

    <h4 style="color:black"><label for="dob">Date of Birth:</label></h4>
<input required id="dob" type="date" class="custom-input">


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
    </label> -->
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
<!-- <button id="submitButton" class="loadMain" onclick="site = validateSite(), src_subject_id = validateSubject(), subjectkey = validateGUID(), interview_age = validateAge(), sex = validateSex(), handedness = validateHandedness(), /*validateBrightness(), validateHeadphones(), validateVolume(),*/ submitIntake()" type="button">SUBMIT</button> -->
<button id="submitButton" class="loadMain" onclick="$.getScript('exp/timeline.js'), validateIntake()" type="button">SUBMIT</button>

<h5><?php echo gitCommitHash();?></h5>

</form>

</div>


<script>
  // Run the test and load the experiment if successful

document.addEventListener('DOMContentLoaded', function() {
      testDataSave().then((result) => {
        if (!result) {
          alert("ERROR: Failed save data check.\nPlease make sure you are using Chrome, Firefox, or Safari.");
        }
      });
    });
</script>