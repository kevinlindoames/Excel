// Configuración de Firebase para Control Financiero

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQZNGNn9-Jpy_W-6tEGCio0GKj2EUwQkA",
  authDomain: "controlfinanciero-firebase.firebaseapp.com",
  projectId: "controlfinanciero-firebase",
  storageBucket: "controlfinanciero-firebase.appspot.com",
  messagingSenderId: "825107142810",
  appId: "1:825107142810:web:2bd3f0c35d5ff28a6a1e75",
  measurementId: "G-W2EMMYXS9E",
};

// Inicialización de Firebase
let firebaseInitialized = false;
let firestoreDB = null;
let firebaseAuth = null;

// Inicializar Firebase
function initFirebase() {
  if (firebaseInitialized) {
    console.log("Firebase ya está inicializado");
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      console.log("📡 Inicializando Firebase...");

      // Inicializar la app de Firebase
      firebase.initializeApp(firebaseConfig);

      // Obtener instancias de Firestore y Auth
      firestoreDB = firebase.firestore();
      firebaseAuth = firebase.auth();

      // Configurar persistencia para funcionamiento offline
      firestoreDB
        .enablePersistence({ synchronizeTabs: true })
        .then(() => {
          console.log("✅ Persistencia de Firestore habilitada");
        })
        .catch((err) => {
          if (err.code === "failed-precondition") {
            console.warn(
              "⚠️ La persistencia no pudo habilitarse porque hay múltiples pestañas abiertas"
            );
          } else if (err.code === "unimplemented") {
            console.warn(
              "⚠️ El navegador actual no soporta las características de persistencia"
            );
          }
        });

      firebaseInitialized = true;
      console.log("✅ Firebase inicializado correctamente");

      // Configurar eventos de autenticación
      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          console.log("👤 Usuario autenticado:", user.email);
          // Notificar a la aplicación
          document.dispatchEvent(
            new CustomEvent("firebase-auth-change", {
              detail: {
                isSignedIn: true,
                user: {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                },
              },
            })
          );
        } else {
          console.log("👤 Usuario no autenticado");
          // Notificar a la aplicación
          document.dispatchEvent(
            new CustomEvent("firebase-auth-change", {
              detail: {
                isSignedIn: false,
                user: null,
              },
            })
          );
        }
      });

      // Notificar que Firebase está listo
      document.dispatchEvent(new CustomEvent("firebase-ready"));

      resolve();
    } catch (error) {
      console.error("❌ Error al inicializar Firebase:", error);
      reject(error);
    }
  });
}

// Exportar las instancias y funciones
window.FIREBASE = {
  init: initFirebase,
  getFirestore: () => firestoreDB,
  getAuth: () => firebaseAuth,
  isInitialized: () => firebaseInitialized,
};
