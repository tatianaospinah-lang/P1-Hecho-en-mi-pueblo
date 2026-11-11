# P1 · Hecho en mi Pueblo

Sistema de servicio para **Hecho en mi Pueblo** (antojos colombianos y cafetería, Barcelona): menú por QR en cada mesa, pedidos a domicilio por WhatsApp, pantalla de cocina, caja con cierre del día y resumen en vivo.

**Demo (datos de ejemplo, no guarda nada):** <https://tatianaospinah-lang.github.io/P1-Hecho-en-mi-pueblo/>

## Para Ramon: subirlo al servidor

Todo lo que va al servidor está en la carpeta **[`web/`](web/)**. Las instrucciones paso a paso están en **[`web/LEEME.md`](web/LEEME.md)**.

En resumen:
1. Crear un proyecto en Firebase (Firestore + Authentication con correo y contraseña).
2. Pegar los datos del proyecto en `web/config.js`.
3. Publicar `web/firestore.rules` en Firestore → Reglas.
4. Dar de alta al equipo: un usuario en Authentication y su UID en la colección `staff`.
5. Subir el contenido de `web/` a cualquier hosting con HTTPS.
6. Entrar, y en **Ajustes** poner el link del dominio, las mesas, el WhatsApp y los datos de pago.

Para bajar solo esa carpeta: botón verde **Code → Download ZIP** y usar `web/`.

## Qué hace

| Sección | Para quién | Qué hace |
|---|---|---|
| Hoy | Encargado | Pedidos y ventas del día en vivo, horas pico, lo más vendido y el cierre de caja con arqueo |
| Salón | Camareros | Mapa de mesas por estado, avisos de platos listos y mesas que llaman, toma de pedidos |
| Domicilios | Equipo | Pedidos de WhatsApp (pegar el mensaje y se llena solo), pago por adelantado o al recibir, rutas por barrio con Google Maps y historial |
| Cocina | Cocina y barra | Comandas por estación con temporizador de colores, sonido y pantalla completa |
| Caja | Caja | Tique, propina opcional, dividir cuenta, efectivo, tarjeta, Bizum y transferencia, con cálculo de cambio |
| Menús | Clientes | Menú de mesa (`#mesa3`) y menú a domicilio (`#domicilio`) |
| Ajustes | Encargado | Menú, precios, agotados, QR, WhatsApp, pagos y dirección del local |

## Estructura del repositorio

```
web/                         ← lo que se sube al servidor (para Ramon)
  index.html                   la app
  demo.html                    la demo
  config.js                    datos de Firebase (único archivo a editar)
  hmp-host.js                  conexión con Firebase
  firestore.rules              reglas de seguridad
  LEEME.md                     instrucciones
docs/index.html              ← demo publicada en GitHub Pages
hecho-en-mi-pueblo.html      ← código fuente de la app
demo-data.js                 ← datos de ejemplo de la demo
web-src/                     ← fuentes de config, conexión, reglas y LEEME
build-demo.py, build-web.py  ← regeneran demo, web/ y docs/
```

## Hacer cambios

Se edita `hecho-en-mi-pueblo.html` (o `demo-data.js` y `web-src/`) y luego se regenera todo con:

```bash
python3 build-demo.py "https://tatianaospinah-lang.github.io/P1-Hecho-en-mi-pueblo/"
python3 build-web.py
```

Esto actualiza `web/`, `docs/` y el `.zip`. Después se suben los cambios a GitHub y la demo se actualiza sola en un par de minutos.
