import './globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rewards App',
  description: 'Earn points and get rewards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={manrope.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}