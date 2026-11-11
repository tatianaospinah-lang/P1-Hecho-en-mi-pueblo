/* Conecta la app con Firebase (base de datos en tiempo real + inicio de sesión del equipo). */
(function () {
  var c = window.HMP_CONFIG && window.HMP_CONFIG.firebase;
  if (!c || !c.apiKey || /PEGAR/.test(c.apiKey) || !window.firebase) {
    window.__HMP_HOST_ERROR = "config";
    console.warn("Hecho en mi Pueblo: falta configurar config.js; solo funcionan los menús de clientes.");
    return;
  }
  firebase.initializeApp(c);
  var db = firebase.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  var auth = firebase.auth();
  window.__HMP_HOST = {
    db: db,
    onUser: function (cb) { return auth.onAuthStateChanged(cb); },
    signIn: function (email, pass) { return auth.signInWithEmailAndPassword(email, pass); },
    signOut: function () { return auth.signOut(); }
  };
})();
