<?php
ob_start(); // Capturar cualquier warning o echo accidental

// ============================
// CONFIGURACIÓN DE ERRORES
// ============================
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

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

if ($method === 'POST') {

    // ============================
    // ACEPTAR JSON O FORMDATA
    // ============================
    $input = json_decode(file_get_contents("php://input"), true);

    $user_id = $_POST['user_id'] 
            ?? ($input['user_id'] ?? null);

    $anime_id = $_POST['anime_id'] 
            ?? ($input['anime_id'] ?? null);

    $status = $_POST['status'] 
            ?? ($input['status'] ?? null);

    // Log temporal para depurar
    file_put_contents("debug_post.txt", print_r([
        "POST" => $_POST,
        "JSON" => $input
    ], true));

    // ============================
    // VALIDAR PARÁMETROS
    // ============================
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

    // ============================
    // VERIFICAR SI YA EXISTE
    // ============================
    $check = $conn->prepare("SELECT id FROM user_anime_status WHERE user_id=? AND anime_id=?");
    $check->bind_param("ii", $user_id, $anime_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        // UPDATE
        $update = $conn->prepare("UPDATE user_anime_status SET status=? WHERE user_id=? AND anime_id=?");
        if (!$update) error_log("SQL UPDATE ERROR: " . $conn->error);
        $update->bind_param("sii", $status, $user_id, $anime_id);
        $update->execute();

        if ($update->errno) {
            error_log("UPDATE ERROR: " . $update->error);
        }

    } else {
        // INSERT
        $insert = $conn->prepare("INSERT INTO user_anime_status (user_id, anime_id, status) VALUES (?, ?, ?)");
        if (!$insert) error_log("SQL INSERT ERROR: " . $conn->error);
        $insert->bind_param("iis", $user_id, $anime_id, $status);
        $insert->execute();

        if ($insert->errno) {
            error_log("INSERT ERROR: " . $insert->error);
        }
    }

    // ============================
    // CAPTURAR WARNINGS
    // ============================
    $debug = ob_get_clean();
    if (!empty($debug)) {
        echo json_encode(["php_warning" => $debug]);
        exit;
    }

    echo json_encode(["success" => true]);
    exit;
}

// ============================
// SI NO ES POST
// ============================
$debug = ob_get_clean();
if (!empty($debug)) {
    echo json_encode(["php_warning" => $debug]);
    exit;
}

echo json_encode(["error" => "Invalid request"]);
