<?php
header('Content-Type: application/json');

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Conexión BD
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=miruzone;charset=utf8", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'DB error', 'detail' => $e->getMessage()]);
    exit;
}

/*
 TABLA user_anime_status:
 id | user_id | anime_id | status (ENUM) | created_at | updated_at
*/

// =========================
// GET → obtener animes por estado
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (!isset($_GET['user_id'], $_GET['status'])) {
        echo json_encode(['error' => 'Parámetros faltantes']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT a.*
        FROM user_anime_status uas
        JOIN animes a ON a.id = uas.anime_id
        WHERE uas.user_id = ? AND uas.status = ?
        ORDER BY a.title ASC
    ");
    $stmt->execute([$_GET['user_id'], $_GET['status']]);

    echo json_encode($stmt->fetchAll());
    exit;
}

// =========================
// POST → guardar o actualizar estado
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['user_id'], $data['anime_id'], $data['status'])) {
        echo json_encode(['error' => 'Datos incompletos']);
        exit;
    }

    // Verificar si ya existe
    $stmt = $pdo->prepare("SELECT id FROM user_anime_status WHERE user_id = ? AND anime_id = ?");
    $stmt->execute([$data['user_id'], $data['anime_id']]);
    $exists = $stmt->fetch();

    if ($exists) {
        // Actualizar
        $stmt = $pdo->prepare("UPDATE user_anime_status SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $exists['id']]);
    } else {
        // Insertar
        $stmt = $pdo->prepare("INSERT INTO user_anime_status (user_id, anime_id, status) VALUES (?, ?, ?)");
        $stmt->execute([$data['user_id'], $data['anime_id'], $data['status']]);
    }

    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['error' => 'Método no permitido']);
