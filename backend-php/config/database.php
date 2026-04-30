<?php
// Datos de conexión al servidor MySQL
$host = "localhost";
$user = "root";
$password = "";
$database = "miruzone";

// Desactiva los reportes automáticos de errores de mysqli
mysqli_report(MYSQLI_REPORT_OFF); 

// Intenta crear una conexión a la base de datos
// El símbolo @ oculta los mensajes de error directos
$conn = @new mysqli($host, $user, $password, $database);

// Si ocurre un error al conectar, se registra en el log del servidor
if ($conn->connect_errno) {
    error_log("DB ERROR: " . $conn->connect_error);
}
?>
