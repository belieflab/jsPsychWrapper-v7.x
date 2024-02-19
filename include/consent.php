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
        <button id="submitButton" class="loadMain" onclick="$.getScript('exp/timeline.js'); validateConsent()" type="button" style="display: none;"><script>consent</script></button>
    </div>
</div>

<script>
    // $("button.loadMain").click(() => {
    //     $.getScript("exp/timeline.js");
    // });
</script>