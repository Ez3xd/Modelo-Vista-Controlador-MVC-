# Directorio de usuarios — MVC con TypeScript

Pequeña aplicación web para practicar el patrón Modelo-Vista-Controlador (MVC). Permite registrar usuarios, validar sus datos y eliminarlos. Los registros viven en memoria y se reinician al recargar la página.

## Ejecutar

Requiere Node.js y npm.

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que indique Vite. Para comprobar la compilación de TypeScript y generar la versión de producción:

```bash
npm run build
npm run preview
```

## Estructura y responsabilidades

- `src/model/UserModel.ts`: contiene el tipo `User`, los datos, las reglas de validación, el alta/baja de usuarios y las notificaciones de cambios. No importa ni conoce la interfaz.
- `src/view/UserView.ts`: representa usuarios en el DOM y captura los eventos del formulario y los botones. Notifica las acciones mediante handlers; no modifica el modelo.
- `src/controller/UserController.ts`: recibe esos eventos, invoca las operaciones del modelo y actualiza la vista con los resultados.
- `src/main.ts`: crea el modelo y la vista y los conecta mediante el controlador.

## Flujo de ejemplo

1. La vista captura el envío del formulario y llama al handler del controlador.
2. El controlador envía los datos al modelo.
3. El modelo normaliza y valida el nombre y el correo, y rechaza correos repetidos.
4. Al cambiar los datos, el modelo notifica a sus suscriptores.
5. El controlador actualiza la vista y muestra el resultado al usuario.
