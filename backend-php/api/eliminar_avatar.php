<?php
// Configurar headers para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Responder a solicitudes preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir archivo de conexion a la base de datos
include '../config/database.php';

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

// Validar que se recibio el ID del usuario
if (!$id) {
    echo json_encode(["exito" => false]);
    exit;
}

// Obtener avatar actual - Buscar el nombre del archivo avatar del usuario
$sql = "SELECT avatar FROM usuarios WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Si el usuario tiene avatar, eliminar el archivo fisico
if ($user && $user['avatar']) {
    $ruta = __DIR__ . "/../uploads/" . $user['avatar'];

    if (file_exists($ruta)) {
        unlink($ruta); // Eliminar archivo del servidor
    }
}

// Actualizar BD - Establecer el campo avatar a NULL
$sql2 = "UPDATE usuarios SET avatar=NULL WHERE id=?";
$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("i", $id);

// Responder con el resultado
if ($stmt2->execute()) {
    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["exito" => false]);
}
?>