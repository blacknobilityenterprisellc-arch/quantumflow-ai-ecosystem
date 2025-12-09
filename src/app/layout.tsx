import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QuantumFlow AI Ecosystem v15.3.0',
  description: 'Premium Platinum Diamond Grade - Next.js 16.0.8 with Quantum Intelligence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}