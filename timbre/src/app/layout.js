import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from 'next/font/google'
import SessionProvider from "../components/SessionProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Timbre",
  description: "Music matchmaking app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
