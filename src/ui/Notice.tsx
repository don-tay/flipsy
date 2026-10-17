import type { ReactNode } from 'react';

export function Notice({ title, children, actions }: { title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <main className="notice">
      <div className="dialog" role="alert">
        <h1>{title}</h1>
        {children && <p>{children}</p>}
        <div className="row">{actions}</div>
      </div>
    </main>
  );
}
