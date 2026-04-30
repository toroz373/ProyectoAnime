<?php
// Configurar headers para permitir solicitudes desde el frontend de Angular
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
    echo json_encode(["ok" => false, "error" => "ID no recibido"]);
    exit;
}

// Iniciar transaccion para garantizar integridad de los datos
$conn->begin_transaction();

try {

    // Obtener el nombre del archivo avatar del usuario
    $stmt0 = $conn->prepare("SELECT avatar FROM usuarios WHERE id = ?");
    $stmt0->bind_param("i", $id);
    $stmt0->execute();
    $result = $stmt0->get_result();
    $user = $result->fetch_assoc();

    // Si el usuario tiene avatar, eliminar el archivo de imagen del servidor
    if ($user && $user['avatar']) {
        $filePath = "../uploads/" . $user['avatar'];

        if (file_exists($filePath)) {
            unlink($filePath); // Eliminar archivo fisico del servidor
        }
    }

    // Eliminar todos los comentarios asociados al usuario
    $stmt1 = $conn->prepare("DELETE FROM comments WHERE user_id = ?");
    $stmt1->bind_param("i", $id);
    $stmt1->execute();

    // Eliminar el registro del usuario de la base de datos
    $stmt2 = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();

    // Confirmar la transaccion
    $conn->commit();

    // Responder con exito
    echo json_encode(["ok" => true]);

} catch (Exception $e) {
    // Revertir todos los cambios si ocurre un error
    $conn->rollback();

    // Responder con error
    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}
?>