<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    

        case "PUT":
                    
            $reservation = json_decode(file_get_contents('php://input'));
            $sql = "UPDATE reservation SET status = :status WHERE id=:id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $reservation->id);
            $stmt->bindParam(':status', $reservation->status);
            if($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record updated successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to update record.'];
            }
        echo json_encode($response);
        break;
}

?>