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
        <button id="submitButton" class="loadMain" onclick="validateConsent()" type="button" style="display: none;"><script>consent</script></button>
    </div>

    <div id="load" style="display: none">
        <h3>All validation rules were passed successfully!</h3>
        <h3>Click to load the experiment.</h3>
        <button id="nextButton" class="noCursor" onclick="startExperiment()"><script>load</script></button>
    </div>
</div>

<script>
    $("button.loadMain").click(() => {
        $.getScript("exp/timeline.js");
    });
</script>