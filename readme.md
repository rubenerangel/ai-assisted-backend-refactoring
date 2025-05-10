# 🛠️ Masterclass: Refactoring Backend asistido por IA  
## Order Management API

Este proyecto es un backend desarrollado con **Node.js**, **Express** y **MongoDB**, que expone una API REST para gestionar pedidos.

Es el punto de partida que usaremos a lo largo de la masterclass para refactorizar desde un diseño en **MVC** (con malas prácticas comunes) hacia una **Arquitectura Hexagonal** más limpia, testable y sostenible.

---

## 🧱 Tecnologías utilizadas

- Node.js  
- Express  
- MongoDB  
- TypeScript  
- Jest (para testing)

---

## 📦 Requisitos previos

- Node.js (versión 20 o superior)  
- npm o yarn como gestor de paquetes  
- MongoDB local o remoto  
  - La conexión está hardcodeada en `app.ts`, puedes adaptarla según tu entorno.

👉 Puedes seguir las instrucciones de instalación de MongoDB aquí:  
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

---

## 🚀 Instalación y ejecución

1. Clona el repositorio o descarga el código fuente.  
2. En la raíz del proyecto, ejecuta:

   ```bash
   npm install
   ```

3. Para ejecutar la aplicación en modo desarrollo (con autoreload):

   ```bash
   npm run dev
   ```

---

## 🧪 Testing

Para ejecutar los tests:

```bash
npm test
```

---

## 🌿 Ramas importantes

- `initial_tests`: contiene los **tests end-to-end funcionando**. Si te atascas en esa parte de la masterclass, puedes partir desde aquí para retomar con una base estable.
  
- `sol`: incluye la **solución final completa con el refactor ya aplicado**. Úsala como referencia o para comparar tu progreso, no como punto de partida.

---

## 📡 Endpoints disponibles

- `GET /` → Health check  
- `POST /orders` → Crear un nuevo pedido  
- `GET /orders` → Listar todos los pedidos  
- `PUT /orders/:id` → Actualizar un pedido  
- `POST /orders/:id/complete` → Completar un pedido  
- `DELETE /orders/:id` → Eliminar un pedido


