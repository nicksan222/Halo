import type React from 'react';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[100svh] grid place-items-center p-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
