<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$password = $data->password;


ini_set('session.cookie_lifetime', 0);

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $stmt = $conn->prepare("SELECT * FROM register WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $rs = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($rs !== false) {
            $hashedPasswordFromDatabase = $rs["password"];

            if (hash('sha256', $password) === $hashedPasswordFromDatabase) {
                $_SESSION['email'] = $rs["email"];
                $_SESSION['first_name'] = $rs["first_name"];
                $_SESSION['last_name'] = $rs["last_name"];
                
                http_response_code(200);

                $outp = "";

                $outp .= '{"email":"' . $rs["email"] . '",';
                $outp .= '"first_name":"' . $rs["first_name"] . '",';
                $outp .= '"last_name":"' . $rs["last_name"] . '",';
                $outp .= '"Status":"200"}';

                echo $outp;
            } else {
                http_response_code(202);
            }
        } else {
            http_response_code(202);
        }
    } catch (\Exception $e) { 
        echo "Database Error: " . $e->getMessage();
    }
} else {

    if (isset($_SESSION['email'])) {
        http_response_code(200);
        $outp = "";
        $outp .= '{"email":"' . $_SESSION["email"] . '",';
        $outp .= '"first_name":"' . $_SESSION["first_name"] . '",';
        $outp .= '"last_name":"' . $_SESSION["last_name"] . '",';
        $outp .= '"Status":"200"}';
        echo $outp;
    } else {
        http_response_code(202);
    }
}
?>