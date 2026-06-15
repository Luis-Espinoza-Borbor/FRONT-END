# Tu Ayuda en Casa 🏡🛠️

**Tu Ayuda en Casa** es una plataforma web integral (E-commerce de servicios) diseñada para conectar hogares en Guayaquil con profesionales de confianza para resolver tareas domésticas como limpieza, gasfitería, pintura, electricidad y cuidado de niños.

Este proyecto fue desarrollado como evaluación final para la asignatura de Lenguaje Frontend.

## 👥 Autores
* **Espinoza Borbor Luis Alberto**
* **Oleas Potes Danny Javier**
* **Institución:** Instituto Superior Tecnológico Liceo Cristiano (ISTLC)
* **Fecha:** Junio 2026

---

## 🚀 Características Principales

El proyecto consta de 20 pantallas interactivas que incluyen:
1. **Sistema Multi-Perfil:** Accesos diferenciados para Administrador, Cliente y Trabajador.
2. **Catálogo Dinámico:** Filtrado de profesionales por nombre y categoría.
3. **Flujo de Contratación:** Agendamiento de citas, cálculo automático de horas/tarifas y pasarela de pago simulada.
4. **Panel Administrativo:** Dashboard con métricas en tiempo real, gestión de trabajadores (aprobación/rechazo), gestión de categorías y buzón de entrada.
5. **Generación de Facturas:** Emisión de comprobantes detallados con cálculo de subtotal e IVA.
6. **Sistema de Reseñas:** Calificación de 1 a 5 estrellas para los trabajos finalizados.
7. **Modo Oscuro Integrado:** Cambio de tema (Dark/Light) persistente en toda la navegación.
8. **Diseño Corporativo:** Interfaz unificada, responsive y basada en paletas de colores de alta confianza institucional.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica en los 20 documentos.
* **CSS3:** Estilos personalizados, variables globales (`:root`), diseño adaptativo y control absoluto del Modo Oscuro.
* **JavaScript (Vanilla):** Lógica pura sin frameworks. Manipulación del DOM, cálculos matemáticos y renderizado dinámico.
* **LocalStorage:** Utilizado como base de datos local en el navegador (simulación de Backend).
* **Bootstrap 5.3.2:** Framework CSS para el sistema de grillas (Grid), Navbar, Modales y Carruseles.
* **Librerías Externas:** * [SweetAlert2](https://sweetalert2.github.io/): Para ventanas de alerta y confirmación elegantes.
  * [Bootstrap Icons](https://icons.getbootstrap.com/): Para la iconografía vectorial.

---

## ⚙️ Instrucciones de Instalación y Ejecución

No requiere instalación de servidores Backend ni bases de datos SQL.

1. **Descargar el proyecto:** Descomprimir el archivo `.zip` en tu computadora.
2. **Abrir en el Editor:** Abrir la carpeta del proyecto en Visual Studio Code.
3. **Ejecutar Live Server:** * Instalar la extensión "Live Server" en VS Code si no se tiene.
   * Hacer clic derecho sobre el archivo `index.html` y seleccionar **"Open with Live Server"**.
4. **Requisitos:** Un navegador web moderno (Google Chrome, Firefox, Edge o Safari).

### Credenciales de Prueba (Testing)
Para evaluar las funcionalidades del sistema sin necesidad de registrar nuevos usuarios, se pueden utilizar las siguientes credenciales en la pantalla de *Login*:

* **Rol Administrador:**
  * Correo: `admin@admin.com`
  * Clave: `123456`

*(Para probar los roles de Cliente o Trabajador, se recomienda utilizar los formularios de registro incluidos en la plataforma).*

---

## 📂 Estructura de Archivos

```text
📁 Tu-Ayuda-En-Casa/
│
├── 📁 assets/          # Imágenes, fotografías y logos del sistema.
├── 📁 css/             
│   └── styles.css      # Hoja de estilos principal y Modo Oscuro.
├── 📁 js/              
│   └── app.js          # Lógica central del aplicativo web.
│
├── index.html          # Página principal (Landing Page)
├── servicios.html      # Catálogo de profesionales
├── login.html          # Inicio de sesión multi-perfil
├── registro.html       # Registro de clientes
├── admin-dashboard.html# Panel de control del administrador
├── ...                 # (15 archivos HTML adicionales)
└── README.md           # Documentación del proyecto