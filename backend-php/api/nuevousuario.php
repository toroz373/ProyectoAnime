<?php
// Configurar headers para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

// Conexión a la base de datos
include '../config/database.php';

// Responder a solicitudes preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Si no llega nada, devolver error
if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'No se recibieron datos'
    ]);
    exit();
}

// Sacar los datos del JSON
$usuario = $data['usuario'] ?? null;
$link = $data['link'] ?? null;
$passwordRaw = $data['password'] ?? null;

// Comprobar que no falte nada
if (!$usuario || !$link || !$passwordRaw) {
    echo json_encode([
        'success' => false,
        'message' => 'Faltan campos'
    ]);
    exit();
}

// Validar que el link empiece por @
if (!str_starts_with($link, '@')) {
    echo json_encode([
        'success' => false,
        'message' => 'El link debe empezar con @'
    ]);
    exit();
}

// Comprobar si el usuario ya existe
$sqlUser = "SELECT id FROM usuarios WHERE usuario = ?";
$stmtUser = $conn->prepare($sqlUser);
$stmtUser->bind_param("s", $usuario);
$stmtUser->execute();
$resultUser = $stmtUser->get_result();

// Si ya existe, no dejar registrarlo
if ($resultUser->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El usuario ya existe'
    ]);
    exit();
}

// Comprobar si el link ya esta usado
$sqlLink = "SELECT id FROM usuarios WHERE link = ?";
$stmtLink = $conn->prepare($sqlLink);
$stmtLink->bind_param("s", $link);
$stmtLink->execute();
$resultLink = $stmtLink->get_result();

// Si ya existe el link, tampoco dejar continuar
if ($resultLink->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El link ya está en uso'
    ]);
    exit();
}

// Encriptar la contrasena antes de guardarla
$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

// Insertar el usuario en la base de datos
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

// Ejecutar y devolver resultado
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

// Cerrar conexion
$stmt->close();
$conn->close();
?>