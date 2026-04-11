<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

$animeId = $data["animeId"];
$user = $data["user"];
$rating = $data["rating"];

$conn = new mysqli("localhost", "root", "", "tu_base");

$sql = "SELECT id FROM ratings WHERE anime_id = $animeId AND user = '$user'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $conn->query("UPDATE ratings SET rating = $rating WHERE anime_id = $animeId AND user = '$user'");
} else {
    $conn->query("INSERT INTO ratings (anime_id, user, rating) VALUES ($animeId, '$user', $rating)");
}

echo json_encode(["success" => true]);
