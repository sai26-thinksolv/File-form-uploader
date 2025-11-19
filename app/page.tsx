"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, UploadCloud, Shield, Zap, Globe } from "lucide-react"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()

  const handleCreateClick = () => {
    // Mock auth check - in real app, check token/session
    const isAuthenticated = false // Set to true to test redirection

    if (isAuthenticated) {
      router.push("/admin/dashboard")
    } else {
      router.push("/admin/login")
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <UploadCloud className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">File Uploader Pro</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <span className="cursor-default hover:text-indigo-600 transition-colors">Product</span>
          <span className="cursor-default hover:text-indigo-600 transition-colors">Security</span>
          <span className="cursor-default hover:text-indigo-600 transition-colors">Enterprise</span>
          <span className="cursor-default hover:text-indigo-600 transition-colors">Pricing</span>
        </div>

        <div>
          <Link href="/admin/login">
            <Button variant="ghost" className="font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 mr-2">
              Log in
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 rounded-full shadow-md transition-all hover:shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-24 max-w-5xl mx-auto w-full text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          New: Google Drive Integration
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          File collection, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            reimagined.
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          The secure, professional way to receive files from anyone.
          No account required for your clients. Direct to your storage.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Button
            size="lg"
            onClick={handleCreateClick}
            className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Create Your Upload Page
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all">
            View Demo
          </Button>
        </div>

        {/* Feature Grid / Mock UI */}
        <div className="grid md:grid-cols-3 gap-8 w-full text-left">
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-500">Drag, drop, done. We handle large files with ease so you don't have to.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Bank-Grade Security</h3>
            <p className="text-gray-500">Password protection and encryption ensure your data stays private.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Global Access</h3>
            <p className="text-gray-500">Share your link with anyone, anywhere. No login barriers for uploaders.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
