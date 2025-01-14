import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { MainNav } from '../components/navigation/MainNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyLook by MakeupHub',
  description: 'Discover and learn from the best makeup artists and looks',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MainNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
