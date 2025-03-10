import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import favicon from "../../public/logo.svg";

const poppins = Poppins({weight: "400", subsets: ["latin"]});

export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
          <link rel="shortcut icon" href={favicon} />
      </head>
      <AuthProvider>
        <body className={poppins.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}