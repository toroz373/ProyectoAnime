<?php

$allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'http://localhost',
    'http://127.0.0.1'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=miruzone;charset=utf8", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("DB Connection Error: " . $e->getMessage());
    echo json_encode(['error' => 'Error de conexión a la base de datos', 'detail' => $e->getMessage()]);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['average']) && isset($_GET['animeId'])) {
            $stmt = $pdo->prepare("SELECT AVG(rating) AS avg_rating FROM comments WHERE anime_id = ?");
            $stmt->execute([$_GET['animeId']]);
            echo json_encode($stmt->fetch() ?: ['avg_rating' => 0]);
            exit;
        }

        if (!isset($_GET['animeId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'animeId requerido']);
            exit;
        }

        $animeId = $_GET['animeId'];
        error_log("Fetching comments for animeId: " . $animeId);
        
        $stmt = $pdo->prepare("SELECT c.*, u.link AS user_link FROM comments AS c LEFT JOIN usuarios AS u ON c.user_id = u.id WHERE c.anime_id = ? ORDER BY c.created_at DESC");
        $stmt->execute([$animeId]);

        $results = $stmt->fetchAll();
        error_log("Comments found: " . count($results));
        echo json_encode($results);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        error_log("Raw POST data: " . $raw);
        $data = json_decode($raw, true);

        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido', 'detail' => json_last_error_msg()]);
            exit;
        }

        if (!isset($data['anime_id'], $data['user_id'], $data['content'], $data['rating'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            exit;
        }

        // Validate user_id exists
        if (!$data['user_id'] || $data['user_id'] <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Usuario inválido. Debes estar autenticado para comentar']);
            exit;
        }

        // Check if user exists
        $stmtCheck = $pdo->prepare("SELECT id FROM usuarios WHERE id = ?");
        $stmtCheck->execute([$data['user_id']]);
        if (!$stmtCheck->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'El usuario no existe']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO comments (anime_id, user_id, content, rating) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['anime_id'],
            $data['user_id'],
            $data['content'],
            $data['rating']
        ]);

        $stmt = $pdo->prepare("SELECT c.*, u.link AS user_link FROM comments AS c LEFT JOIN usuarios AS u ON c.user_id = u.id WHERE c.id = ?");
        $stmt->execute([$pdo->lastInsertId()]);
        $comment = $stmt->fetch();

        echo json_encode($comment ?: [
            'id' => $pdo->lastInsertId(),
            'anime_id' => $data['anime_id'],
            'user_id' => $data['user_id'],
            'content' => $data['content'],
            'rating' => $data['rating'],
            'created_at' => date('Y-m-d H:i:s')
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if (!isset($_GET['id']) || !isset($_GET['userId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'id y userId requeridos']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'], $_GET['userId']]);

        echo json_encode(['success' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Server Error: " . $e->getMessage() . " | Trace: " . $e->getTraceAsString());
    echo json_encode(['error' => 'Error en el servidor', 'detail' => $e->getMessage()]);
}
