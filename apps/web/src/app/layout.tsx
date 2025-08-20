import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@acme/ui/styles';
import { Toaster } from '@acme/ui/components/sonner';
import { HtmlLang } from '@/components/layout/html-lang';
import { Providers } from '@/providers';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Halo Todos',
  description: 'Simple todos app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} antialiased min-h-screen bg-background`}>
        <Providers>
          <HtmlLang />
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
