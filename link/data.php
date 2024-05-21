<?php
 // Ensure the response is treated as JSON
// header('Content-Type: application/json');

// $post_data = json_decode(file_get_contents('php://input'), true);
// $response = ['success' => false];

// if ($post_data !== null) {
//     $name = "data/" . $post_data['filename'] . ".csv";
//     $data = $post_data['filedata'];
//     if (file_put_contents($name, $data) !== false) {
//         $response['success'] = true;
//     }
// }

// Send the JSON response back to the client
// echo json_encode($response); 



header('Content-Type: application/json');

try {
    $raw_input = file_get_contents('php://input');
    file_put_contents('debug_input.log', $raw_input); // Log the raw input for debugging

    $post_data = json_decode($raw_input, true);
    $response = ['success' => false];

    if ($post_data !== null) {
        $name = "data/" . $post_data['filename'] . ".csv";
        $data = $post_data['filedata'];
        if (file_put_contents($name, $data) !== false) {
            $response['success'] = true;
        }
    }

    // Log the response
    file_put_contents('debug_response.log', json_encode($response));

    // Send the JSON response back to the client
    echo json_encode($response);

} catch (Exception $e) {
    // Log the exception and return an error response
    file_put_contents('debug_exception.log', $e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

?>


