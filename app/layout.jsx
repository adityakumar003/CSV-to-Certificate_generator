import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  title: 'Awaara Certificate Generator',
  description: 'Generate beautiful participation certificates for Awaara Run Club events. Upload CSV, customize, and download certificates as PNG or ZIP.',
  keywords: 'certificate generator, running club, participation certificate, Awaara Run Club',
  openGraph: {
    title: 'Awaara Certificate Generator',
    description: 'Generate beautiful participation certificates for running events',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`${montserrat.className} bg-gray-950 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
