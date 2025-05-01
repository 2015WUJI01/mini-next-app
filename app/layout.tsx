import "@/app/globals.css"

export const metadata = {
  title: '狼人杀发牌器',
  description: '狼人杀发牌器',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  )
}
