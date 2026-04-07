<?php
header('Content-Type: application/json');
include '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$usuario = $data['usuario'];
$password = $data['password'];

$sql = "SELECT * FROM usuarios WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => true,
            'message' => 'Login correcto',
            'usuario' => $user['usuario']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Contraseña incorrecta'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no encontrado'
    ]);
}
?>