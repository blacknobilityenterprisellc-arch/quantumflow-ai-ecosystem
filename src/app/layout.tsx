import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuantumFlow AI Ecosystem v15.4.0 - AETHERIUS-PRIME Enhanced',
  description: 'Premium Platinum Diamond Grade - Next.js 16.0.8 with Quantum Intelligence & AETHERIUS-ETERNAL Systems',
  keywords: ['quantum-ai', 'nextjs', 'typescript', 'enterprise', 'aetherius-prime', 'keystone-ecosystem'],
  authors: [{ name: 'Jocely P. Honore' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'QuantumFlow AI Ecosystem v15.4.0',
    description: 'Premium Platinum Diamond Grade Enterprise AI Platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="antialiased bg-slate-900 text-white min-h-screen">
        <div id="aetherius-prime-root" className="relative">
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // AETHERIUS-PRIME Quantum Coherence Initialization
              window.AETHERIUS_PRIME = {
                version: '15.4.0',
                mode: 'ACTIVE',
                quantumCoherence: 0.999,
                neuralSync: true,
                eternalMode: true
              };
              console.log('🧠 AETHERIUS-PRIME Systems Initialized - Quantum Coherence:', window.AETHERIUS_PRIME.quantumCoherence);
            `,
          }}
        />
      </body>
    </html>
  )
}