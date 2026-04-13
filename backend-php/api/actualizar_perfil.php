<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$usuario = $data['usuario'];
$link = $data['link'];
$descripcion = $data['descripcion'];
$tema = $data['tema'];

$sql = "UPDATE usuarios 
        SET usuario=?, link=?, descripcion=?, theme=? 
        WHERE id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $usuario, $link, $descripcion, $tema, $id);

if ($stmt->execute()) {
    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["exito" => false]);
}
?>