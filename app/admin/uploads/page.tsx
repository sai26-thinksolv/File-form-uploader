"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Search, Filter, MoreHorizontal, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function UploadsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Uploads</h2>
                        <p className="text-muted-foreground">Manage files uploaded to your forms.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search files..." className="pl-9" />
                        </div>
                        <div className="w-full md:w-[200px]">
                            <select defaultValue="all" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="all">All Forms</option>
                                <option value="general">General Upload Form</option>
                            </select>
                        </div>
                        <div className="w-full md:w-[150px]">
                            <select defaultValue="all" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Uploads List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">File Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Uploader</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Size</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-indigo-600" />
                                                project-proposal.pdf
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium">John Doe</span>
                                                <span className="text-xs text-muted-foreground">john@example.com</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">2.4 MB</td>
                                        <td className="p-4 align-middle">Nov 19, 2025</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-indigo-600" />
                                                design-mockups.zip
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium">Jane Smith</span>
                                                <span className="text-xs text-muted-foreground">jane@example.com</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">15.8 MB</td>
                                        <td className="p-4 align-middle">Nov 18, 2025</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
