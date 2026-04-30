<?php
// Configurar headers para permitir solicitudes desde cualquier origen
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

$animeId = $data["animeId"];
$user = $data["user"];
$rating = $data["rating"];

// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "tu_base");

// Verificar si ya existe un rating para este anime y usuario
$sql = "SELECT id FROM ratings WHERE anime_id = $animeId AND user = '$user'";
$result = $conn->query($sql);

// Si existe, actualizar; si no, insertar
if ($result->num_rows > 0) {
    $conn->query("UPDATE ratings SET rating = $rating WHERE anime_id = $animeId AND user = '$user'");
} else {
    $conn->query("INSERT INTO ratings (anime_id, user, rating) VALUES ($animeId, '$user', $rating)");
}

echo json_encode(["success" => true]);
