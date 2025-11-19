export function Footer() {
    return (
        <footer className="border-t bg-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="text-sm text-gray-600">© 2024 File Uploader Pro</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
