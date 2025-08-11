# Configuración de Firebase para Control Financiero

Esta guía te ayudará a configurar correctamente Firebase para tu aplicación de Control Financiero, permitiéndote almacenar y gestionar tus datos financieros en la nube de forma segura.

## 1. Crear un proyecto en Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Haz clic en "Añadir proyecto" o "Crear proyecto"
3. Introduce un nombre para tu proyecto, por ejemplo "ControlFinanciero"
4. Acepta los términos de servicio y haz clic en "Continuar"
5. (Opcional) Desactiva Google Analytics si no lo necesitas o configúralo según tus preferencias
6. Haz clic en "Crear proyecto"
7. Espera a que se complete la creación del proyecto

## 2. Configurar Firebase Authentication

La autenticación de usuarios te permitirá proteger tus datos financieros y acceder a ellos desde cualquier dispositivo.

1. En el menú lateral de la consola de Firebase, haz clic en "Authentication"
2. Ve a la pestaña "Sign-in method" (Métodos de inicio de sesión)
3. Habilita los métodos de autenticación que deseas usar:
   - **Correo electrónico/contraseña**: El más básico, permite a los usuarios registrarse con correo y contraseña
   - **Google**: Permite iniciar sesión con cuentas de Google
   - **Otros proveedores** (opcional): Facebook, Twitter, GitHub, etc.

### Configuración del correo electrónico/contraseña:

1. Haz clic en "Correo electrónico/contraseña"
2. Activa la opción "Habilitar"
3. (Opcional) Activa "Enlace de correo electrónico (inicio de sesión sin contraseña)" si deseas esta función
4. Haz clic en "Guardar"

### Configuración de Google:

1. Haz clic en "Google"
2. Activa la opción "Habilitar"
3. Introduce el nombre del proyecto como "Nombre público"
4. Introduce tu correo electrónico como soporte
5. Haz clic en "Guardar"

## 3. Configurar Firestore Database

Firestore es la base de datos NoSQL de Firebase donde almacenaremos todas las transacciones, categorías y metas.

1. En el menú lateral, haz clic en "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (cambiaremos esto más adelante)
4. Selecciona la ubicación del servidor más cercana a tu ubicación (por ejemplo, para Perú, selecciona "us-east1" o "southamerica-east1")
5. Haz clic en "Habilitar"

## 4. Configurar reglas de seguridad para Firestore

Las reglas de seguridad protegen tus datos y aseguran que cada usuario solo pueda acceder a sus propios datos.

1. Ve a la pestaña "Reglas" en Firestore Database
2. Reemplaza las reglas existentes con las siguientes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Acceso solo a usuarios autenticados
    match /usuarios/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;

      // Subcoleeciones del usuario
      match /{collection}/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Haz clic en "Publicar"

## 5. Configurar Firebase Hosting (opcional)

Si deseas publicar tu aplicación para acceder desde cualquier dispositivo:

1. En el menú lateral, haz clic en "Hosting"
2. Haz clic en "Comenzar"
3. Sigue las instrucciones para instalar Firebase CLI (necesitarás Node.js)
   ```
   npm install -g firebase-tools
   ```
4. Inicia sesión en Firebase desde la terminal
   ```
   firebase login
   ```
5. Inicializa tu proyecto
   ```
   firebase init
   ```
   - Selecciona "Hosting"
   - Selecciona tu proyecto Firebase
   - Especifica "ControlFinanciero" como directorio público
   - Configura como aplicación de una sola página: "Sí"
   - No sobrescribas tu archivo index.html
6. Cuando estés listo para publicar:
   ```
   firebase deploy
   ```

## 6. Configurar la aplicación web

1. En la página principal de tu proyecto en la consola de Firebase, haz clic en el icono "</>" (Agregar aplicación web)
2. Asigna un nombre a tu aplicación, por ejemplo "ControlFinanciero-Web"
3. (Opcional) Marca la opción "Firebase Hosting" si planeas usarlo
4. Haz clic en "Registrar aplicación"
5. Verás un bloque de código con la configuración. Cópialo, se verá algo así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef0123456789",
};
```

6. Abre el archivo `ControlFinanciero/js/firebase-config.js` y reemplaza la configuración existente con la que acabas de copiar

## 7. Instalar las dependencias de Firebase

Para usar Firebase en tu aplicación, debes incluir sus bibliotecas. Agrega estos scripts en tu archivo HTML principal, justo antes de tus propios scripts:

```html
<!-- Firebase App (la base) -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>

<!-- Añade los productos que usarás -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- Tus scripts -->
<script src="js/firebase-config.js"></script>
<script src="js/firebase-api.js"></script>
<script src="js/firebase-utils.js"></script>
<script src="js/firebase-app.js"></script>
```

## 8. Iniciar la aplicación

Ahora tu aplicación está configurada para usar Firebase. Para comenzar:

1. Abre `index-firebase.html` en tu navegador
2. Regístrate con una cuenta de correo o con Google
3. Comienza a registrar tus transacciones financieras

## Estructura de datos en Firestore

La aplicación utiliza la siguiente estructura en Firestore:

```
/usuarios/{userId}/
    /transacciones/{transactionId}/
        fecha: "YYYY-MM-DD"
        tipo: "ingreso" | "gasto" | "ahorro"
        categoria: "{categoryId}" | null
        monto: 0.00
        descripcion: "..."
        createdAt: timestamp
        updatedAt: timestamp

    /categorias/{categoryId}/
        nombre: "..."
        tipo: "ingreso" | "gasto" | "ahorro"
        color: "#XXXXXX"
        createdAt: timestamp
        updatedAt: timestamp

    /metas/{goalId}/
        nombre: "..."
        montoObjetivo: 0.00
        montoActual: 0.00
        fechaObjetivo: "YYYY-MM-DD" | null
        color: "#XXXXXX"
        createdAt: timestamp
        updatedAt: timestamp
```

Cada usuario tiene sus propias colecciones de transacciones, categorías y metas, lo que garantiza la privacidad y seguridad de los datos.

## Solución de problemas

Si encuentras problemas al configurar o usar Firebase, consulta el documento `SOLUCION_ERRORES_FIREBASE.md` para obtener ayuda.
