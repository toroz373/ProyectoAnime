<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$input = json_decode(file_get_contents("php://input"), true);
$text = $input["text"] ?? "";

$url = "https://api.mymemory.translated.net/get?q=" . urlencode($text) . "&langpair=en|es";

$response = file_get_contents($url);

echo $response;
