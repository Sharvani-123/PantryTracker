// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '../components/Footer'; // Adjust the path as needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pantry Tracker',
  description: 'Track your pantry items effortlessly and stay organized!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ position: 'relative', minHeight: '100vh', margin: 0 }}>
        <main style={{ paddingBottom: '35px' }}>{children}</main> {/* Add padding to ensure content does not overlap with footer */}
        <Footer />
      </body>
    </html>
  );
}
