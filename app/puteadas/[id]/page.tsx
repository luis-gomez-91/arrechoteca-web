import PuteadaDetail from '@/components/features/PuteadaDetail';

type Props = { params: Promise<{ id: string }> };

export default async function PuteadaPage({ params }: Props) {
  const { id } = await params;
  const insultId = parseInt(id, 10);
  if (Number.isNaN(insultId)) {
    return (
      <div className="py-12 text-center text-destructive">
        ID no válido.
      </div>
    );
  }
  return <PuteadaDetail insultId={insultId} />;
}
