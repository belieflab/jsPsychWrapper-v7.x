<?php
// SET SUBJECT IDENTIFICATION
if ($_GET["workerId"]) {
    $workerId = $_GET["workerId"];
    $subjectId = $_GET["workerId"];
  }
  
  if ($_GET["PROLIFIC_PID"]) {
    $PROLIFIC_PID = $_GET["PROLIFIC_PID"];
    $subjectId = $_GET["PROLIFIC_PID"];
  }
  
  if ($_GET["src_subject_id"]) {
    $src_subject_id = $_GET["src_subject_id"];
    $subjectId = $_GET["src_subject_id"];
  }
  

  ?>


<script type="text/javascript">
    const experimentName = "<?php echo $experimentName; ?>";
    const experimentAlias = "<?php echo $experimentAlias; ?>";
    const workerId = "<?php echo $workerId; ?>";
    const PROLIFIC_PID = "<?php echo $PROLIFIC_PID; ?>";
    let src_subject_id = "<?php echo $src_subject_id; ?>";
    let subjectId = "<?php echo $subjectId; ?>";
    const language = "<?php echo $language; ?>";
    const adminEmail = "joshua.kenney@yale.edu";
</script>