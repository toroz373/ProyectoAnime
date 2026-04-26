<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$input = json_decode(file_get_contents("php://input"), true);
$text = $input["text"] ?? "";

if (!$text) {
    echo json_encode(["error" => "No text provided"]);
    exit;
}

$url = "https://api.mymemory.translated.net/get?q=" . urlencode($text) . "&langpair=en|es";

// --- cURL ---
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0"); // 🔥 NECESARIO
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

// --- Manejo de errores ---
if ($error) {
    echo json_encode(["error" => "cURL error: $error"]);
    exit;
}

echo $response;
