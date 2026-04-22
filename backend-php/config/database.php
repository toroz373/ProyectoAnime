<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "miruzone";

mysqli_report(MYSQLI_REPORT_OFF); // evita warnings visibles

$conn = @new mysqli($host, $user, $password, $database);

if ($conn->connect_errno) {
    error_log("DB ERROR: " . $conn->connect_error);
}
?>
