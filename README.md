Miruzone
Este proyecto fue generado utilizando Angular CLI versión 21.2.3.

Instalación inicial del proyecto
Antes de ejecutar el proyecto, sigue estos pasos:

Descomprime la carpeta del proyecto.

Abre una terminal dentro de la carpeta del proyecto.

Instala todas las dependencias necesarias ejecutando:

bash
npm install
Esto descargará todos los módulos requeridos para que Angular pueda funcionar correctamente.

Preparación del proyecto en XAMPP
Para que el proyecto funcione junto con la base de datos:

Copia la carpeta del proyecto descomprimido dentro de:

Código
C:\xampp\htdocs\
Inicia XAMPP y activa:

Apache

MySQL

Despliegue de la base de datos
Dentro del proyecto encontrarás un archivo SQL con la base de datos llamada miruzon.

Para importarla:

Abre phpMyAdmin desde:

Código
http://localhost/phpmyadmin/
Crea una nueva base de datos llamada:

Código
miruzon
Ve a Importar.

Selecciona el archivo SQL incluido en el proyecto.

Ejecuta la importación.

La base de datos quedará lista para ser utilizada.

Servidor de desarrollo
Para iniciar un servidor de desarrollo local, ejecuta:

bash
ng serve
Luego abre en tu navegador:

Código
http://localhost:4200/
La aplicación se recargará automáticamente al modificar archivos fuente.

Iniciar sesión:
Se puede acceder sin usuario teniendo limitadas las acciones, para acceder con todo las herramientas debes de darte de alta usando la funcion en la pantalla principal de nuevo usuario.
