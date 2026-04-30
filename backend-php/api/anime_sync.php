<?php

// CORS - Configurar headers para permitir solicitudes desde cualquier origen

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");


// CONEXIÓN A LA BD - Conectar a la base de datos MySQL

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=miruzone;charset=utf8", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error de conexión', 'detail' => $e->getMessage()]);
    exit;
}

// FUNCIÓN: GUARDAR SI NO EXISTE - Funcion para insertar un anime solo si no existe

function saveAnimeIfNotExists($pdo, $anime) {
    $api_id = $anime['mal_id'];
    $title = $anime['title'] ?? 'Sin título';
    $image = $anime['images']['jpg']['image_url'] ?? null;
    $description = $anime['synopsis'] ?? null;

    // Verificar si existe - Comprobar si el anime ya esta en la base de datos
    $stmt = $pdo->prepare("SELECT id FROM animes WHERE api_id = ?");
    $stmt->execute([$api_id]);

    // Si ya existe, retornar false
    if ($stmt->fetch()) {
        return false; 
    }

    // Insertar - Guardar el nuevo anime
    $stmt = $pdo->prepare(
        "INSERT INTO animes (api_id, title, image, description) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$api_id, $title, $image, $description]);

    return true;
}

// DESCARGAR Y GUARDAR ANIMES - Obtener animes de la API externa Jikan

$insertados = 0;
$paginas = 10;

// Recorrer las paginas de la API
for ($page = 1; $page <= $paginas; $page++) {

    $url = "https://api.jikan.moe/v4/anime?page=$page";

    $json = file_get_contents($url);
    if (!$json) continue;

    $data = json_decode($json, true);
    if (!isset($data['data'])) continue;

    // Procesar cada anime
    foreach ($data['data'] as $anime) {
        if (saveAnimeIfNotExists($pdo, $anime)) {
            $insertados++;
        }
    }

    // Esperar 400ms entre peticiones para no sobrecargar la API
    usleep(400000);
}

// Responder con el resultado
echo json_encode([
    'status' => 'ok',
    'insertados' => $insertados,
    'mensaje' => "Proceso completado"
]);
