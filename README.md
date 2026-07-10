# CeluFix - Sistema de Gestión de Taller de Reparación de Celulares

CeluFix es una aplicación web para la gestión integral de un taller de reparación de celulares. Permite a técnicos y administradores registrar clientes, recepcionar equipos, dar seguimiento al estado de las reparaciones y registrar entregas.

Este proyecto opera exclusivamente con datos locales (sin backend), como parte de un proyecto académico Full Stack.

## Instalación y Ejecución

### Requisitos Previos

- Node.js (v18 o superior)
- npm

### Pasos

```bash
# 1. Navegar al directorio del proyecto
cd celufix

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. (Opcional) Construir para producción
npm run build

# 5. (Opcional) Previsualizar la build de producción
npm run preview
```

La aplicación estará disponible en `http://localhost:5173` (modo desarrollo).

## Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin CeluFix | admin@celufix.com | admin123 | Administrador |
| Pedro Técnico | pedro@celufix.com | tecnico123 | Técnico |

## Estructura del Proyecto

```
celufix/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── AuthRedirectRoute.jsx   # Redirige a Dashboard si ya autenticado
│   │   ├── Button.jsx              # Botón con variantes (primary, secondary, danger)
│   │   ├── Card.jsx                # Contenedor visual reutilizable
│   │   ├── Footer.jsx              # Pie de página
│   │   ├── FormInput.jsx           # Input de formulario con validación
│   │   ├── Navbar.jsx              # Barra de navegación responsiva
│   │   ├── OrderCard.jsx           # Tarjeta resumen de orden
│   │   ├── ProtectedRoute.jsx      # Protección de rutas autenticadas
│   │   └── StatusBadge.jsx         # Badge de estado con colores
│   ├── data/                # Datos locales (JSON)
│   │   ├── clients.json            # Clientes de ejemplo
│   │   ├── orders.json             # Órdenes de ejemplo
│   │   └── users.json              # Usuarios del sistema
│   ├── pages/               # Páginas de la aplicación
│   │   ├── About.jsx               # Acerca del proyecto
│   │   ├── Clients.jsx             # Listado de clientes
│   │   ├── Dashboard.jsx           # Panel con todas las órdenes
│   │   ├── Home.jsx                # Página de inicio
│   │   ├── Login.jsx               # Inicio de sesión
│   │   ├── NewOrder.jsx            # Formulario de nueva orden
│   │   ├── OrderDetail.jsx         # Detalle y gestión de orden
│   │   └── Register.jsx            # Registro de usuarios
│   ├── App.jsx              # Componente raíz (estado global y rutas)
│   ├── App.css              # Estilos generales de la app
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos base
├── index.html               # HTML principal
├── package.json             # Dependencias y scripts
└── vite.config.js           # Configuración de Vite
```

## Rutas de la Aplicación

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Home | Público |
| `/login` | Login | Público (redirige a Dashboard si autenticado) |
| `/register` | Register | Público (redirige a Dashboard si autenticado) |
| `/dashboard` | Dashboard | Protegida |
| `/nueva-orden` | Nueva Orden | Protegida |
| `/orden/:id` | Detalle de Orden | Protegida |
| `/clientes` | Clientes | Protegida |
| `/about` | Acerca de | Público |

## Flujo de Estados de Orden

```
en_espera → en_reparación → listo → entregado
```

- **En espera**: Orden recibida, campos técnicos deshabilitados.
- **En reparación**: Se habilitan diagnóstico, repuestos, procedimiento y costo.
- **Listo**: Reparación completada, pendiente de entrega.
- **Entregado**: Requiere condiciones de entrega, se asigna fecha automáticamente.

## Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaces de usuario
- **Vite 5** - Herramienta de construcción y servidor de desarrollo
- **React Router DOM 6** - Navegación SPA (Single Page Application)
- **CSS puro** - Estilos con media queries para diseño responsivo
- **JavaScript (ES6+)** - Lógica de la aplicación

## Características Principales

- Autenticación simulada con datos locales
- Protección de rutas según estado de autenticación
- Formularios con validación en tiempo real
- Diseño responsivo (escritorio, tablet y móvil)
- Filtrado y búsqueda de órdenes y clientes
- Gestión completa del ciclo de vida de una reparación
- Componentes reutilizables con props

## Notas Importantes

- Los datos se almacenan en memoria durante la sesión. Al recargar la página, los datos vuelven a su estado inicial (cargados desde los archivos JSON).
- No se requiere backend ni base de datos para ejecutar la aplicación.
