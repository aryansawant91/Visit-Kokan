import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'Visit Kokan — Discover the Konkan Coast',
    template: '%s | Visit Kokan',
  },
  description:
    'Explore the pristine beaches, lush forests, and rich culture of the Konkan coast. Book treks, homestays, and local experiences.',
  keywords: ['Kokan', 'Konkan', 'Maharashtra tourism', 'Konkan travel', 'beaches', 'treks'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://visitkokan.in',
    siteName: 'Visit Kokan',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}