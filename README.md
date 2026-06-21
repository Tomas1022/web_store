# 🎮 Tienda de Juegos

Plataforma full-stack de e-commerce para videojuegos, con autenticación avanzada, pagos reales y panel administrativo completo.

## Stack

**Backend:** Node.js · Express · MySQL · JWT · bcrypt  
**Frontend:** React · Vite · Tailwind CSS · React Router  
**Pagos:** MercadoPago (Checkout Pro)  
**Otros:** Multer (uploads), Nodemailer, Speakeasy (2FA)

## Arquitectura

Backend organizado en capas (MVC):

```
routes/        → definición de endpoints
controllers/   → lógica de negocio
models/        → acceso a base de datos
middlewares/   → autenticación JWT, upload de archivos
```

## Funcionalidades

**Autenticación y seguridad**
- Registro con verificación de email por código
- Login con JWT + autenticación de dos factores (Google Authenticator)
- Recuperación de contraseña por correo
- Rutas protegidas con middleware
- Roles de usuario y administrador

**Catálogo y compras**
- Catálogo con búsqueda por nombre, género y desarrollador
- Página de detalle por juego (descripción, requisitos, reseñas)
- Carrito de compras persistente con control de cantidades
- Checkout con MercadoPago (pagos reales en sandbox)
- Generación automática de recibos e historial de compras

**Panel de administrador**
- CRUD completo de juegos (con subida de imágenes por drag & drop)
- Gestión de desarrolladores
- Control de stock y precios

**Perfil de usuario**
- Foto de perfil, biografía y ubicación editables
- Activación de 2FA
- Eliminación de cuenta con verificación de contraseña

## Base de datos

Modelo relacional con las siguientes entidades: `usuarios`, `juegos`, `desarrolladores`, `carrito`, `compras`, `recibos`, `resenas`.

## Instalación local

```bash
# Backend
cd Backend
npm install
node index.js

# Frontend
cd Frontend
npm install
npm run dev
```

Requiere un archivo `.env` en `Backend/` con las credenciales de base de datos, JWT, correo (Nodemailer) y MercadoPago.
