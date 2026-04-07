<?php
header('Content-Type: application/json');
include '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$usuario = $data['usuario'];
$nuevaPassword = password_hash($data['nuevaPassword'], PASSWORD_DEFAULT);

$sql = "UPDATE usuarios SET password = ? WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $nuevaPassword, $usuario);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Contraseña actualizada correctamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar contraseña'
    ]);
}
?>