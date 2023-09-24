<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();
$reservation = $_SERVER['REQUEST_METHOD'];
switch($reservation) {
    case "POST":
        $reservation = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO reservation(id, name, surname, guests, email, phone, date, time) VALUES(null, :name, :surname, :guests, :email, :phone, :date, :time)";
        $stmt = $conn->prepare($sql);
        $date = date('Y-m-d');
        $stmt->bindParam('name', $reservation->name);
        $stmt->bindParam(':surname', $reservation->surname);
        $stmt->bindParam(':guests', $reservation->guests);
        $stmt->bindParam(':email', $reservation->email);
        $stmt->bindParam(':phone', $reservation->phone);
        $stmt->bindParam(':date', $reservation->date);
        $stmt->bindParam(':time', $reservation->time);
        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;
        case "GET":
            $sql = "SELECT * FROM reservation";
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if(isset($path[3]) && is_numeric($path[3])) {
                $sql .= " WHERE id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $path[3]);
                $stmt->execute();
                $users = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode($users);
            break;
            case "DELETE":
                $sql = "DELETE FROM reservation WHERE id = :id";
                $path = explode('/', $_SERVER['REQUEST_URI']);
        
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $path[3]);
        
                if($stmt->execute()) {
                    $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to delete record.'];
                }
                echo json_encode($response);
                break;

                case "PUT":
                    $reservation = json_decode( file_get_contents('php://input') );
                    $sql = "UPDATE reservation SET name= :name, surname =:surname, guests =:guests, email =:email, phone =:phone, date =:date, time =:time, status =:status WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $date = date('Y-m-d');
                    $stmt->bindParam(':name', $reservation->name);
                    $stmt->bindParam(':surname', $reservation->surname);
                    $stmt->bindParam(':guests', $reservation->guests);
                    $stmt->bindParam(':email', $reservation->email);
                    $stmt->bindParam(':phone', $reservation->phone);
                    $stmt->bindParam(':date', $reservation->date);
                    $stmt->bindParam(':time', $reservation->time);
                    $stmt->bindParam(':status', $reservation->status);
                    $stmt->bindParam(':id', $reservation->id);
                    
                    if($stmt->execute()) {
                        $response = ['status' => 1, 'message' => 'Record updated successfully.'];
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to update record.'];
                    }
                    echo json_encode($response);
                    break;
}
?>