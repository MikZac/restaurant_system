<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$position = $_SERVER['REQUEST_METHOD'];

switch($position) {
    case "GET":
        $id_zamowienia = isset($_GET['id_zamowienia']) ? $_GET['id_zamowienia'] : null;

        if ($id_zamowienia === null || !is_numeric($id_zamowienia)) {
            // Brak lub nieprawidłowy parametr 'id_zamowienia', zwracamy błąd
            http_response_code(400); // Bad Request
            echo json_encode(array("message" => "Nieprawidłowe 'id_zamowienia'"));
            break;
        }

        $sql = "SELECT * FROM zamowienia_dania WHERE id_zamowienia = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id_zamowienia, PDO::PARAM_INT);
        $stmt->execute();
        $dishes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($dishes)) {
            // Brak danych dla podanego 'id_zamowienia', zwracamy odpowiedni komunikat
            http_response_code(404); // Not Found
            echo json_encode(array("message" => "Nie znaleziono zamówienia o podanym 'id_zamowienia'"));
        } else {
            // Znaleziono dane zamówienia, zwracamy je jako JSON
            echo json_encode($dishes);
        }
        break;
}
?>