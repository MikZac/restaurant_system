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
                    
            $calculator = json_decode(file_get_contents('php://input'));
            $sql = "UPDATE zamowienia SET status = :status WHERE id_zamowienia=:id_zamowienia ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_zamowienia', $calculator->id_zamowienia);
            $stmt->bindParam(':status', $calculator->status);
            if($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record updated successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to update record.'];
            }
        echo json_encode($response);
        break;
}

?>