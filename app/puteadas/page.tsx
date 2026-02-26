import PuteadasList from '@/components/features/PuteadasList';

export default function PuteadasPage() {
  return (
    <div className="w-full">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary mb-1">Diccionario</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Puteadas
        </h1>
        <p className="text-muted-foreground mt-2">
          El diccionario de las puteadas guayacas. Significados y ejemplos de uso.
        </p>
      </header>
      <PuteadasList />
    </div>
  );
}
