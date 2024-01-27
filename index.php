<?php
require_once 'jsPsychWrapper-v7.x/db/data.php';
require_once 'jsPsychWrapper-v7.x/exp/conf.php';
?>

<!DOCTYPE html>
<html>

<head>
  <!-- add the title of the experiment that would be seen in the browser -->
  <title><?php echo $experimentName; ?></title>
  <!-- PHP wrapper libraries -->
  <script type="text/javascript" src="jsPsychWrapper-v7.x/db/validate.js"></script>
  <script type="text/javascript" src="jsPsychWrapper-v7.x/db/jquery-3.5.1.min.js"></script>
  <!-- jsPsych CDN (content delivery network) libraries -->
  <script src="https://unpkg.com/jspsych@7.3.3"></script>
  <link href="https://unpkg.com/jspsych@7.3.3/css/jspsych.css" rel="stylesheet" type="text/css"/>
  <!-- jsPsych Plugins (add more here) -->
  <script src="https://unpkg.com/@jspsych/plugin-html-keyboard-response@1.1.2"></script>
  <script src="https://unpkg.com/@jspsych/plugin-survey-multi-choice@1.1.3"></script>
  <!-- general styling -->
  <link rel="stylesheet" type="text/css" href="css/style.css">
  <!-- confidence bar styling -->
  <link rel="stylesheet" type="text/css" href="css/confidence.css">

</head>

<body id='unload' onbeforeunload="return areYouSure()">
<?php
    if (isset($_GET["workerId"]) || isset($_GET["PROLIFIC_PID"]) || isset($_GET["participantId"])) {
      switch ($language) {
        case 'english':
          include_once "jsPsychWrapper-v7.x/include/consent/english.php";
          break;
  
        case 'french':
          include_once "jsPsychWrapper-v7.x/include/consent/french.php";
          break;
  
        case 'german':
          include_once "jsPsychWrapper-v7.x/include/consent/german.php";
          break;
        }
    } else if (isset($_GET["src_subject_id"])) {
      include_once "jsPsychWrapper-v7.x/include/nda.php";
    } else {
      include_once "jsPsychWrapper-v7.x/include/intake.php";
    }
  ?>
</body>
<footer>
  <!-- load wrapper dependencies -->
  <script type="text/javascript" src="jsPsychWrapper-v7.x/exp/fn.js"></script>
  <script type="text/javascript" src="jsPsychWrapper-v7.x/exp/lang.js"></script>
  <!-- load experiment dependencies -->
  <script type="text/javascript" src="exp/conf.js"></script>
  <script type="text/javascript" src="exp/fn.js"></script>
  <script type="text/javascript" src="exp/var.js"></script>
  <script>
    // show page when loaded 
    window.onload = function() {
      $(".loading").css({
        display: "none"
      });
      $(".consent").css({
        display: "block"
      });
      $(".buttonHolder").css({
        display: "block"
      });
    };
  </script>
</footer>

</html>