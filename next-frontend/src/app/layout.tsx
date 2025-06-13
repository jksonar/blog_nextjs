import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blog Site',
  description: 'A blog site built with Next.js and Django',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-gray-800">Blog Site</a>
              <div className="space-x-4">
                <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                <a href="/blog" className="text-gray-600 hover:text-gray-900">Blog</a>
              </div>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">Blog Site</h3>
                <p className="text-gray-400">A blog site built with Next.js and Django</p>
              </div>
              <div>
                <p className="text-gray-400">&copy; {new Date().getFullYear()} Blog Site. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
