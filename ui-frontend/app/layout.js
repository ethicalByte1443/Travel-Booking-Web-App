import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Travel Booking Web App',
  description: 'A polished travel booking frontend with light and dark mode.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="app-shell">
            <Navbar />
            <main className="page-shell">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
