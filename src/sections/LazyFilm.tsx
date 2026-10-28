import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const Film = lazy(() => import('./Film').then(m => ({ default: m.Film })));

// Remotion is the heaviest dependency, so it only loads once the film is about a screen away
export function LazyFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) setNear(true);
    }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const placeholder = <div className="film-frame film-skeleton" aria-label="Loading the product film" />;
  return (
    <div ref={ref}>
      {near ? <Suspense fallback={placeholder}><Film /></Suspense> : placeholder}
    </div>
  );
}
