<?php
// ============================
// CORS PARA ANGULAR
// ============================
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

// Responder preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================
// CONEXIÓN BD
// ============================
include '../config/database.php';

if (!$conn || $conn->connect_errno) {
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

mysqli_report(MYSQLI_REPORT_OFF);

$method = $_SERVER['REQUEST_METHOD'];


// ======================================================
// ======================   GET   ========================
// ======================================================
if ($method === 'GET') {

    $user_id = $_GET['user_id'] ?? null;
    $anime_id = $_GET['id'] ?? null;
    $status = $_GET['status'] ?? null;

    // ============================
    // 1️⃣ OBTENER LISTA POR ESTADO
    // ============================
    if ($user_id && $status) {

        $valid = ['visto', 'deseado', 'en_proceso'];
        if (!in_array($status, $valid)) {
            echo json_encode(["error" => "Invalid status"]);
            exit;
        }

        $query = $conn->prepare("
            SELECT a.*
            FROM user_anime_status uas
            JOIN animes a ON a.id = uas.anime_id
            WHERE uas.user_id = ? AND uas.status = ?
        ");

        $query->bind_param("is", $user_id, $status);
        $query->execute();

        $result = $query->get_result()->fetch_all(MYSQLI_ASSOC);

        echo json_encode($result);
        exit;
    }

    // ============================
    // 2️⃣ OBTENER ESTADO DE UN ANIME
    // ============================
    if ($user_id && $anime_id) {

        $query = $conn->prepare("
            SELECT status 
            FROM user_anime_status 
            WHERE user_id = ? AND anime_id = ?
        ");
        $query->bind_param("ii", $user_id, $anime_id);
        $query->execute();

        $result = $query->get_result()->fetch_assoc();

        echo json_encode($result ?: ["status" => null]);
        exit;
    }

    echo json_encode(["error" => "Missing parameters"]);
    exit;
}



// ======================================================
// ======================   POST   =======================
// ======================================================
if ($method === 'POST') {

    // Aceptar JSON o FormData
    $input = json_decode(file_get_contents("php://input"), true);

    $user_id = $_POST['user_id'] ?? ($input['user_id'] ?? null);
    $anime_id = $_POST['anime_id'] ?? ($input['anime_id'] ?? null);
    $status = $_POST['status'] ?? ($input['status'] ?? null);

    // Validación
    if (!$user_id || !$anime_id || !$status) {
        echo json_encode(["error" => "Missing parameters"]);
        exit;
    }

    $status = strtolower(trim($status));
    $valid = ['visto', 'deseado', 'en_proceso'];

    if (!in_array($status, $valid)) {
        echo json_encode(["error" => "Invalid status", "received" => $status]);
        exit;
    }

    // Verificar si ya existe
    $check = $conn->prepare("SELECT id FROM user_anime_status WHERE user_id=? AND anime_id=?");
    $check->bind_param("ii", $user_id, $anime_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {

        // UPDATE
        $update = $conn->prepare("UPDATE user_anime_status SET status=? WHERE user_id=? AND anime_id=?");
        $update->bind_param("sii", $status, $user_id, $anime_id);
        $update->execute();

    } else {

        // INSERT
        $insert = $conn->prepare("INSERT INTO user_anime_status (user_id, anime_id, status) VALUES (?, ?, ?)");
        $insert->bind_param("iis", $user_id, $anime_id, $status);
        $insert->execute();
    }

    // 🔥 Esperar a que MySQL termine de escribir
    $conn->query("SELECT SLEEP(0.1)");

    echo json_encode(["success" => true]);
    exit;
}



// ======================================================
// ===============   MÉTODO NO VÁLIDO   =================
// ======================================================
echo json_encode(["error" => "Invalid request"]);
exit;
