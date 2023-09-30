<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$calculator = $_SERVER['REQUEST_METHOD'];

switch($calculator) {

    case "GET":
        $sql = "SELECT * FROM calculator WHERE id = 1"; // Wybieramy rekord o id = 1
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $calculatorData = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($calculatorData);
    break;
    case "PUT":
        $calculator = json_decode( file_get_contents('php://input') );

        

        $sql = "UPDATE calculator SET traditional= :traditional, vege =:vege, premium =:premium, tort =:tort, kidsMenu =:kidsMenu, drinkBar =:drinkBar, alcohol =:alcohol, vignettes =:vignettes, countryTable =:countryTable WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $calculator->id);
        $stmt->bindParam(':traditional', $calculator->traditional);
        $stmt->bindParam(':vege', $calculator->vege);
        $stmt->bindParam(':premium', $calculator->premium);
        $stmt->bindParam(':tort', $calculator->tort);
        $stmt->bindParam(':kidsMenu', $calculator->kidsMenu);
        $stmt->bindParam(':drinkBar', $calculator->drinkBar);
        $stmt->bindParam(':alcohol', $calculator->alcohol);
        $stmt->bindParam(':vignettes', $calculator->vignettes);
        $stmt->bindParam(':countryTable', $calculator->countryTable);



        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;
}

?>