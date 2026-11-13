/* Small inline SVG icons shared across the site. */

export const SearchIcon = ({ size = 16, width = 1.8 }: { size?: number; width?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const GridIcon = ({ size = 15, rx = 1.5, inset = 4 }: { size?: number; rx?: number; inset?: number }) => {
  const far = 24 - inset - 6;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x={inset} y={inset} width="6" height="6" rx={rx} />
      <rect x={far} y={inset} width="6" height="6" rx={rx} />
      <rect x={inset} y={far} width="6" height="6" rx={rx} />
      <rect x={far} y={far} width="6" height="6" rx={rx} />
    </svg>
  );
};

export const Chevron = ({ dir }: { dir: -1 | 1 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d={dir < 0 ? 'M14 5l-7 7 7 7' : 'M10 5l7 7-7 7'} />
  </svg>
);
