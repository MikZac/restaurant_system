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

    case "POST":
        $menu = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO menu(id, name, price, ingredients, type) VALUES(null, :name, :price, :ingredients, :type)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam('name', $menu->name);
        $stmt->bindParam(':price', $menu->price);
        $stmt->bindParam(':ingredients', $menu->ingredients);
        $stmt->bindParam(':type', $menu->type);
        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;

    case "GET":
        $sql = "SELECT * FROM menu";
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
    case "PUT":
        $menu = json_decode( file_get_contents('php://input') );
        $sql = "UPDATE menu SET name= :name, price =:price, ingredients =:ingredients, type =:type WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $menu->id);
        $stmt->bindParam(':name', $menu->name);
        $stmt->bindParam(':ingredients', $menu->ingredients);
        $stmt->bindParam(':price', $menu->price);
        $stmt->bindParam(':type', $menu->type);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case "DELETE":
        $sql = "DELETE FROM menu WHERE id = :id";
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
}

?>