# La Caleta del Verbo

Diccionario web de la jerga guayaca ecuatoriana. Descubre palabras, insultos y expresiones típicas de Guayaquil.

## Stack

- **Next.js 15** (App Router) con Turbopack
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** (componentes: Alert, AlertDialog, Button, Dialog, Sonner, etc.)
- **Supabase** (autenticación)
- **React Hook Form + Zod** (formularios y validación)

## Requisitos

- Node.js 18+
- npm, yarn, pnpm o bun

## Instalación

```bash
git clone <url-del-repo>
cd arrechoteca-web
npm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz con:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL base del backend (API de palabras/puteadas) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública) de Supabase |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Emails separados por coma para acceso admin |

Puedes usar `.env.example` como plantilla (sin valores sensibles).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Ejecuta ESLint |

## Estructura del proyecto

```
app/                 # App Router (páginas y layouts)
  page.tsx            # Inicio
  palabras/           # Jerga guayaca
  puteadas/            # Puteadas
  guayaco/             # Guayaco que se respeta
  auth/                # Login, registro, error
  admin/               # Panel admin (palabras)
components/           # Componentes React
  navigation/          # Nav, Footer
  ui/                  # shadcn (alert, button, dialog, sonner…)
  features/            # Lógica de negocio (InsultsAdmin, etc.)
contexts/              # AuthContext (Supabase)
lib/                   # Utilidades y fetchers
```

## Licencia

Proyecto privado.
