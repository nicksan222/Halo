import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@acme/ui/styles';
import { useLocale } from '@acme/localization/next-server';
import { Toaster } from '@acme/ui/components/sonner';
import { cookies, headers } from 'next/headers';
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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookiesList = await cookies();
  const { locale } = useLocale(
    {
      headers: headersList,
      cookies: {
        get: (name) => cookiesList.get(name)?.value,
        set: (name, value) => cookiesList.set(name, value)
      }
    },
    { cookieName: 'locale', defaultLocale: 'en' }
  );
  return (
    <html lang={locale} suppressHydrationWarning suppressContentEditableWarning>
      <body className={`${fontSans.variable} antialiased min-h-screen bg-background`}>
        <Providers initialLocale={locale}>
          <HtmlLang />
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
