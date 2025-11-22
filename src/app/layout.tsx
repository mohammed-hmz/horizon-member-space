import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import ThemeProviderClient from '@/components/ThemeProviderClient';
import { AuthContextProvider } from '@/context/AuthContext';
const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className}`}>
        <AuthContextProvider>
          <ThemeProviderClient>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProviderClient>
        </AuthContextProvider>
      </body>
    </html>
  );
}
