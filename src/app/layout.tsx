import { ReactNode } from 'react';
import './globals.css';
import LayoutContent from './LayoutContent';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
