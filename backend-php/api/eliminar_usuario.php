<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode([
        "ok" => false,
        "error" => "ID no recibido"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    // 1. BORRAR COMENTARIOS DEL USUARIO (tu tabla es comments)
    $stmt1 = $conn->prepare("DELETE FROM comments WHERE user_id = ?");
    $stmt1->bind_param("i", $id);
    $stmt1->execute();

    // 2. BORRAR USUARIO
    $stmt2 = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();

    $conn->commit();

    echo json_encode([
        "ok" => true
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}
?>