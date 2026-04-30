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
    echo json_encode(["exito" => false]);
    exit;
}

// obtener avatar
$sql = "SELECT avatar FROM usuarios WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && $user['avatar']) {
    $ruta = __DIR__ . "/../uploads/" . $user['avatar'];

    if (file_exists($ruta)) {
        unlink($ruta);
    }
}

// actualizar BD 
$sql2 = "UPDATE usuarios SET avatar=NULL WHERE id=?";
$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("i", $id);

if ($stmt2->execute()) {
    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["exito" => false]);
}
?>