<?php
header('Content-Type: application/json');
include '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$usuario = $data['usuario'];
$link_usuario = $data['link_usuario'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (usuario, link_usuario, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $usuario, $link_usuario, $password);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado correctamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar usuario'
    ]);
}
?>