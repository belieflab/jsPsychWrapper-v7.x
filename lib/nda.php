<?php
// Initialize variables to null
$workerId = $participantId = $PROLIFIC_PID = $subjectId = $src_subject_id = $studyId = $candidateId = $subjectKey = $consortId = $sexAtBirth = $institutionAlias = $ageInMonths = $groupStatus = $visit = $week = null;

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
    $consortId = $src_subject_id; // Assuming consortId is intended to be the same as src_subject_id

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

 function gitCommitHash( $branch='master' ) {
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


// subjectId is the gerneal variable that will be used to pass the subject id to saveData
const subjectId = "<?php echo $subjectId; ?>";


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
const visit = "<?php echo $visit?>" || undefined;
const week = "<?php echo $week?>" || undefined;


const writeCandidateKeys = (data) => {

  const workerId = "<?php echo $workerId; ?>";

  if (src_subject_id) {

      data.subjectkey = subjectkey;
      data.src_subject_id = workerId;
      data.site = site;
      data.interview_date = interview_date;
      data.interview_age = interview_age;
      data.sex = sex;
      data.phenotype = phenotype;
      data.visit = visit;
      data.handedness = handedness;
      data.version = version;
    
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

      data.prolificPid = PROLIFIC_PID;
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