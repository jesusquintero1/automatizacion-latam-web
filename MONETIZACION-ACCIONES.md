# Acciones del owner — Sprint de monetización (2026-07-17)

Estas son las tareas que **solo tú puedes hacer** (crear cuentas/credenciales,
publicar en tu nombre). El resto ya quedó en código. Ordenadas por impacto.

Diagnóstico de fondo: el cuello de botella no es la aprobación de AdSense, es el
**tráfico** (automatizacionslatam.com tiene ~9 clics/3 meses). Por eso el plan
prioriza medición real + contenido rankeable, y trata la aprobación como un
empujón no destructivo. No borres/re-añadas el sitio en AdSense: perderías 8
semanas de cola para arreglar algo que probablemente no es el problema.

---

## 1. Service account de Google → saca al "cerebro" del modo degradado (ALTO IMPACTO)

Hoy `daily-plan.json` dice `fuente_datos: "degradado"`: el orquestador prioriza a
ciegas. Con esto pasa a `"google"` y prioriza por tráfico real. El código ya está
listo (`scripts/analytics.py`); solo faltan credenciales. ~10 minutos:

1. **Google Cloud Console** (https://console.cloud.google.com) → crea un proyecto
   (o usa uno existente) → **APIs y servicios → Biblioteca** → habilita:
   - *Google Search Console API*
   - *Google Analytics Data API*
2. **APIs y servicios → Credenciales → Crear credenciales → Cuenta de servicio**.
   Ponle un nombre (ej. `cerebro-analytics`). Al crearla, entra a la cuenta →
   pestaña **Claves → Agregar clave → Crear clave nueva → JSON**. Se descarga un
   archivo `.json`. **Copia el email** de la service account (algo como
   `cerebro-analytics@tu-proyecto.iam.gserviceaccount.com`).
3. **Search Console** (https://search.google.com/search-console) → propiedad
   `automatizacionslatam.com` → **Configuración → Usuarios y permisos → Agregar
   usuario** → pega el email de la service account, permiso **Restringido** (lectura).
4. **Google Analytics 4** → Administrar → **Acceso a la propiedad** → agrega ese
   email como **Lector**. En **Administrar → Configuración de la propiedad** copia
   el **ID de la propiedad** (número, ej. `123456789` — NO el `G-XXXXXXXX`).
5. **GitHub** → repo `automatizacion-latam-web` → **Settings → Secrets and
   variables → Actions → New repository secret**, crea dos:
   - `GOOGLE_SERVICE_ACCOUNT_JSON` → pega **todo** el contenido del archivo `.json`.
   - `GA4_PROPERTY_ID` → el número del paso 4.

> Nota técnica ya resuelta en código: la propiedad de Search Console es de tipo
> **dominio**, así que los workflows usan `GSC_SITE_URL: sc-domain:automatizacionslatam.com`
> (formato correcto para propiedades de dominio; la URL `https://…` habría fallado).

**Cómo saber que funcionó:** en la próxima corrida del workflow "Cerebro" (cada
hora) o disparándolo a mano, la rama `flota-estado` mostrará
`analytics-report.json` con `fuente_datos: "google"` y el dashboard dejará de
decir "modo degradado".

---

## 2. Empujar la revisión de AdSense SIN romper nada (post en el foro oficial)

La revisión de `automatizacionslatam.com` lleva 8+ semanas en "Preparando" (lo
normal son 2-4). En vez del riesgoso borrar+re-añadir, publica esto en el
**AdSense Help Community** (https://support.google.com/adsense/community):

> **Asunto:** Site stuck in "Getting ready" for 8+ weeks — request for review status
>
> My site **automatizacionslatam.com** has been in "Getting ready / Preparando"
> since **May 20, 2026** with no change. The site is verified, `ads.txt` shows
> "Authorized", it has original Spanish-language content about industrial
> automation (~370 articles), an About page, privacy policy, contact page and a
> clear editorial byline. There are no policy violations in the Policy Center.
> Could a specialist confirm what is pending or escalate the review? Thank you.

Publícalo desde tu cuenta (yo no puedo postear por ti). Si en 1-2 semanas no se
mueve, reevaluamos el borrar+re-añadir como último recurso.

**PulsoSano:** NO re-solicites revisión todavía. El playbook `RESCATE-CALIDAD.md`
advierte que un 2º rechazo endurece la siguiente. Esperar a ~2026-08-01 con la
calidad ya subida (esta sesión expandí 4 artículos ganadores y reenvié el sitemap).

---

## 3. Registrarte en Amazon Associates (stream de ingresos paralelo)

La infraestructura ya está construida (catálogo por categoría + módulos que se
insertan solos en los artículos, ocultos hasta tener tag real y ASINs). Para
activarla:

1. Regístrate en https://afiliados.amazon.com (US es lo más rápido; el catálogo
   global envía a LatAm). Obtendrás un **tag** tipo `tusitio-20`.
2. Pásame el tag → yo añado el secret/variable `PUBLIC_AMAZON_TAG_US` y relleno
   los ASINs reales en `src/data/amazon-productos.ts`. Los módulos se encienden
   solos, con su disclosure FTC ya incluida.

> Requisito de Amazon: necesitas ~3 ventas cualificadas en 180 días para
> mantener la cuenta, así que conviene activarlo cuando ya haya algo de tráfico.

---

## 4. (Opcional, para más adelante) Montar GA4 — cuando haya tráfico

**Estado:** decidido posponer. El sitio no tiene GA4 (no hay gtag en el HTML ni
propiedad). Con ~9 clics/3 meses, GA4 mediría comportamiento on-site ≈ 0, así que hoy
no aporta señal accionable. **Search Console ya está activo y cubre lo que el cerebro
necesita** para decidir contenido. Retomar cuando el tráfico crezca (o cuando AdSense
apruebe y quieras ingreso por categoría). Pasos, ya mapeados:

1. Analytics → Administrar → **+ Crear → Propiedad**: nombre "AutomatizacionLatAm",
   zona horaria Colombia (GMT-5), moneda USD.
2. Crear un **flujo de datos web** para `https://automatizacionslatam.com` → copiar el
   **Measurement ID** (`G-XXXXXXXX`).
3. Añadir el secret/variable `PUBLIC_AMAZON_...` no — aquí `PUBLIC_GA_ID=G-XXXXXXXX` en
   GitHub (el sitio ya tiene el gtag condicionado a esa var en `Base.astro`); se activa
   en el próximo deploy.
4. En la nueva propiedad → **Acceso a la gestión de la propiedad** → agregar
   `cerebro-analytics@cerebro-analytics-502723.iam.gserviceaccount.com` como **Lector**.
5. Copiar el **ID de propiedad numérico** → secret `GA4_PROPERTY_ID` en GitHub. A partir
   de ahí `analytics.py` también leerá sesiones por categoría.

## Qué NO hacer (y por qué)
- **No** borrar+re-añadir el sitio en AdSense (destruye la cola; el problema real
  es tráfico, no la revisión).
- **No** re-solicitar la revisión de PulsoSano aún (riesgo de 2º rechazo).
- **No** publicar más noticias por volumen: Google ya está frenando ambos sitios;
  volumen ≠ ranking. La palanca es contenido evergreen rankeable + autoridad.
