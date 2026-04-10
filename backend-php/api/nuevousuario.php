<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

include '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'No se recibieron datos'
    ]);
    exit();
}

$usuario = $data['usuario'] ?? null;
$link = $data['link'] ?? null;
$passwordRaw = $data['password'] ?? null;

if (!$usuario || !$link || !$passwordRaw) {
    echo json_encode([
        'success' => false,
        'message' => 'Faltan campos'
    ]);
    exit();
}

if (!str_starts_with($link, '@')) {
    echo json_encode([
        'success' => false,
        'message' => 'El link debe empezar con @'
    ]);
    exit();
}

$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (usuario, link, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos'
    ]);
    exit();
}

$stmt->bind_param("sss", $usuario, $link, $password);

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

$stmt->close();
$conn->close();
?>