<?php
header("Access-Control-Allow-Origin: https://mikolajzachas.pl/");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
$con = mysqli_connect("localhost","root", "" );
mysqli_select_db($con, "restaurant");

$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$password = $data->password;

$result = mysqli_query($con, "SELECT * FROM register WHERE email='".$email."' AND password='".$password."'");

$nums = mysqli_num_rows($result);
$rs = mysqli_fetch_array($result);

if($nums >= 1){
    http_response_code(200);

    $outp = "";

    $outp .= '{"email":"' .$rs["email"] . '",';
    $outp .= '"first_name":"' .$rs["first_name"]. '",';
    $outp .= '"last_name":"' .$rs["last_name"]. '",';
    $outp .= '"Status":"200"}';

    echo $outp;
}
else{
    http_response_code(202);
}
?>