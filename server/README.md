# Backend de Josse Music — despliegue en producción

El sitio se publica como una app **estática** (HTML/JS/CSS). Ese sitio estático
**no puede ejecutar este backend** (Node + SQLite + subida de archivos) — por eso,
para que el panel de administración y las compras funcionen en la versión
**publicada**, este backend debe desplegarse por separado, en un servicio que
mantenga procesos Node corriendo 24/7.

## Opción recomendada: Render.com (tiene plan gratuito)

1. Crea una cuenta en https://render.com
2. "New +" → "Web Service" → conecta este repositorio (o sube la carpeta `server/`).
3. Configuración:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Variables de entorno (pestaña "Environment"):
   - `PORT` → `4000` (Render puede ignorarlo e inyectar el suyo, está bien, el código lo respeta)
   - `HOST` → `0.0.0.0` (IMPORTANTE: en Render sí debe ser público, a diferencia del entorno de edición)
   - `ADMIN_PASSWORD` → tu contraseña real de administrador
   - `JWT_SECRET` → una cadena larga y aleatoria (ej. generada con `openssl rand -hex 32`)
   - `CORS_ORIGIN` → la URL real de tu sitio publicado, ej. `https://tuartista.com`
5. **Disco persistente** (para que `data.sqlite` y `uploads/` no se borren en cada redeploy):
   - En Render, agrega un "Persistent Disk" montado en `/opt/render/project/src/server`
     (o la ruta donde Render clone el proyecto), con al menos 1GB.
6. Despliega. Render te dará una URL pública, ej: `https://josse-music-api.onrender.com`

## Conectar el frontend publicado a este backend

En el proyecto del **frontend** (este mismo repo, carpeta raíz), define la variable
de entorno de build:

```
VITE_API_URL=https://josse-music-api.onrender.com
```

HyperDev debe inyectar esta variable al publicar el sitio estático. Si tu flujo de
publicación no permite variables de entorno de build, puedes fijar directamente la
URL en `src/utils/api.js` (constante `PRODUCTION_API_URL`).

## Nota sobre el entorno de edición actual

Mientras editas en este workspace, el backend sigue corriendo localmente dentro del
mismo contenedor (arrancado automáticamente por `vite.config.js`) y Vite le hace
proxy en `127.0.0.1:4000`. Eso seguirá funcionando igual para probar aquí — el
despliegue en Render es necesario únicamente para que funcione en la URL ya
**publicada** del sitio.
