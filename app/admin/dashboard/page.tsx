"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, MoreVertical } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Forms</h2>
                    <p className="text-muted-foreground">Manage your file upload forms.</p>
                </div>
                <Link href="/admin/editor?id=new&tab=configuration">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Form
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {/* Default Form Card - Vertical Layout */}
                <Card className="hover:shadow-md transition-shadow">
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-900">General Upload Form</h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Created on Nov 19, 2025 • 0 Submissions</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/admin/uploads">
                                <Button variant="outline" size="sm">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Uploads
                                </Button>
                            </Link>
                            <Link href="/admin/editor?tab=configuration">
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Delete
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
