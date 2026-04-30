<?php
// Configurar headers para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");

// Incluir archivo de conexion a la base de datos
include '../config/database.php';

// Obtener ID del usuario
$id = $_POST['id'];

// Verificar si se recibio un archivo
if (isset($_FILES['imagen'])) {

    // Generar nombre unico para el archivo
    $nombreArchivo = time() . "_" . $_FILES['imagen']['name'];
    $ruta = "../uploads/" . $nombreArchivo;

    // Mover el archivo subido al directorio de uploads
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta)) {

    // Obtener avatar actual - Buscar el avatar anterior del usuario
        $sql_old = "SELECT avatar FROM usuarios WHERE id=?";
        $stmt_old = $conn->prepare($sql_old);
        $stmt_old->bind_param("i", $id);
        $stmt_old->execute();
        $result = $stmt_old->get_result();
        $old = $result->fetch_assoc();

        // Si existe un avatar anterior, eliminarlo
        if ($old && $old['avatar']) {
            $oldPath = "../uploads/" . $old['avatar'];

            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        // Actualizar la base de datos con el nuevo avatar
        $sql = "UPDATE usuarios SET avatar=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $nombreArchivo, $id);
        $stmt->execute();

        // Responder con exito
        echo json_encode([
            "exito" => true,
            "avatar" => $nombreArchivo
        ]);
    } else {
        echo json_encode(["exito" => false]);
    }
}
?>