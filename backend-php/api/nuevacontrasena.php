<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No se recibieron datos válidos"
    ]);
    exit;
}

$usuario = trim($data['usuario'] ?? '');
$nuevaPassword = trim($data['nuevaPassword'] ?? '');

if (empty($usuario) || empty($nuevaPassword)) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos"
    ]);
    exit;
}

$passwordHash = password_hash($nuevaPassword, PASSWORD_DEFAULT);

$stmt = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "El usuario no existe"
    ]);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();

// actualizar contraseña
$stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE usuario = ?");
$stmt->bind_param("ss", $passwordHash, $usuario);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Contraseña actualizada correctamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la contraseña"
    ]);
}

$stmt->close();
$conn->close();
exit;
?>
