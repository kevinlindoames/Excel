# Solución de Errores Comunes en Firebase

Este documento proporciona soluciones detalladas para los errores más comunes encontrados al trabajar con Firebase en la aplicación de Control Financiero.

## Errores de Autenticación

### Error: "Firebase: Error (auth/invalid-email)"

**Causa:** El formato del correo electrónico ingresado no es válido.

**Solución:**

- Verifica que el correo electrónico tenga el formato correcto (ejemplo@dominio.com)
- Asegúrate de que no haya espacios antes o después del correo electrónico
- Revisa que no contenga caracteres especiales no permitidos

### Error: "Firebase: Error (auth/email-already-in-use)"

**Causa:** El correo electrónico ya está registrado en Firebase.

**Solución:**

- Utiliza otro correo electrónico para el registro
- Si es tu correo, intenta usar la opción "¿Olvidaste tu contraseña?"
- Si estás intentando iniciar sesión, usa el botón de inicio de sesión en lugar del de registro

### Error: "Firebase: Error (auth/wrong-password)"

**Causa:** La contraseña ingresada es incorrecta.

**Solución:**

- Verifica que la contraseña sea correcta (respetando mayúsculas y minúsculas)
- Usa la opción "¿Olvidaste tu contraseña?" para restablecer tu contraseña
- Asegúrate de que el bloqueo de mayúsculas no esté activado

### Error: "Firebase: Error (auth/user-not-found)"

**Causa:** No existe un usuario registrado con ese correo electrónico.

**Solución:**

- Verifica que el correo electrónico esté correctamente escrito
- Regístrate primero si aún no tienes una cuenta
- Comprueba si usaste otro correo electrónico o método de autenticación

### Error: "Firebase: Error (auth/popup-closed-by-user)"

**Causa:** El usuario cerró la ventana emergente de autenticación antes de completar el proceso.

**Solución:**

- Intenta iniciar sesión nuevamente y mantén la ventana abierta hasta que se complete el proceso
- Verifica que no tengas bloqueadores de ventanas emergentes activos
- Prueba con otro navegador si el problema persiste

## Errores de Firestore

### Error: "FirebaseError: Missing or insufficient permissions"

**Causa:** El usuario no tiene permisos para acceder a los datos solicitados.

**Solución:**

1. Verifica que el usuario esté correctamente autenticado
2. Revisa las reglas de seguridad de Firestore en la consola de Firebase
3. Asegúrate de que estás intentando acceder a los datos de tu propio usuario
4. Comprueba la estructura de las rutas, debe ser: `/usuarios/{tuUserId}/colección/documento`

### Error: "FirebaseError: Document does not exist"

**Causa:** Estás intentando acceder a un documento que no existe en Firestore.

**Solución:**

1. Verifica que el ID del documento sea correcto
2. Comprueba si el documento fue eliminado
3. Asegúrate de estar en la ruta correcta
4. Usa condiciones para verificar la existencia del documento antes de acceder a él:

```javascript
const docRef = firebase.firestore().doc(ruta);
const doc = await docRef.get();
if (doc.exists) {
  // Usar los datos
} else {
  // Manejar el caso cuando el documento no existe
}
```

### Error: "FirebaseError: Invalid document reference"

**Causa:** La referencia al documento tiene un formato incorrecto.

**Solución:**

1. Asegúrate de que la ruta del documento sea válida (debe tener un número par de segmentos)
2. Verifica que no estés pasando `null` o `undefined` como ID de documento
3. Comprueba que estás usando correctamente los métodos `collection()` y `doc()`

### Error: "FirebaseError: Failed to get document because the client is offline"

**Causa:** No hay conexión a internet y los datos solicitados no están en la caché local.

**Solución:**

1. Verifica tu conexión a internet
2. Configura la persistencia de datos offline:

```javascript
firebase
  .firestore()
  .enablePersistence()
  .then(() => {
    // La persistencia está habilitada
  })
  .catch((err) => {
    console.error("Error al habilitar persistencia:", err);
  });
```

3. Maneja el estado de conexión en tu aplicación:

```javascript
firebase
  .firestore()
  .enableNetwork()
  .then(() => {
    console.log("Red habilitada");
  });

firebase
  .firestore()
  .disableNetwork()
  .then(() => {
    console.log("Red deshabilitada");
  });
```

## Errores de Inicialización de Firebase

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Causa:** No se ha inicializado correctamente la aplicación de Firebase.

**Solución:**

1. Asegúrate de que el script de Firebase se carga correctamente
2. Verifica que la inicialización se realiza antes de usar cualquier servicio:

```javascript
// Verificar si Firebase ya está inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
```

3. Comprueba que la configuración de Firebase es correcta

### Error: "Firebase: Firebase App named '[DEFAULT]' already exists"

**Causa:** Estás intentando inicializar Firebase más de una vez.

**Solución:**

1. Usa la verificación de inicialización mencionada arriba
2. Asegúrate de que no estás importando múltiples veces los scripts de Firebase
3. Organiza mejor tu código para evitar inicializaciones duplicadas

### Error: "TypeError: Cannot read property 'X' of undefined"

