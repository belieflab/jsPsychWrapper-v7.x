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

/**
 * Get the hash of the current git HEAD
 * @param str $branch The git branch to check
 * @return mixed Either the hash or a boolean false
 */

 function gitCommitHash( $branch='main' ) {
  if ( $hash = file_get_contents( sprintf( '.git/refs/heads/%s', $branch ) ) ) {
    return "version: ".strval(substr(trim($hash),-7));
  } else {
    return false;
  }
}
?>

<script type="text/javascript">

// In JavaScript, an empty string is considered a falsy value,
// which means it will be treated as false in a logical context.
// Therefore, the logic workerId || undefined will indeed result
// in undefined if workerId is an empty string.
const workerId = "<?php echo $workerId; ?>" || undefined;
const PROLIFIC_PID = "<?php echo $PROLIFIC_PID; ?>" || undefined;
const participantId = "<?php echo $participantId; ?>" || undefined;
const src_subject_id = "<?php echo $src_subject_id; ?>" || undefined;


// subjectId is the hybrid variable that will be used to pass the appropriate identifier to saveData
const subjectId = "<?php echo $subjectId; ?>" || undefined;

// these are NDA required variables which will get passed from participant portal 
// In JavaScript, an empty string is considered a falsy value,
// which means it will be treated as false in a logical context.
// Therefore, the logic workerId || undefined will indeed result
// in undefined if workerId is an empty string.
const subjectkey = "<?php echo $subjectkey?>" || undefined;
const sex = "<?php echo $sex?>" || undefined;
const site = "<?php echo $site?>" || undefined;
const interview_age = "<?php echo $interview_age?>" || undefined;
const phenotype = "<?php echo $phenotype?>" || undefined;

// NDA required variables reflecting timepoints
const visit = "<?php echo $visit?>" || undefined;
const week = "<?php echo $week?>" || undefined;

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
 * Note: PHP variables (e.g., `<?php echo $workerId; ?>`) are used to assign JavaScript constants;
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

}

</script>