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
?>
<script type="text/javascript">
    const language = "<?php echo $language; ?>";
</script>

<?php
// SET SUBJECT IDENTIFICATION
if (isset($_GET["workerId"])) {
  $workerId = isset($_GET["workerId"]) ? $_GET["workerId"] : null;
  $subjectId = isset($_GET["workerId"]) ? $_GET["workerId"] : null;
  } else {
    $PROLIFIC_PID = null;
    $participantId = null;
  }

  if (isset($_GET["PROLIFIC_PID"])) {
  $PROLIFIC_PID = isset($_GET["PROLIFIC_PID"]) ? $_GET["PROLIFIC_PID"] : null;
  $subjectId = isset($_GET["PROLIFIC_PID"]) ? $_GET["PROLIFIC_PID"] : null;
  } else {
    $workerId = null;
    $participantId = null;
  }

  if (isset($_GET["participantId"])) {
  $participantId = isset($_GET["participantId"]) ? $_GET["participantId"] : null;
  $subjectId = isset($_GET["participantId"]) ? $_GET["participantId"] : null;
  } else {
    $workerId = null;
    $PROLIFIC_PID = null;
  }
  
  if (isset($_GET["src_subject_id"])) {
  $src_subject_id = isset($_GET["src_subject_id"]) ? $_GET["src_subject_id"] : null;
  $subjectId = isset($_GET["src_subject_id"]) ? $_GET["src_subject_id"] : null;
  // these are omnibus data base variables which will get passed from participant portal
  $studyId = isset($_GET["studyId"]) ? $_GET["studyId"] : null;
  $candidateId = isset($_GET["candidateId"]) ? $_GET["candidateId"] : null;
  // these are NDA required variables which will get passed from participant portal
  $subjectKey = isset($_GET["subjectkey"]) ? $_GET["subjectkey"] : null;
  $consortId = isset($_GET["src_subject_id"]) ? $_GET["src_subject_id"] : null;
  $sexAtBirth = isset($_GET["sex"]) ? $_GET["sex"] : null;
  $institutionAlias = isset($_GET["site"]) ? $_GET["site"] : null;
  $ageInMonths = isset($_GET["interview_age"]) ? $_GET["interview_age"] : null;
  $groupStatus = isset($_GET["phenotype"]) ? $_GET["phenotype"] : null;
  $visit = isset($_GET["visit"]) ? $_GET["visit"] : null;
  $workerId = null;
  } else {
    $src_subject_id = null;
    $candidateId = null;
    $studyId = null;
    $subjectKey = null;
    $consortId = null;
    $sexAtBirth = null;
    $institutionAlias = null;
    $ageInMonths = null;
    $groupStatus = null;
    $visit = null;
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


