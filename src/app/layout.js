import { Inter, Poppins } from 'next/font/google'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './globals.css'
import Navbar from './components/Navbar'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTopButton from './components/ScrollToTopButton'

// Google Fonts configuration
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap', // Better performance
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap', // Better performance
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} data-scroll-behavior="smooth">
      <head>
        {/* Optional: Add meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="OnlineTaxi - Your reliable ride booking platform" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Navbar />
        <main>{children}</main>
        <WhatsAppButton />
        <ScrollToTopButton />
      </body>
    </html>
  )
}
