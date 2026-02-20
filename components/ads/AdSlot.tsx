'use client';

import React from 'react';

type AdSlotProps = {
  /** Identificador del espacio (ej: "banner-footer", "banner-home") */
  id: string;
  /** Estilo: "banner" (horizontal) o "rectangle" (cuadrado/lateral) */
  variant?: 'banner' | 'rectangle';
  /** Clase extra para el contenedor */
  className?: string;
  /** Contenido del anuncio: script, iframe o componente. Si no se pasa, se muestra placeholder. */
  children?: React.ReactNode;
};

export default function AdSlot({ id, variant = 'banner', className = '', children }: AdSlotProps) {
  const baseClass = 'flex items-center justify-center bg-muted/30 border border-dashed border-border rounded-lg text-muted-foreground text-sm';
  const variantClass = variant === 'banner' ? 'min-h-[90px] w-full' : 'min-h-[250px] w-full max-w-[300px]';

  return (
    <aside
      id={id}
      className={`${baseClass} ${variantClass} ${className}`}
      aria-label="Espacio publicitario"
    >
      {children ?? (
        <span className="px-4 text-center">
          Espacio publicitario · {id}
        </span>
      )}
    </aside>
  );
}
