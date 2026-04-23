Proyectoanime
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

Generación de código
Para crear un nuevo componente:

bash
ng generate component nombre-del-componente
Para ver todos los schematics disponibles:

bash
ng generate --help
Construcción del proyecto
Para compilar el proyecto:

bash
ng build
Los archivos generados se guardarán en dist/, optimizados para producción.

Pruebas unitarias
Para ejecutar pruebas unitarias con Vitest:

bash
ng test
Pruebas end-to-end
Para ejecutar pruebas e2e:

bash
ng e2e
Angular CLI no incluye un framework e2e por defecto, así que puedes elegir el que prefieras.

Recursos adicionales
Más información sobre Angular CLI:

Angular CLI Overview and Command Reference