import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full rounded-lg border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Error de autenticación</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Hubo un problema al iniciar sesión. Intenta de nuevo.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
