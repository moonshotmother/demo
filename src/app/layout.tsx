import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: "Commercial Potential Explorer",
  description: "Research viability explorer"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">
        {children}
      </body>
    </html>
  );
}
