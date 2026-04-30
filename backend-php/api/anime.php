<?php

// CORS (FUNCIONA CON ANGULAR) - Configurar headers para permitir solicitudes desde el frontend

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
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Credentials: true');

// Responder a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');


// CONEXIÓN A LA BD - Conectar a la base de datos MySQL

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=miruzone;charset=utf8", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos', 'detail' => $e->getMessage()]);
    exit;
}


// MÉTODO GET - Obtener animes de la base de datos

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Buscar por api_id - Obtener un anime especifico por su ID externo
    if (isset($_GET['api_id'])) {
        $stmt = $pdo->prepare("SELECT * FROM animes WHERE api_id = ?");
        $stmt->execute([$_GET['api_id']]);
        echo json_encode($stmt->fetch() ?: []);
        exit;
    }

    // Listar todos - Obtener todos los animes ordenados por ID descendente
    $stmt = $pdo->query("SELECT * FROM animes ORDER BY id DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// MÉTODO POST (GUARDAR ANIME) - Insertar nuevo anime en la base de datos

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    // Validar que el JSON sea valido
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido', 'detail' => json_last_error_msg()]);
        exit;
    }

    // Validar que se recibieron los datos requeridos
    if (!isset($data['api_id'], $data['title'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos incompletos']);
        exit;
    }

    $api_id = $data['api_id'];
    $title = $data['title'];
    $image = $data['image'] ?? null;
    $description = $data['description'] ?? null;

    // 1. Comprobar si ya existe - Verificar si el anime ya esta en la base de datos
    $stmt = $pdo->prepare("SELECT * FROM animes WHERE api_id = ?");
    $stmt->execute([$api_id]);
    $existing = $stmt->fetch();

    // Si ya existe, devolver el anime existente
    if ($existing) {
        echo json_encode($existing);
        exit;
    }

    // 2. Insertar si no existe - Guardar el nuevo anime
    $stmt = $pdo->prepare(
        'INSERT INTO animes (api_id, title, image, description) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$api_id, $title, $image, $description]);

    echo json_encode([
        'id' => $pdo->lastInsertId(),
        'api_id' => $api_id,
        'title' => $title,
        'image' => $image,
        'description' => $description,
        'created_at' => date('Y-m-d H:i:s')
    ]);
    exit;
}


// MÉTODO NO PERMITIDO - Responder con error si el metodo no es valido

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
