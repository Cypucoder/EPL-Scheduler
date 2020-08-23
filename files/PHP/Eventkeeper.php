<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta name="viewport" content="width=300">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>EPL Staff Status</title>
</head>
<?php
$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "eventcal";
//$specchar = htmlspecialchars(" - ");
/*$user_name = "root";
$password = "password";
$database = "status";
$server = "10.66.5.4";*/

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM events";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
  while($row = $result->fetch_assoc()) {
       echo  $row["title"]. " " . $row["start"]. "<br>"; 
    }
} else {
    echo "0 results";
}
$conn->close();
?>
    
<body>
</body>
</html>