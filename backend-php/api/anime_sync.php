<?php
// =========================
// CORS
// =========================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// =========================
// CONEXIÓN A LA BD
// =========================
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=miruzone;charset=utf8", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error de conexión', 'detail' => $e->getMessage()]);
    exit;
}

// =========================
// FUNCIÓN: GUARDAR SI NO EXISTE
// =========================
function saveAnimeIfNotExists($pdo, $anime) {
    $api_id = $anime['mal_id'];
    $title = $anime['title'] ?? 'Sin título';
    $image = $anime['images']['jpg']['image_url'] ?? null;
    $description = $anime['synopsis'] ?? null;

    // Verificar si existe
    $stmt = $pdo->prepare("SELECT id FROM animes WHERE api_id = ?");
    $stmt->execute([$api_id]);

    if ($stmt->fetch()) {
        return false; // Ya existe
    }

    // Insertar
    $stmt = $pdo->prepare(
        "INSERT INTO animes (api_id, title, image, description) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$api_id, $title, $image, $description]);

    return true;
}

// =========================
// DESCARGAR Y GUARDAR ANIMES
// =========================
$insertados = 0;
$paginas = 10;

for ($page = 1; $page <= $paginas; $page++) {

    $url = "https://api.jikan.moe/v4/anime?page=$page";

    $json = file_get_contents($url);
    if (!$json) continue;

    $data = json_decode($json, true);
    if (!isset($data['data'])) continue;

    foreach ($data['data'] as $anime) {
        if (saveAnimeIfNotExists($pdo, $anime)) {
            $insertados++;
        }
    }

    usleep(400000);
}

echo json_encode([
    'status' => 'ok',
    'insertados' => $insertados,
    'mensaje' => "Proceso completado"
]);
