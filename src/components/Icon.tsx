import type { SVGProps } from 'react';

// References a <symbol> from the sprite in index.html
export function Icon({ id, ...props }: { id: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" {...props}>
      <use href={`#${id}`} />
    </svg>
  );
}
