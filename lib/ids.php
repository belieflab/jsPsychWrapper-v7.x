<?php
// Initialize variables to null
$workerId = $participantId = $PROLIFIC_PID = $subjectId = $src_subject_id = $studyId = $candidateId = $subjectkey = $sex = $site = $interview_age = $phenotype = $visit = $week = null;

// Check for workerId and set $subjectId
if (isset($_GET["workerId"])) {
    $workerId = $_GET["workerId"];
    $subjectId = $workerId;
}

// Check for PROLIFIC_PID and set $subjectId
if (isset($_GET["PROLIFIC_PID"])) {
    $PROLIFIC_PID = $_GET["PROLIFIC_PID"];
    $subjectId = $PROLIFIC_PID;
}

// Check for participantId and set $subjectId
if (isset($_GET["participantId"])) {
    $participantId = $_GET["participantId"];
    $subjectId = $participantId;
}

// Check for src_subject_id and set related variables
if (isset($_GET["src_subject_id"])) {
    $src_subject_id = $_GET["src_subject_id"];
    $subjectId = $src_subject_id;

    // Set omnibus database variables
    $studyId = $_GET["studyId"] ?? null;
    $candidateId = $_GET["candidateId"] ?? null;

    // Set NDA required variables
    $subjectkey = $_GET["subjectkey"] ?? null;
    $sex = $_GET["sex"] ?? null;
    $site = $_GET["site"] ?? null;
    $interview_age = $_GET["interview_age"] ?? null;
    $phenotype = $_GET["phenotype"] ?? null;
    $visit = $_GET["visit"] ?? null;
    $week = $_GET["week"] ?? null;
}


function getIncludeFile() {
  if (isset($_GET["workerId"]) || isset($_GET["participantId"]) || isset($_GET["PROLIFIC_PID"])) {
      return "start";
  } else if (isset($_GET["src_subject_id"])) {
      return "nda";
  } else {
      return "intake";
  }
}

$include_file = getIncludeFile();

/**
 * Get the hash of the current git HEAD
 * @param str $branch The git branch to check
 * @return mixed Either the hash or a boolean false
 */

 function gitCommitHash($branch='main') {
    // Try to get the hash from the specified branch.
    $hash = @file_get_contents(sprintf('.git/refs/heads/%s', $branch));
    if ($hash) {
      // If the hash is found, return the last seven characters.
      return "version: ".strval(substr(trim($hash), -7));
    } else {
      // If the hash is not found (perhaps because of a wrong branch name),
      // try the other common branch name if the default was used.
      if ($branch == 'main') {
        $hash = @file_get_contents('.git/refs/heads/master');
        if ($hash) {
          return "version: ".strval(substr(trim($hash), -7));
        }
      } elseif ($branch == 'master') {
        $hash = @file_get_contents('.git/refs/heads/main');
        if ($hash) {
          return "version: ".strval(substr(trim($hash), -7));
        }
      }
      // If neither branch has a hash, return false.
      return false;
    }
  }
  
?>

<script type="text/javascript">
"use strict";

// Initialize date and formatted strings
const date = new Date();
const dd = String(date.getDate()).padStart(2, "0");
const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
const yyyy = date.getFullYear();
const isoDate = `${yyyy}-${mm}-${dd}`;
const interview_date = `${mm}/${dd}/${yyyy}`;

// In JavaScript, an empty string is considered a falsy value,
// which means it will be treated as false in a logical context.
// Therefore, the logic workerId || undefined will indeed result
// in undefined if workerId is an empty string.
const workerId = "<?php echo $workerId; ?>" || undefined;
const PROLIFIC_PID = "<?php echo $PROLIFIC_PID; ?>" || undefined;
const participantId = "<?php echo $participantId; ?>" || undefined;

// NDA variables must be defined as let to allow for reassignment in include/intake.php
let src_subject_id = "<?php echo $src_subject_id; ?>" || undefined;


// subjectId is the hybrid variable that will be used to pass the appropriate identifier to saveData
// subjectId MUST be defined as let to allow for reassignment in include/intake.php
let subjectId = "<?php echo $subjectId; ?>" || undefined;

// these are NDA required variables which will get passed from participant portal 
// In JavaScript, an empty string is considered a falsy value,
// which means it will be treated as false in a logical context.
// Therefore, the logic workerId || undefined will indeed result
// in undefined if workerId is an empty string.
let subjectkey = "<?php echo $subjectkey?>" || undefined;
let sex = "<?php echo $sex?>" || undefined;
let site = "<?php echo $site?>" || undefined;
let interview_age = "<?php echo $interview_age?>" || undefined;
let phenotype = "<?php echo $phenotype?>" || undefined;

// NDA required variables reflecting timepoints
let visit = "<?php echo $visit?>" || undefined;
let week = "<?php echo $week?>" || undefined;

/**
 * Updates the jsPsych data object with candidate keys and additional information based on the context.
 * This function takes into account different scenarios such as when src_subject_id, workerId,
 * participantId, or PROLIFIC_PID are available.
 * 
 * @param {Object} data - The jsPsych data object to be updated.
 * This data object is expected to be mutated within the function with new or updated properties.
 * 
 * Each conditional block checks for different identifiers (like src_subject_id, workerId, etc.)
 * and updates the data object with relevant information accordingly. This includes subject keys,
 * worker IDs, participant IDs, interview details, and other metadata.
 * 
 * Note: PHP variables (e.g., ``) are used to assign JavaScript constants; 
 * ensure this function is used within a PHP file or template where PHP variables are defined.
 */
const writeCandidateKeys = (data) => {

  if (src_subject_id) {

      data.src_subject_id = src_subject_id;
      data.interview_date = interview_date;
      data.handedness = handedness;
      data.version = version;
      
      data.subjectkey = subjectkey;
      data.sex = sex;
      data.site = site;
      data.interview_age = interview_age;
      data.phenotype = phenotype;


      if (visit) {
          data.visit = visit;
      }
      if (week) {
          data.week = week;
      }
    
  }

  if (workerId) {

      data.workerId = workerId;
      data.interview_date = interview_date;
      data.handedness = handedness;
      data.version = version;

      if (visit) {
          data.visit = visit;
      }
      if (week) {
          data.week = week;
      }

  }

  if (participantId) {

      data.participantId = participantId;
      data.interview_date = interview_date;
      data.handedness = handedness;
      data.version = version;

      if (visit) {
          data.visit = visit;
      }
      if (week) {
          data.week = week;
      }

  }

  if (PROLIFIC_PID) {

      data.PROLIFIC_PID = PROLIFIC_PID;
      data.interview_date = interview_date;
      data.handedness = handedness;
      data.version = version;

      if (visit) {
          data.visit = visit;
      }
      if (week) {
          data.week = week;
      }

  }

  if (phase) {
      data.phase = phase;
  }
  

}

</script>