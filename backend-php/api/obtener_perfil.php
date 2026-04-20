<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json");

include '../config/database.php';

$id = $_GET['id'] ?? 0;

$sql = "SELECT id, usuario, link, avatar, descripcion, theme 
        FROM usuarios WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {
    echo json_encode([
        "exito" => true,
        "usuario" => $resultado->fetch_assoc()
    ]);
} else {
    echo json_encode(["exito" => false]);
}
?>