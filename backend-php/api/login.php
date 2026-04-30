<?php
// Configurar headers para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

// Incluir archivo de conexion a la base de datos
include '../config/database.php';

// Responder a solicitudes preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

$usuario = $data['usuario'] ?? '';
$password = $data['password'] ?? '';

// Consulta para buscar el usuario en la base de datos
$sql = "SELECT id, usuario, password, theme, avatar FROM usuarios WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontro el usuario
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verificar la contrasena
    if (password_verify($password, $user['password'])) {

        // Responder con datos del usuario
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'usuario' => $user['usuario'],
                'theme' => $user['theme'] ?? 'light',
                'avatar' => $user['avatar']
            ]
        ]);

    } else {
        // Contrasena incorrecta
        echo json_encode([
            'success' => false,
            'message' => 'Contraseña incorrecta'
        ]);
    }

} else {
    // Usuario no encontrado
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no encontrado'
    ]);
}
?>