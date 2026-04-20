<?php
// Angular (localhost:4200) puede hacer peticiones a este backend
header("Access-Control-Allow-Origin: http://localhost:4200");

// Envia cabeceras como Content-Type desde el frontend
header("Access-Control-Allow-Headers: Content-Type");

// Peticiones POST y también OPTIONS (esto es por el CORS)
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Respuesta siempre en JSON
header('Content-Type: application/json');

// Conexión a la base de datos
include '../config/database.php';

// Si la petición es OPTIONS, responde OK y paro todo
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Leo lo que manda el frontend
$data = json_decode(file_get_contents("php://input"), true);

// Si no llega nada, devuelvo error
if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'No se recibieron datos'
    ]);
    exit();
}

// Saco los datos del JSON
$usuario = $data['usuario'] ?? null;
$link = $data['link'] ?? null;
$passwordRaw = $data['password'] ?? null;

// Compruebo que no falte nada
if (!$usuario || !$link || !$passwordRaw) {
    echo json_encode([
        'success' => false,
        'message' => 'Faltan campos'
    ]);
    exit();
}

// Aquí valido que el link empiece por @ 
if (!str_starts_with($link, '@')) {
    echo json_encode([
        'success' => false,
        'message' => 'El link debe empezar con @'
    ]);
    exit();
}

// Compruebo si el usuario ya existe 
$sqlUser = "SELECT id FROM usuarios WHERE usuario = ?";
$stmtUser = $conn->prepare($sqlUser);
$stmtUser->bind_param("s", $usuario);
$stmtUser->execute();
$resultUser = $stmtUser->get_result();

// Si ya existe, no dejo registrarlo
if ($resultUser->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El usuario ya existe'
    ]);
    exit();
}

// Compruebo si el link ya está usado 
$sqlLink = "SELECT id FROM usuarios WHERE link = ?";
$stmtLink = $conn->prepare($sqlLink);
$stmtLink->bind_param("s", $link);
$stmtLink->execute();
$resultLink = $stmtLink->get_result();

// Si ya existe el link, tampoco dejo continuar
if ($resultLink->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El link ya está en uso'
    ]);
    exit();
}

// Si todo está bien, creo el usuario 

// Encripto la contraseña antes de guardarla
$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

// Inserto el usuario en la base de datos
$sql = "INSERT INTO usuarios (usuario, link, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

// Si algo falla con la query
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos'
    ]);
    exit();
}

// Paso los datos a la consulta
$stmt->bind_param("sss", $usuario, $link, $password);

// Ejecuto y devuelvo resultado
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

// Cierro todo al final
$stmt->close();
$conn->close();
?>