import Link from "next/link"
import { LogOut } from "lucide-react"
import { Footer } from "@/components/footer"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">F</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">File Uploader Pro</span>
                    </div>

                    <nav className="flex items-center gap-6">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/admin/login" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>

            <Footer />
        </div>
    )
}
