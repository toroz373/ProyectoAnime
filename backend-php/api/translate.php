<?php
// Configurar headers para permitir solicitudes desde cualquier origen
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Obtener texto del cuerpo de la solicitud
$input = json_decode(file_get_contents("php://input"), true);
$text = $input["text"] ?? "";

// Validar que se recibio texto
if (!$text) {
    echo json_encode(["error" => "No text provided"]);
    exit;
}

// URL de la API de traduccion MyMemory
$url = "https://api.mymemory.translated.net/get?q=" . urlencode($text) . "&langpair=en|es";

// --- cURL - Configurar peticion HTTP
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0"); // User-Agent necesario para la API
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

// Ejecutar la peticion
$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

// --- Manejo de errores - Verificar si hubo error en la peticion
if ($error) {
    echo json_encode(["error" => "cURL error: $error"]);
    exit;
}

// Responder con la traduccion
echo $response;
