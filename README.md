# Examen Frontend Tienda de Dispositivos

Este proyecto es una aplicación web desarrollada en Angular para la gestión de una tienda de dispositivos electrónicos. Permite la administración de empresas, usuarios, login, visualización de productos, contacto y gestión de redes sociales, entre otras funcionalidades.

## Características principales

- **Login de usuarios** con validación y control de acceso.
- **Panel de administración** para gestionar empresas y usuarios.
- **Edición y visualización de datos de la empresa**.
- **Gestión de usuarios** (crear, editar, eliminar).
- **Gestión de redes sociales** en el pie de página.
- **Página de inicio** con banner y encabezado.
- **Página de contacto** (simulada o con integración a EmailJS).
- **Pruebas automatizadas** de frontend con Jest.
- **Diseño responsivo** y componentes reutilizables.

## Estructura del proyecto

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard-component/
│   │   ├── empresa-component/
│   │   └── usuario-component/
│   ├── componentes/
│   │   ├── banner/
│   │   ├── encabezado/
│   │   ├── menu/
│   │   └── pie-pagina/
│   ├── login/
│   │   └── login-component/
│   ├── modelos/
│   ├── paginas/
│   │   ├── contactos/
│   │   └── inicio/
│   ├── servicios/
│   │   ├── auth-service.ts
│   │   ├── empresa-servicio.ts
│   │   └── usuario-service.ts
│   └── app.config.ts
├── assets/
├── environment.ts
└── main.ts
```

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/examen-frontend-tienda-dispositivos.git
   cd examen-frontend-tienda-dispositivos
   ```

2. **Instala las dependencias:**
   ```bash
   npm install --legacy-peer-deps
   ```

## Uso

### Servidor de desarrollo

Inicia el servidor de desarrollo con:

```bash
ng serve
```

Luego abre tu navegador en [http://localhost:4200/](http://localhost:4200/).

### Construcción del proyecto

Para compilar el proyecto para producción:

```bash
ng build
```

Los archivos generados estarán en la carpeta `dist/`.

### Pruebas unitarias

El proyecto utiliza **Jest** para pruebas unitarias. Ejecuta:

```bash
npm run test
```

Esto ejecutará las pruebas automatizadas de frontend, incluyendo:
- Login
- Edición de empresa
- Gestión de usuarios
- Gestión de redes sociales

### Pruebas end-to-end

Actualmente no se incluye un framework e2e por defecto. Puedes agregar [Cypress](https://www.cypress.io/) o [Playwright](https://playwright.dev/) si lo necesitas.

## Configuración de EmailJS (opcional)

Si deseas habilitar el envío de correos desde la página de contacto, instala la dependencia y configura tus credenciales en el archivo correspondiente:

```bash
npm install @emailjs/browser --legacy-peer-deps
```

Edita `src/app/paginas/contactos/contactos.ts` con tus datos de servicio.

## Scripts útiles

- `ng serve` — Inicia el servidor de desarrollo.
- `ng build` — Compila el proyecto para producción.
- `npm run test` — Ejecuta las pruebas unitarias con Jest.

## Requisitos

- Node.js >= 18.x
- Angular CLI >= 20.x
- TypeScript >= 5.8.x < 5.9.x

## Demostración en Video

Puedes ver el funcionamiento completo de la aplicación en el siguiente enlace:
https://drive.google.com/drive/folders/1CV__0EaDBY7AxtOuttecwbbiK85R3bMP?usp=drive_link

## Monitoreo de Métricas

La aplicación cuenta con monitoreo habilitado mediante Spring Boot Actuator y VisualVM. Puedes acceder a las métricas de solicitudes HTTP desde:
http://localhost:8081/actuator/metrics/http.server.requests
