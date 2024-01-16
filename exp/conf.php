<?php

  //***********************************//
 //   EXPERIMENT CONFIGURATION FILE   //
//***********************************//

// SET EXPERIMENT NAME
$experimentName = 'Stroop Task';
$experimentAlias = 'stroop';

// SELECT LANGUAGE
$language = 'english';
// $language = 'french';
// $language = 'german';

// SET SUBJECT IDENTIFICATION
if ($_GET["workerId"]) {
  $workerId = $_GET["workerId"];
  $subjectId = $_GET["workerId"];
}

if ($_GET["PROLIFIC_PID"]) {
  $PROLIFIC_PID = $_GET["PROLIFIC_PID"];
  $subjectId = $_GET["PROLIFIC_PID"];
}

if ($_GET["participantId"]) {
  $participantId = $_GET["participantId"];
  $subjectId = $_GET["participantId"];
}

if ($_GET["src_subject_id"]) {
  $src_subject_id = $_GET["src_subject_id"];
  $subjectId = $_GET["src_subject_id"];
  
  // these are omnibus data base variables which will get passed from participant portal
  $studyId = $_GET["studyId"];
  $candidateId = $_GET["candidateId"];
  // these are NDA required variables which will get passed from participant portal
  $subjectKey = $_GET["subjectkey"];
  $consortId = $_GET["src_subject_id"];
  $sexAtBirth = $_GET["sex"];
  $institutionAlias = $_GET["site"];
  $ageInMonths = $_GET["interview_age"];
  $groupStatus = $_GET["phenotype"];
  $visit = $_GET["visit"];
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
    const experimentName = "<?php echo $experimentName; ?>";
    const experimentAlias = "<?php echo $experimentAlias; ?>";
    const workerId = "<?php echo $workerId; ?>";
    const PROLIFIC_PID = "<?php echo $PROLIFIC_PID; ?>";
    const participantId = "<?php echo $participantId; ?>";
    let src_subject_id = "<?php echo $src_subject_id; ?>";
    let subjectId = "<?php echo $subjectId; ?>";
    const language = "<?php echo $language; ?>";
    const adminEmail = "joshua.kenney@yale.edu";
    const feedbackLink = "https://belieflab.yale.edu/omnibus/eCRFs/feedback/tasks/kamin.php?candidateId=<?php echo $candidateId?>&studyId=<?php echo $studyId?>";
    // these are NDA required variables which will get passed from participant portal 
    const GUID = "<?php echo $subjectKey?>";
    const subjectID = "<?php echo $consortId?>";
    const sexAtBirth = "<?php echo $sexAtBirth?>";
    const siteNumber = "<?php echo $institutionAlias?>";
    const ageAtAssessment = "<?php echo $ageInMonths?>";
    const groupStatus = "<?php echo $groupStatus?>";
    const visit = "<?php echo $visit?>";
</script>


