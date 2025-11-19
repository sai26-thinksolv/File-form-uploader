"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Save, Upload, Link2, Copy, Check } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function EditorPage() {
    const searchParams = useSearchParams()
    const tab = searchParams.get("tab") || "configuration"
    const [isPublishOpen, setIsPublishOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    // Configuration State
    const [driveEnabled, setDriveEnabled] = useState(true)
    const [metadataEnabled, setMetadataEnabled] = useState(false)
    const [subfolderEnabled, setSubfolderEnabled] = useState(true)
    const [smartGroupingEnabled, setSmartGroupingEnabled] = useState(true)
    const [acceptingResponses, setAcceptingResponses] = useState(true)
    const [linkExpiryEnabled, setLinkExpiryEnabled] = useState(false)

    // Design State
    const [primaryColor, setPrimaryColor] = useState("#4f46e5")
    const [backgroundColor, setBackgroundColor] = useState("#ffffff")
    const [fontFamily, setFontFamily] = useState("Inter")

    const copyLink = () => {
        navigator.clipboard.writeText("https://file-uploader.app/upload/ref-123")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-gray-900 flex items-center transition-colors">
                            ← Dashboard
                        </Link>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <h2 className="text-xl font-semibold text-gray-900">General Upload Form</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Save className="w-4 h-4 mr-2" />
                            Save Draft
                        </Button>

                        {/* Publishing Modal Trigger */}
                        <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                                    Send
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Share Form</DialogTitle>
                                    <DialogDescription>
                                        Anyone with this link can upload files to your form.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label>Public Link</Label>
                                        <div className="flex gap-2">
                                            <Input readOnly value="https://file-uploader.app/upload/ref-123" className="bg-gray-50" />
                                            <Button size="icon" variant="outline" onClick={copyLink}>
                                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 border rounded-lg text-center space-y-2 hover:bg-gray-50 cursor-pointer transition-colors">
                                            <div className="mx-auto w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                <Link2 className="w-5 h-5" />
                                            </div>
                                            <div className="text-sm font-medium">Shorten URL</div>
                                        </div>
                                        <div className="p-4 border rounded-lg text-center space-y-2 hover:bg-gray-50 cursor-pointer transition-colors">
                                            <div className="mx-auto w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                                                    <div className="bg-current rounded-[1px]"></div>
                                                    <div className="bg-current rounded-[1px]"></div>
                                                    <div className="bg-current rounded-[1px]"></div>
                                                    <div className="bg-current rounded-[1px]"></div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium">QR Code</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Email Invitation</Label>
                                        <div className="flex gap-2">
                                            <Input placeholder="user@example.com" />
                                            <Button variant="secondary">Invite</Button>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100"></div>

                                    <div className="space-y-4">
                                        <Label className="text-sm font-medium">Who can respond?</Label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="access" id="anyone" defaultChecked className="w-4 h-4 text-indigo-600" />
                                                <Label htmlFor="anyone" className="font-normal">Anyone with the link</Label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="access" id="invited" className="w-4 h-4 text-indigo-600" />
                                                <Label htmlFor="invited" className="font-normal">Invited people only</Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Centered with max-width */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Tabs Navigation */}
                {/* Tabs Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center p-1 rounded-full bg-gray-100/80 border border-gray-200 shadow-inner">
                        <Link
                            href="?tab=configuration"
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${tab === "configuration"
                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Configuration
                        </Link>
                        <Link
                            href="?tab=design"
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${tab === "design"
                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Design
                        </Link>
                    </div>
                </div>

                {tab === "configuration" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* General Info Card */}
                        <Card className="border-t-4 border-t-indigo-600 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">General Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="uploader-name">Uploader Name</Label>
                                    <Input
                                        id="uploader-name"
                                        defaultValue="General Upload Form"
                                        className="text-sm border-gray-200 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                        placeholder="Enter a description for your upload form..."
                                        defaultValue="Please upload your project files here. Supported formats: PDF, PNG, JPG."
                                    />
                                    <p className="text-xs text-muted-foreground text-right">0/1000 characters</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Setup */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Upload Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Google Drive Integration */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">Google Drive Integration</Label>
                                            <p className="text-sm text-muted-foreground">Save uploads directly to Drive.</p>
                                        </div>
                                        <Switch
                                            checked={driveEnabled}
                                            onCheckedChange={setDriveEnabled}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                    </div>
                                    <div className="pl-0 pt-2">
                                        <Label htmlFor="drive-folder" className="text-sm font-medium text-gray-700 mb-2 block">Destination Folder</Label>
                                        <div className="flex gap-3">
                                            <Input
                                                id="drive-folder"
                                                defaultValue="/Uploads/General"
                                                className="bg-gray-50 font-mono text-sm"
                                            />
                                            <Button variant="outline">Browse</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100"></div>

                                {/* Upload Type */}
                                <div className="space-y-3">
                                    <Label>Upload Type</Label>
                                    <select defaultValue="multiple" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option value="single">Single File</option>
                                        <option value="multiple">Multiple Files</option>
                                        <option value="folder">Folder Upload</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label>Allowed File Types</Label>
                                        <select defaultValue="any" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="any">Any file extension</option>
                                            <option value="images">Images only</option>
                                            <option value="docs">Documents only</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Max Upload Size</Label>
                                        <select defaultValue="any" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="any">Server Limit</option>
                                            <option value="100">100 MB</option>
                                            <option value="1024">1 GB</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organization */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm">Metadata Spreadsheet</Label>
                                        <p className="text-sm text-muted-foreground">Track upload details in a sheet.</p>
                                    </div>
                                    <Switch
                                        checked={metadataEnabled}
                                        onCheckedChange={setMetadataEnabled}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                </div>

                                <div className="border-t border-gray-100"></div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">Subfolder Organization</Label>
                                            <p className="text-sm text-muted-foreground">Create subfolders for uploads.</p>
                                        </div>
                                        <Switch
                                            checked={subfolderEnabled}
                                            onCheckedChange={setSubfolderEnabled}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                    </div>

                                    {subfolderEnabled && (
                                        <div className="space-y-6 pl-4 border-l-2 border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-sm">Smart Grouping</Label>
                                                    <p className="text-sm text-muted-foreground">Group by matching names.</p>
                                                </div>
                                                <Switch
                                                    checked={smartGroupingEnabled}
                                                    onCheckedChange={setSmartGroupingEnabled}
                                                    className="data-[state=checked]:bg-indigo-600"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label>Subfolder Name Pattern</Label>
                                                <Input
                                                    defaultValue="{Date} {Uploader Name}"
                                                    className="font-mono text-sm text-indigo-600"
                                                />
                                                <div className="flex gap-2 text-xs text-muted-foreground flex-wrap">
                                                    <span className="px-2 py-1 bg-gray-100 rounded border">Variables:</span>
                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100">Date</span>
                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100">Uploader Name</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Availability */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Availability & Access</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm">Accept Responses</Label>
                                        <p className="text-sm text-muted-foreground">Enable file uploads.</p>
                                    </div>
                                    <Switch
                                        checked={acceptingResponses}
                                        onCheckedChange={setAcceptingResponses}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                </div>

                                {acceptingResponses && (
                                    <>
                                        <div className="border-t border-gray-100"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm">Link Expiry</Label>
                                                <p className="text-sm text-muted-foreground">Auto-close after date.</p>
                                            </div>
                                            <Switch
                                                checked={linkExpiryEnabled}
                                                onCheckedChange={setLinkExpiryEnabled}
                                                className="data-[state=checked]:bg-indigo-600"
                                            />
                                        </div>
                                        {linkExpiryEnabled && (
                                            <div className="pl-4 border-l-2 border-indigo-100 flex flex-wrap gap-3">
                                                <Input type="date" className="w-full sm:w-auto" />
                                                <Input type="time" className="w-full sm:w-auto" />
                                            </div>
                                        )}
                                    </>
                                )}


                            </CardContent>
                        </Card>
                    </div>
                )}

                {tab === "design" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Visual Customization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Logo Upload */}
                                <div className="space-y-4">
                                    <Label className="text-sm">Brand Logo</Label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <Button variant="outline">Upload Logo</Button>
                                            <p className="text-xs text-muted-foreground">Recommended: 400x400px PNG</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100"></div>

                                {/* Colors */}
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Label className="text-sm">Primary Color</Label>
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 rounded-lg shadow-sm border border-gray-200" style={{ backgroundColor: primaryColor }}></div>
                                            <Input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-full h-10 p-1 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-sm">Background Color</Label>
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 rounded-lg shadow-sm border border-gray-200" style={{ backgroundColor: backgroundColor }}></div>
                                            <Input
                                                type="color"
                                                value={backgroundColor}
                                                onChange={(e) => setBackgroundColor(e.target.value)}
                                                className="w-full h-10 p-1 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100"></div>

                                {/* Typography */}
                                <div className="space-y-4">
                                    <Label className="text-sm">Typography</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { name: "Inter", style: "Sans-serif" },
                                            { name: "Roboto", style: "Classic" },
                                            { name: "Merriweather", style: "Serif" }
                                        ].map((font, i) => (
                                            <div
                                                key={i}
                                                className={`
                                                    flex flex-col p-3 rounded-lg border cursor-pointer transition-all
                                                    ${fontFamily === font.name
                                                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                                                        : "border-gray-200 hover:bg-gray-50"
                                                    }
                                                `}
                                                onClick={() => setFontFamily(font.name)}
                                            >
                                                <span className="font-semibold text-gray-900" style={{ fontFamily: font.name }}>Aa</span>
                                                <span className="text-sm mt-1">{font.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    )
}
