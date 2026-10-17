import { createElement } from 'react';
import type { IconData } from '../themes/types';

export function ItemIcon({ icon, stroke }: { icon: IconData; stroke: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      {icon.map(([tag, { key: _key, ...attrs }], i) => createElement(tag, { ...attrs, key: i, strokeWidth: stroke }))}
    </svg>
  );
}
