<?php
// Configurar headers para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Incluir archivo de conexion a la base de datos
include '../config/database.php';

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Asignar los valores recibidos
$id = $data['id'];
$usuario = $data['usuario'];
$link = $data['link'];
$descripcion = $data['descripcion'];
$tema = $data['tema'];

// Consulta SQL para actualizar los datos del usuario
$sql = "UPDATE usuarios 
        SET usuario=?, link=?, descripcion=?, theme=? 
        WHERE id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $usuario, $link, $descripcion, $tema, $id);

// Responder con el resultado de la ejecucion
echo json_encode([
    "exito" => $stmt->execute()
]);
?>