**Causa:** Estás intentando acceder a una propiedad de un objeto Firebase que no está inicializado o definido.

**Solución:**

1. Asegúrate de que Firebase está completamente inicializado antes de usarlo
2. Usa comprobaciones de existencia antes de acceder a propiedades:

```javascript
if (firebase && firebase.auth) {
  // Usar firebase.auth()
}
```

3. Implementa manejo de errores apropiado:

```javascript
try {
  const user = firebase.auth().currentUser;
  if (user) {
    // Usar user
  }
} catch (error) {
  console.error("Error al acceder al usuario:", error);
}
```

## Errores de Implementación

### Error: "SyntaxError: Unexpected token in JSON at position X"

**Causa:** Estás intentando analizar un JSON inválido.

**Solución:**

1. Verifica el formato de los datos que estás intentando guardar en Firestore
2. Asegúrate de no estar incluyendo funciones o tipos de datos no serializables
3. Usa JSON.stringify con reemplazadores para manejar tipos complejos:

```javascript
const datos = {
  fecha: new Date(), // Esto no se puede serializar directamente
  referencia: docRef, // Esto tampoco
};

// Convertir a formato adecuado
const datosSerializables = {
  fecha: datos.fecha.toISOString(),
  referencia: datos.referencia.path,
};

// Ahora puedes guardar datosSerializables en Firestore
```

### Error: "This transaction has already completed"

**Causa:** Estás intentando modificar una transacción que ya ha finalizado.

**Solución:**

1. Asegúrate de realizar todas las operaciones dentro del callback de la transacción
2. No uses promesas asíncronas (await) dentro de una transacción
3. Estructura correctamente las transacciones:

```javascript
const transactionResult = await firebase
  .firestore()
  .runTransaction(async (transaction) => {
    // Leer documentos
    const docRef = firebase.firestore().doc("ruta/al/documento");
    const docSnapshot = await transaction.get(docRef);

    // Modificar datos basados en la lectura
    const nuevosDatos = {
      /* ... */
    };

    // Escribir cambios (dentro de la transacción)
    transaction.update(docRef, nuevosDatos);

    // Retornar el resultado
    return { success: true };
  });
```

## Problemas de Rendimiento

### Problema: "Consultas lentas en Firestore"

**Causa:** Consultas ineficientes o falta de índices.

**Solución:**

1. Crea índices para tus consultas compuestas:
   - Firebase te notificará cuando necesites un índice
   - Haz clic en el enlace proporcionado o crea el índice manualmente en la consola
2. Limita el número de documentos recuperados:
   ```javascript
   query = query.limit(20);
   ```
3. Usa consultas paginadas para conjuntos de datos grandes:

   ```javascript
   // Primera consulta
   let primerConsulta = await query.limit(25).get();

   // Consultas posteriores
   let ultimo = primerConsulta.docs[primerConsulta.docs.length - 1];
   let siguienteConsulta = await query.startAfter(ultimo).limit(25).get();
   ```

4. Recupera solo los campos que necesitas:
   ```javascript
   // En lugar de recuperar documentos completos
   const docRef = firebase.firestore().doc("ruta/documento");
   docRef.select("campo1", "campo2").get().then(/* ... */);
   ```

### Problema: "La aplicación se vuelve lenta con el tiempo"

**Causa:** Escuchas (listeners) no desvinculadas o acumulación de datos en memoria.

**Solución:**

1. Desvincular las escuchas cuando ya no se necesiten:

   ```javascript
   const unsubscribe = docRef.onSnapshot(/* ... */);

   // Cuando ya no necesites la escucha
   unsubscribe();
   ```

2. Limpia los listeners al desmontar componentes o cambiar de página:
   ```javascript
   // Al salir de una página o componente
   listeners.forEach((unsubscribe) => unsubscribe());
   listeners = [];
   ```
3. Evita crear nuevas escuchas para los mismos datos

## Problemas con Reglas de Seguridad

### Problema: "Las reglas de seguridad rechazan la operación"

**Causa:** Las reglas de seguridad están bloqueando la operación solicitada.

**Solución:**

1. Revisa las reglas de seguridad en la consola de Firebase
2. Asegúrate de que el usuario está autenticado para operaciones que requieren autenticación
3. Verifica que el usuario tenga acceso a los documentos específicos:
   ```
   // Ejemplo de regla que permite acceso a documentos propios
   match /usuarios/{userId} {
     allow read, write: if request.auth != null && request.auth.uid == userId;
   }
   ```
4. Para desarrollo, puedes temporalmente relajar las reglas (¡NO en producción!):
   ```
   // SOLO PARA DESARROLLO
   match /{document=**} {
     allow read, write: if true;
   }
   ```
5. Prueba tus reglas en el simulador de reglas de seguridad en la consola de Firebase

## Soporte Adicional

Si continúas experimentando problemas con Firebase:

1. Consulta la [documentación oficial de Firebase](https://firebase.google.com/docs)
2. Visita [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase) para preguntas específicas
3. Explora el [repositorio de ejemplos de Firebase](https://github.com/firebase/quickstart-js)
4. Únete a la [comunidad de Firebase en Google Groups](https://groups.google.com/g/firebase-talk)
