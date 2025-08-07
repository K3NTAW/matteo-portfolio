import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Matteo Portfolio',
  description: 'Admin dashboard for managing portfolio content',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
} 