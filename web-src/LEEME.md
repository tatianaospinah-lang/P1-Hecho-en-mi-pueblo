# Hecho en mi Pueblo · Sistema de servicio (web)

Hola Ramon. Esta carpeta es el sistema del café listo para subir a nuestro servidor. Es una web estática (HTML + JS, sin compilar nada). Usa **Firebase** (de Google) como base de datos en tiempo real y para el inicio de sesión del equipo. El plan gratuito (Spark) alcanza de sobra para el volumen del café.

## Qué hay en la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La aplicación completa (equipo + menús de clientes). |
| `demo.html` | Demo con datos de ejemplo en memoria. No usa base de datos y no guarda nada. |
| `config.js` | **Aquí van los datos del proyecto de Firebase** (único archivo que hay que editar). |
| `hmp-host.js` | Conecta la app con Firebase. No hace falta tocarlo. |
| `firestore.rules` | Reglas de seguridad de la base de datos. Hay que publicarlas en Firebase. |

## Pasos (unos 20 minutos)

### 1. Crear el proyecto en Firebase
1. Entra en <https://console.firebase.google.com> con la cuenta de Google del negocio y crea un proyecto (por ejemplo `hecho-en-mi-pueblo`). Analytics no hace falta.
2. **Firestore Database** → *Crear base de datos* → modo **producción** → ubicación `eur3 (europe-west)`.
3. **Authentication** → *Comenzar* → en *Método de acceso* activa **Correo electrónico/contraseña**.
4. **Configuración del proyecto** (⚙) → *General* → *Tus apps* → icono web `</>` → registra la app (sin Hosting) y copia el objeto `firebaseConfig`.

### 2. Configurar `config.js`
Pega `apiKey`, `authDomain`, `projectId` y `appId` en `config.js`. Estos valores no son secretos: la seguridad la ponen las reglas.

### 3. Publicar las reglas de seguridad
Firestore → pestaña **Reglas** → reemplaza todo por el contenido de `firestore.rules` → **Publicar**.

Qué hacen las reglas:
- Cualquiera puede leer el **menú** y la **configuración** (lo necesita la página de clientes).
- Solo el equipo lee y escribe pedidos, domicilios, cobros y cierres. Así nadie de afuera ve nombres, teléfonos ni direcciones de clientes.

### 4. Dar de alta al equipo
Por cada persona del equipo:
1. **Authentication** → *Usuarios* → *Agregar usuario* (correo + contraseña). Copia su **UID**.
2. **Firestore** → *Iniciar colección* `staff` (solo la primera vez) → documento con **ID = el UID** → un campo cualquiera, por ejemplo `nombre: "Laura"`.

Quien tenga usuario pero **no** esté en `staff` puede entrar, pero la app le avisa que no tiene permiso y no ve datos. Para quitar a alguien, borra su documento en `staff` (y si quieres, su usuario).

> Importante: aunque el registro por correo esté activado, la app no tiene botón de "crear cuenta". Y aunque alguien se creara una cuenta por su lado, sin documento en `staff` no ve nada.

### 5. Subir la web
Sube **todo el contenido** de la carpeta a cualquier hosting estático con **HTTPS** (nuestro servidor, Netlify, Vercel, Firebase Hosting, cPanel…). No necesita PHP, Node ni base de datos propia.

Ejemplo con Nginx:
```nginx
server {
  server_name pedidos.hechoenmipueblo.es;
  root /var/www/hecho-en-mi-pueblo;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
}
```
Las secciones se navegan con `#` (`/#domicilios`, `/#mesa3`), así que no hacen falta reglas de rutas especiales.

### 6. Primer arranque
1. Abre `https://TU-DOMINIO/` e inicia sesión con un usuario del equipo.
2. **Ajustes → Local y domicilios**:
   - **Link de esta página:** `https://TU-DOMINIO/` (con esto se generan los QR y los mensajes de WhatsApp).
   - Número de mesas, WhatsApp de pedidos, valor del envío, dirección del local, Bizum, IBAN y link de pago (opcionales).
3. **Ajustes → Menú:** precios y disponibilidad. Los platos base vienen en el código (`BASE_MENU` dentro de `index.html`). Lo que se cambie desde Ajustes se guarda en Firestore y tiene prioridad.
4. **Ajustes → Códigos QR → Descargar hoja** para imprimir los QR de las mesas y el de domicilios.

## Links útiles una vez publicado

| Link | Quién lo usa |
|---|---|
| `https://TU-DOMINIO/` | El equipo (pide inicio de sesión) |
| `https://TU-DOMINIO/#domicilio` | Clientes: pedir a domicilio (va en el mensaje de bienvenida de WhatsApp Business y en la bio de Instagram) |
| `https://TU-DOMINIO/#mesa3` | Cliente sentado en la mesa 3 (lo abre el QR) |
| `https://TU-DOMINIO/demo.html` | Demo para enseñar el sistema |

## Cómo funciona para los clientes
Los clientes **no inician sesión**. En la web pública solo leen el menú:
- **A domicilio:** arman el pedido y lo envían por **WhatsApp** con un mensaje ordenado y un código. El equipo lo pega en *Domicilios → Leer mensaje* y queda registrado.
- **En la mesa:** arman el pedido y la app genera un **código** que el camarero escribe en *Salón*.

## Estructura de datos (Firestore)
`orders` (comandas por estación), `deliveries` (domicilios con historial `log`), `payments` (cobros), `calls` (llamadas de mesa), `closings` (cierres diarios, ID `AAAA-MM-DD`), `menu` (cambios al menú), `config/main` (ajustes), `staff` (equipo autorizado).

Las consultas usan índices simples (Firestore los crea solos). Si en la consola del navegador aparece un aviso de índice, el mismo mensaje trae el enlace para crearlo con un clic.

## Copias de seguridad
Firestore → *Importar/Exportar*, o el comando `gcloud firestore export`. Recomendado una vez por semana.

## Problemas frecuentes
- **"Falta configurar la conexión (config.js)":** `config.js` todavía tiene `PEGAR_AQUI`.
- **"Tu usuario no está dado de alta":** falta el documento en `staff` con el UID correcto.
- **Pantalla en blanco:** abre la consola del navegador (F12). Si dice `firebase is not defined`, el servidor está bloqueando `www.gstatic.com` (revisa la Content-Security-Policy).
- **Copiar no funciona:** la web debe servirse por **HTTPS**.
