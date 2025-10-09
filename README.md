# hismar.dev

hismar.dev - Portfolio de Terminal
Un sitio web de portfolio personal para desarrolladores que simula una interfaz de terminal de Linux.
Ofrece una experiencia interactiva de línea de comandos, permitiendo la navegación tanto con un menú clicable como mediante la introducción de comandos por teclado.

Features
🖥️ LCaracterísticas
🖥️ Simulación de Terminal Linux: Apariencia y sensación auténtica de una terminal con un tema oscuro.
⌨️ Interfaz de Línea de Comandos: Ejecuta comandos escribiéndolos.
🖱️ Menú Clicable: Navega por las secciones usando la barra de menú.
📜 Historial de Comandos: Usa las teclas de flecha (↑/↓) para navegar por el historial de comandos.
✨ Autocompletado con Tab: Pulsa la tecla Tab para autocompletar comandos.
🎨 Diseño Adaptable (Responsive): Funciona en dispositivos de escritorio y móviles.

Estructura:
Usar una estructura modular limpia y sencilla.
Usar JavaScript, CSS y HTML; no introducir frameworks externos.

Lógica:
Usar una lógica de sandbox (entorno aislado) para las funciones que lanzan los comandos con animaciones, para que no se congele o se vea afectado al lanzar un comando más de una vez seguida.

Visual:
Simular una consola retro de Linux con tema oscuro, con el prompt en la parte inferior, un encabezado con un menú en la parte superior y también a la derecha, dentro de la consola. Incluir botones con iconos: un botón de skip (saltar) que hace que el tipeo y la animación sean instantáneos, y un botón clear (limpiar) que limpia la consola y la deja como nueva.

Comandos Disponibles:

help - Muestra todos los comandos y su explicaciones con colorines y buena presentacion.

about - (este es la pagina de incio y el comando viene ya predeterminado)
Muestra a la derecha una cara en pixelart con ojos 3x3 en el que la pupila es 1 y va moviendose siguiendo la direccion del puntero del mouse
Muestra mi nombre y apellidos: Ismail Haddouche Rhali
Muestra mi edad calculada segun mi fecha de nacimiento: 14/05/1988
Muestra mi profesion: Developer/Devop
Muestra mi perfil github y Linkedin
Muestra una descripcion personal sobre mi:  Desarrollador apasionado de la tecnología y la informática. Friki de los videojuegos de mesa, el anime  y la lectura de fantasía. Fan de Zerocalcare. Y mas friki aún del cloud computing, estructura de sistemas y la ciberseguridad.

skills -
Muestra un cerebro estilo pixel art absorviendo cosas, esas cosas son los logos de las tecnologias que sé  que tienen patas y van corriendo cerca del cerrebro hasta que las absorve todas y abre los ojos y se queda persiguiendo con los ojos al puntero del raton.+
Despues muestra secciones cada una con los badges de la tecnologia indicada usando un logo svg real y el nombre
Lenguajes: Kotlin, Python, Java, C#, SQL
Bases de datos: Sqlite, Mysql, Postgresql, MongoDB, Firebase
Cloud: Aws, Terraform, CI/CD
Control de versiónes: Git, Github

projects - See my projects and work
Muestra con un estilo pixert art alguien encajando piezas de tetris en una pantalla de tubo retro hasta que acaba de encajarlas todas y se queda mirando al frente mientras mueve los ojos con el puntero del raton
TetrisCV: plantilla printable de estructura y estilo de un CV retro y con temática de tetris facil de imprimir en DINA 4 (html css)
hismar.dev: Web personal que simula consola de linux con comandos y estilo retro y pixelart. (html css javascript)
TimeTutor: Aplicación android para gestion de clases de profesores particulares con horarios y pagos (Kotlin, Firebase)
PyControl: Sistema completo de fichaje de jornadas laborales cumpliendo la legislación español en hardware y OS de Raspberry py (python, sqlite, linux, raspberry Pi)

education -
Muestra un muñeco con una grua apilando ladrillos los ladrillos son los badges de las formaciones apilandose uno encima de otro cuando acaba se queda con el brazo de la grua persiguiendo y rotando segun la puntera del raton
Bachillerato IES Ricardo Ortega 2004/2006
Desarrollo de aplicaciones multiplataforma ILERNA 2023/2025
Grado en Informática UNED 2025/presente


