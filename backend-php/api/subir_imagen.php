<?php
header("Access-Control-Allow-Origin: http://localhost:4200");

include '../config/database.php';

$id = $_POST['id'];

if (isset($_FILES['imagen'])) {

    $nombreArchivo = time() . "_" . $_FILES['imagen']['name'];
    $ruta = "../uploads/" . $nombreArchivo;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta)) {

    // 🔥 obtener avatar actual
        $sql_old = "SELECT avatar FROM usuarios WHERE id=?";
        $stmt_old = $conn->prepare($sql_old);
        $stmt_old->bind_param("i", $id);
        $stmt_old->execute();
        $result = $stmt_old->get_result();
        $old = $result->fetch_assoc();

        if ($old && $old['avatar']) {
            $oldPath = "../uploads/" . $old['avatar'];

            if (file_exists($oldPath)) {
                unlink($oldPath); // 🔥 borra imagen antigua
            }
        }

        $sql = "UPDATE usuarios SET avatar=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $nombreArchivo, $id);
        $stmt->execute();

        echo json_encode([
            "exito" => true,
            "avatar" => $nombreArchivo
        ]);
    } else {
        echo json_encode(["exito" => false]);
    }
}
?>