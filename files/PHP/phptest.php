<!--http://angularcode.com/simple-task-manager-application-using-angularjs-php-mysql/-->

<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "eventcal";

$conn = new mysqli($servername, $username, $password, $dbname);

$result = $conn->query('SELECT * FROM eventcal.events');

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"title":"'  . $rs["title"] . '",';
    $outp .= '"id":"'   . $rs["id"]        . '",';
    $outp .= '"fStart":"'   . $rs["start"]        . '",';
    $outp .= '"fend":"'   . $rs["end"]        . '",';
    $outp .= '"AttendCount":"'   . $rs["AttendCount"]        . '",';
    $outp .= '"eDescription":"'   . $rs["eDescription"]        . '",';
    $outp .= '"Building":"'. $rs["Building"]     . '"}'; 
}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo($outp);
?>