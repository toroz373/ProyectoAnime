<?php
// Configurar headers para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json");

// Incluir archivo de conexion a la base de datos
include '../config/database.php';

// Obtener ID del usuario de los parametros
$id = $_GET['id'] ?? 0;

// Consulta para obtener los datos del perfil
$sql = "SELECT id, usuario, link, avatar, descripcion, theme 
        FROM usuarios WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$resultado = $stmt->get_result();

// Verificar si se encontro el usuario
if ($resultado->num_rows === 1) {
    echo json_encode([
        "exito" => true,
        "usuario" => $resultado->fetch_assoc()
    ]);
} else {
    echo json_encode(["exito" => false]);
}
?>