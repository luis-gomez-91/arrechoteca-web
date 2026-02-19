import Words from '@/components/ui/Words'

export default function Page() {
  return (
    <div className="w-full">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary mb-1">Diccionario</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Jerga Guayaca
        </h1>
        <p className="text-muted-foreground mt-2">
          Palabras y expresiones de la costa. Busca o explora por orden.
        </p>
      </header>
      <Words />
    </div>
  )
}
