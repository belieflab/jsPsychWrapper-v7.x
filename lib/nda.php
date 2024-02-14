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
    $subjectKey = $_GET["subjectkey"] ?? null;
    $sexAtBirth = $_GET["sex"] ?? null;
    $institutionAlias = $_GET["site"] ?? null;
    $ageInMonths = $_GET["interview_age"] ?? null;
    $groupStatus = $_GET["phenotype"] ?? null;
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
    const week = "<?php echo $week?>";

</script>