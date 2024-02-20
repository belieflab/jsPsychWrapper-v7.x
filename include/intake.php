<div class="screening" style="background-color:lightgray; text-align:center; margin:35px; vertical-align:middle">
<br>
<h1 style="text-align:center;">Participant Intake</h1>
<!-- <input type="text" id="result"> -->
  <div id="intake">
    <p style="color:black"><b>Research Site:</b></p>
    <select name="site" id="site">
        <option value="">---</option>
        <option value="UMBC">UMBC</option>
        <option value="NU">NU</option>
        <option value="Temple">Temple</option>
        <option value="UGA">UGA</option>
        <option value="Yale">Yale</option>
        <option value="Emory">Emory</option>
    </select>
    <label for="site"></label>
    <!-- <form name="myForm" action="/action_page.php" onsubmit="return validateForm()" method="post">
    Name: <input type="text" name="fname">
    <input type="submit" value="Submit">
    </form> -->
    <!-- <form action="/action_page.php" method="post">
        <input type="text" name="fname" required>
        <input type="submit" value="Submit">
    </form> -->
    <form>
    <p style="color:black"><b>Subject ID:</b></p>
    <input required id="subject" type="text" name="subject" minlength="5" maxlength="5">
    
    <!-- GUID -->
    <p style="color:black"><b>GUID:</b></p>
    <input required id="guid" type="text" name="guid" minlength="12" maxlength="12">
    <!-- <input required type="hidden" id="guid" name="guid" value="< ?php echo $guid ?>"> -->

    </form>
    <!-- <button onclick="submitIntake()">submit subjectid</button> -->
    <p style="color:black"><b>Date of Birth:</b></p>
    <!-- <p><b>Enter as MM/DD/YYYY</b></p> -->
    <!-- <p style="color:red">*must provide value</p> -->
    <input required id="dob" type="date">
    <!-- <form>
    <p><b>Age:</b></p>
    <input required id="age" type="text" name="currentage" plattern="\d*" minlength="1" maxlength="3">
    </form> -->
    <form>
    <p style="color:black"><strong>Sex at Birth:</strong></p>
    <label for="male">Male</label>
    <input type="radio" id="male" name="sex" value="male" onclick="validateSex(this.value)">
    <label for="female">Female</label>
    <input type="radio" id="female" name="sex" value="female" onclick="validateSex(this.value)">
    </form>
    <form>

<form>
    <!-- <label for="handedness"><b>Are you right or left handed?</b></label> -->
    <p style="color:black"><b>Dominant Hand:</b></p>
        <label for="right">Right</label>
        <input type="radio" name="handedness" id="rightHanded" value="rightHanded">

        <label for="left">Left</label>
        <input type="radio" name="handedness" id="leftHanded" value="leftHanded">

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
<button id="submitButton" class="loadMain" onclick="site = validateSite(), src_subject_id = validateSubject(), subjectkey = validateGUID(), interview_age = validateAge(), sex = validateSex(), handedness = validateHandedness(), /*validateBrightness(), validateHeadphones(), validateVolume(),*/ submitIntake()" type="button">SUBMIT</button>
</div>
