"use client"

import { useState, useEffect, Suspense, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, Upload, Link2, Copy, Check, ArrowLeft, ChevronRight, Loader2, Globe, Mail, QrCode, Trash2, Plus, GripVertical, X, FilePlus, Eye } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { QRCodeCanvas } from "qrcode.react"
import { AccessTab } from './components/AccessTab';
import { GooglePickerFolderSelect } from './components/GooglePickerFolderSelect';
import { BrandLoader } from './components/BrandLoader';
import { EditorFormData, UploadField, CustomQuestion } from './types';

function EditorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const formId = searchParams.get("id")


    const [isPublishOpen, setIsPublishOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const [logoUploading, setLogoUploading] = useState(false)
    const [showQrCode, setShowQrCode] = useState(false)
    const [shortenLoading, setShortenLoading] = useState(false)

    const [messageModal, setMessageModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'error'
    })

    // Auto-save
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState<EditorFormData>({
        id: "",
        title: "New Form",
        description: "",
        allowedTypes: "any",
        maxSizeMB: 100,
        driveEnabled: true,
        driveFolderId: "",
        driveFolderUrl: "",
        driveFolderName: "",
        isAcceptingResponses: true,
        expiryDate: null as string | null,
        enableMetadataSpreadsheet: false,
        subfolderOrganization: "NONE",
        customSubfolderField: "",
        enableSmartGrouping: false,
        logoUrl: "",
        primaryColor: "#4f46e5",
        secondaryColor: "#ffffff",
        backgroundColor: "#f3f4f6",
        fontFamily: "Inter",
        accessLevel: "ANYONE",
        allowedEmails: "",
        emailFieldControl: "OPTIONAL",
        uploadFields: [] as UploadField[],
        customQuestions: [] as CustomQuestion[],
        buttonTextColor: "#ffffff",
        cardStyle: "shadow",
        borderRadius: "md",
        coverImageUrl: "",
        isPublished: false,
    })

    const [isDraggingLogo, setIsDraggingLogo] = useState(false)
    const [isDraggingCover, setIsDraggingCover] = useState(false)

    const updateField = <K extends keyof EditorFormData>(field: K, value: EditorFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }



    const showMessage = (title: string, message: string, type: 'success' | 'error' = 'error') => {
        setMessageModal({ isOpen: true, title, message, type })
    }

    useEffect(() => {
        if (formId && formId !== 'new') {
            fetch(`/api/forms/${formId}`)
                .then(res => res.json())
                .then(data => {
                    // Parse JSON fields if they are strings (from DB)
                    const uploadFields = typeof data.uploadFields === 'string' ? JSON.parse(data.uploadFields) : data.uploadFields || []
                    const customQuestions = typeof data.customQuestions === 'string' ? JSON.parse(data.customQuestions) : data.customQuestions || []

                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        uploadFields,
                        customQuestions
                    }))
                })
                .catch(err => console.error('Failed to load form', err))
        }
    }, [formId])

    // Auto-save effect with debouncing
    const autoSave = useCallback(async () => {
        if (!formId || formId === 'new') return

        setIsSaving(true)
        try {
            await fetch(`/api/forms/${formId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
        } catch (error) {
            console.error('Auto-save failed:', error)
        } finally {
            setIsSaving(false)
        }
    }, [formId, formData])

    useEffect(() => {
        if (!formId || formId === 'new') return

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        // Debounce: save 1 second after last change
        saveTimeoutRef.current = setTimeout(() => {
            autoSave()
        }, 1000)

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [formData, formId, autoSave])

    const handleSave = async () => {
        setLoading(true)
        try {
            const method = formId && formId !== 'new' ? 'PUT' : 'POST'
            const url = formId && formId !== 'new' ? `/api/forms/${formId}` : '/api/forms'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push('/admin/dashboard')
            }
        } catch (error) {
            console.error('Save failed:', error)
            showMessage('Error', 'Failed to save form', 'error')
        } finally {
            setLoading(false)
        }
    }

    const uploadAsset = async (file: File, field: 'logoUrl' | 'coverImageUrl') => {
        setLogoUploading(true)
        try {
            const formDataObj = new FormData()
            formDataObj.append('file', file)
            if (formData.driveFolderId) {
                formDataObj.append('parentFolderId', formData.driveFolderId)
            }
            formDataObj.append('formTitle', formData.title || 'Untitled Form')

            const res = await fetch('/api/drive/upload-asset', {
                method: 'POST',
                body: formDataObj
            })

            if (res.ok) {
                const data = await res.json()
                updateField(field, data.url)

                // If the API created a new folder and returned its ID, update our state
                if (data.folderId && !formData.driveFolderId) {
                    updateField('driveFolderId', data.folderId)
                    showMessage('Folder Created', `Created new folder "${formData.title || 'Untitled Form'}" for assets.`, 'success')
                }
            } else {
                const err = await res.json()
                showMessage('Upload Failed', err.error || 'Upload failed', 'error')
            }
        } catch (error) {
            console.error('Upload error:', error)
            showMessage('Error', 'Upload failed', 'error')
        } finally {
            setLogoUploading(false)
        }
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) uploadAsset(file, 'logoUrl')
    }

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) uploadAsset(file, 'coverImageUrl')
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleLogoDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingLogo(true)
    }

    const handleLogoDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingLogo(false)
    }

    const handleCoverDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingCover(true)
    }

    const handleCoverDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingCover(false)
    }

    const handleLogoDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingLogo(false)

        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            uploadAsset(file, 'logoUrl')
        }
    }

    const handleCoverDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingCover(false)

        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            uploadAsset(file, 'coverImageUrl')
        }
    }

    const removeLogo = () => {
        updateField('logoUrl', '')
    }

    const copyLink = () => {
        const link = formId ? `${window.location.origin}/upload/${formId}` : 'Save form first'
        navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShortenUrl = () => {
        setShortenLoading(true)
        // Mock shortening for now
        setTimeout(() => {
            setShortenLoading(false)
            navigator.clipboard.writeText(formId ? `${window.location.origin}/s/${formId.slice(0, 6)}` : '')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }, 1000)
    }

    const addUploadField = () => {
        if (formData.uploadFields.length >= 3) return
        const newField = {
            id: crypto.randomUUID(),
            label: "Upload File",
            allowedTypes: "any",
            maxSizeMB: 10,
            required: true
        }
        updateField('uploadFields', [...formData.uploadFields, newField])
    }

    const removeUploadField = (id: string) => {
        updateField('uploadFields', formData.uploadFields.filter(f => f.id !== id))
    }

    const updateUploadFieldItem = <K extends keyof UploadField>(id: string, key: K, value: UploadField[K]) => {
        updateField('uploadFields', formData.uploadFields.map(f =>
            f.id === id ? { ...f, [key]: value } : f
        ))
    }

    const addCustomQuestion = () => {
        const newQuestion = {
            id: crypto.randomUUID(),
            type: "text",
            label: "New Question",
            required: false,
            options: []
        }
        updateField('customQuestions', [...formData.customQuestions, newQuestion])
    }

    const removeCustomQuestion = (id: string) => {
        updateField('customQuestions', formData.customQuestions.filter(q => q.id !== id))
    }

    const updateCustomQuestionItem = <K extends keyof CustomQuestion>(id: string, key: K, value: CustomQuestion[K]) => {
        updateField('customQuestions', formData.customQuestions.map(q =>
            q.id === id ? { ...q, [key]: value } : q
        ))
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Navigation & Title */}
                <div className="mb-8 space-y-4">
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{formData.title}</h1>
                        {isSaving && (
                            <div className="text-xs text-muted-foreground flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                                <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                                Saving...
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <div className="space-y-6">
                        {/* Professional Tab Navigation */}
                        <div className="mb-8 border-b border-gray-200">
                            <nav className=" flex -mb-px space-x-8" aria-label="Tabs">
                                {[
                                    { name: 'General', step: 0 },
                                    { name: 'Uploads', step: 1 },
                                    { name: 'Organization', step: 2 },
                                    { name: 'Access', step: 3 },
                                    { name: 'Design', step: 4 }
                                ].map((tab) => {
                                    const isActive = currentStep === tab.step;
                                    const isCompleted = currentStep > tab.step;

                                    return (
                                        <button
                                            key={tab.name}
                                            onClick={() => setCurrentStep(tab.step)}
                                            className={`
                                                group relative inline-flex items-center gap-2 py-4 px-1 
                                                border-b-2 font-medium text-sm transition-all duration-200
                                                ${isActive
                                                    ? 'border-gray-900 text-gray-900'
                                                    : isCompleted
                                                        ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        : 'border-transparent text-gray-400 hover:text-gray-500 hover:border-gray-200'
                                                }
                                            `}
                                        >
                                            {/* Step number/checkmark */}
                                            <span
                                                className={`
                                                    flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold
                                                    transition-colors duration-200
                                                    ${isActive
                                                        ? 'bg-gray-900 text-white'
                                                        : isCompleted
                                                            ? 'bg-gray-100 text-gray-600'
                                                            : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                                                    }
                                                `}
                                            >
                                                {isCompleted ? (
                                                    <Check className="w-3 h-3" />
                                                ) : (
                                                    tab.step + 1
                                                )}
                                            </span>

                                            {/* Tab label */}
                                            <span>{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Step 0: General Information */}
                        {currentStep === 0 && (
                            <Card className="border-t-4 border-t-indigo-600 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg">General Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="title">Form Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => updateField('title', e.target.value)}
                                            className="text-sm border-gray-200 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            className="min-h-[100px] resize-y"
                                            placeholder="Enter a description for your upload form..."
                                            value={formData.description || ''}
                                            onChange={(e) => updateField('description', e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground text-right">{formData.description?.length || 0}/1000 characters</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 1: Upload Settings */}
                        {currentStep === 1 && (
                            <Card className="shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg">Upload Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Google Drive Integration */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-semibold text-gray-900">Google Drive Integration</Label>
                                                <p className="text-sm text-muted-foreground">Save uploads directly to a Drive folder.</p>
                                            </div>
                                            <Switch
                                                checked={formData.driveEnabled}
                                                onCheckedChange={(c) => updateField('driveEnabled', c)}
                                                className="data-[state=checked]:bg-indigo-600"
                                            />
                                        </div>

                                        {formData.driveEnabled && (
                                            <div className="mt-4 p-4 border border-indigo-100 rounded-xl bg-indigo-50/30 animate-in fade-in slide-in-from-top-2">
                                                <GooglePickerFolderSelect formData={formData} updateField={updateField} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100"></div>

                                    {/* Multiple Upload Fields */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-semibold">File Upload Fields</Label>
                                            <Button variant="outline" size="sm" onClick={addUploadField} disabled={formData.uploadFields.length >= 3}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Field
                                            </Button>
                                        </div>
                                        {formData.uploadFields.map((field, index) => (
                                            <div key={field.id} className="group relative flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-300">
                                                <div className="text-gray-300 cursor-move hover:text-gray-500">
                                                    <GripVertical className="w-5 h-5" />
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => removeUploadField(field.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="flex-1 space-y-4">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</Label>
                                                            <Input
                                                                value={field.label}
                                                                onChange={(e) => updateUploadFieldItem(field.id, 'label', e.target.value)}
                                                                placeholder="e.g. Resume"
                                                                className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Allowed Types</Label>
                                                            <Select
                                                                value={field.allowedTypes}
                                                                onValueChange={(val) => updateUploadFieldItem(field.id, 'allowedTypes', val)}
                                                            >
                                                                <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:bg-white">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="any">Any file</SelectItem>
                                                                    <SelectItem value="images">Images only</SelectItem>
                                                                    <SelectItem value="docs">Documents only</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {formData.uploadFields.length === 0 && (
                                            <div className="text-center p-10 border border-gray-100 rounded-xl bg-gray-50/50 space-y-3">
                                                <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                                                    <FilePlus className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-900">No file upload fields added</h3>
                                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                                    Add a field to allow users to upload files.
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addUploadField}
                                                    className="mt-2"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Field
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100"></div>

                                    {/* Custom Questions */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base font-semibold">Custom Questions</Label>
                                                <p className="text-sm text-muted-foreground">Collect extra info (Optional)</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={addCustomQuestion}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Question
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.customQuestions.map((q, index) => (
                                                <div key={q.id} className="group relative flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-300">
                                                    <div className="text-gray-300 cursor-move hover:text-gray-500">
                                                        <GripVertical className="w-5 h-5" />
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => removeCustomQuestion(q.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>

                                                    <div className="flex-1 space-y-4">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</Label>
                                                                <Input
                                                                    value={q.label}
                                                                    onChange={(e) => updateCustomQuestionItem(q.id, 'label', e.target.value)}
                                                                    placeholder="e.g. What is your department?"
                                                                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</Label>
                                                                <Select
                                                                    value={q.type}
                                                                    onValueChange={(val) => updateCustomQuestionItem(q.id, 'type', val)}
                                                                >
                                                                    <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:bg-white">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="text">Short Text</SelectItem>
                                                                        <SelectItem value="textarea">Long Text</SelectItem>
                                                                        <SelectItem value="select">Dropdown</SelectItem>
                                                                        <SelectItem value="checkbox">Checkbox</SelectItem>
                                                                        <SelectItem value="radio">Radio</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        {(q.type === 'select' || q.type === 'radio') && (
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Options (comma separated)</Label>
                                                                <Input
                                                                    value={q.options?.join(', ') || ''}
                                                                    onChange={(e) => updateCustomQuestionItem(q.id, 'options', e.target.value.split(',').map((s: string) => s.trim()))}
                                                                    placeholder="Option 1, Option 2, Option 3"
                                                                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex items-center space-x-2 pt-1">
                                                            <Switch
                                                                checked={q.required}
                                                                onCheckedChange={(c) => updateCustomQuestionItem(q.id, 'required', c)}
                                                            />
                                                            <Label className="text-sm font-normal text-gray-600">Required field</Label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Organization */}
                        {currentStep === 2 && (
                            <Card className="shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
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
                                            checked={formData.enableMetadataSpreadsheet}
                                            onCheckedChange={(c) => updateField('enableMetadataSpreadsheet', c)}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                    </div>

                                    <div className="border-t border-gray-100"></div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">Subfolder Organization</Label>
                                            <p className="text-sm text-muted-foreground">Create subfolders for uploads.</p>
                                        </div>
                                        <Switch
                                            checked={formData.subfolderOrganization !== "NONE"}
                                            onCheckedChange={(c) => updateField('subfolderOrganization', c ? "DATE" : "NONE")}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                    </div>

                                    {formData.subfolderOrganization !== "NONE" && (
                                        <div className="space-y-6 pl-4 border-l-2 border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-200">


                                            <div className="space-y-3">
                                                <Label>Subfolder Name Pattern</Label>
                                                <Input
                                                    value={formData.customSubfolderField ?? "{Date} {Uploader Name}"}
                                                    onChange={(e) => updateField('customSubfolderField', e.target.value)}
                                                    className="font-mono text-sm text-indigo-600"
                                                />
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {['{Date}', '{Uploader Name}', '{Form Title}', '{Email}'].map((tag) => {
                                                        const currentVal = formData.customSubfolderField ?? "{Date} {Uploader Name}";
                                                        const isSelected = currentVal.includes(tag);

                                                        return (
                                                            <Button
                                                                key={tag}
                                                                variant="outline"
                                                                size="sm"
                                                                type="button"
                                                                className={`h-7 text-xs transition-all ${isSelected
                                                                    ? "bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200"
                                                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                                                                    }`}
                                                                onClick={() => {
                                                                    let newVal;
                                                                    if (isSelected) {
                                                                        newVal = currentVal.replace(tag, '').replace(/\s\s+/g, ' ').trim();
                                                                    } else {
                                                                        newVal = (currentVal + ' ' + tag).trim();
                                                                    }
                                                                    updateField('customSubfolderField', newVal);
                                                                }}
                                                            >
                                                                {isSelected ? <X className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                                                                {tag}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 3: Availability & Access */}
                        {currentStep === 3 && (
                            <AccessTab formData={formData} updateField={updateField} />
                        )}

                        {/* Step 4: Design */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Card className="shadow-sm border-t-4 border-t-indigo-600">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Design & Branding</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">Customize your form's visual appearance</p>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        {/* Logo & Cover Image */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Logo Upload */}
                                            <div className="space-y-3">
                                                <Label className="text-base font-semibold text-gray-900">Logo</Label>
                                                {formData.logoUrl ? (
                                                    <div className="relative group w-full">
                                                        <div className="border-2 border-gray-200 rounded-xl p-8 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center min-h-[180px] transition-all group-hover:border-indigo-300 group-hover:shadow-md">
                                                            <img src={formData.logoUrl} alt="Logo" className="max-h-24 max-w-full object-contain drop-shadow-sm" />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                            onClick={removeLogo}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <label
                                                        className={`block border-2 border-dashed rounded-xl px-6 py-10 text-center transition-all cursor-pointer group min-h-[180px] flex flex-col items-center justify-center relative overflow-hidden ${isDraggingLogo
                                                            ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02]'
                                                            : 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/30 hover:to-purple-50/30 hover:shadow-md'
                                                            }`}
                                                        onDragOver={handleDragOver}
                                                        onDragEnter={handleLogoDragEnter}
                                                        onDragLeave={handleLogoDragLeave}
                                                        onDrop={handleLogoDrop}
                                                    >
                                                        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity ${isDraggingLogo ? 'opacity-100' : ''}`}></div>
                                                        <Upload className={`w-12 h-12 transition-all mb-3 relative z-10 ${isDraggingLogo ? 'text-indigo-600 scale-110' : 'text-gray-400 group-hover:text-indigo-600 group-hover:scale-110'
                                                            }`} />
                                                        <p className="text-sm font-semibold text-gray-900 mb-1 relative z-10">
                                                            {isDraggingLogo ? 'Drop your logo here' : 'Click or drag logo here'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 relative z-10">PNG, JPG, or SVG • Maximum 5MB</p>
                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                                            onChange={handleLogoUpload}
                                                            disabled={logoUploading}
                                                            className="hidden"
                                                        />
                                                        {logoUploading && (
                                                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                                                                <BrandLoader className="w-12 h-12" />
                                                            </div>
                                                        )}
                                                    </label>
                                                )}
                                            </div>

                                            {/* Background Cover Upload */}
                                            <div className="space-y-3">
                                                <Label className="text-base font-semibold text-gray-900">Background Cover</Label>
                                                {formData.coverImageUrl ? (
                                                    <div className="relative group w-full">
                                                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white min-h-[180px] transition-all group-hover:border-indigo-300 group-hover:shadow-md">
                                                            <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover min-h-[180px]" />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                            onClick={() => updateField('coverImageUrl', '')}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <label
                                                        className={`block border-2 border-dashed rounded-xl px-6 py-10 text-center transition-all cursor-pointer group min-h-[180px] flex flex-col items-center justify-center relative overflow-hidden ${isDraggingCover
                                                            ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02]'
                                                            : 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/30 hover:to-purple-50/30 hover:shadow-md'
                                                            }`}
                                                        onDragOver={handleDragOver}
                                                        onDragEnter={handleCoverDragEnter}
                                                        onDragLeave={handleCoverDragLeave}
                                                        onDrop={handleCoverDrop}
                                                    >
                                                        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity ${isDraggingCover ? 'opacity-100' : ''}`}></div>
                                                        <Upload className={`w-12 h-12 transition-all mb-3 relative z-10 ${isDraggingCover ? 'text-indigo-600 scale-110' : 'text-gray-400 group-hover:text-indigo-600 group-hover:scale-110'
                                                            }`} />
                                                        <p className="text-sm font-semibold text-gray-900 mb-1 relative z-10">
                                                            {isDraggingCover ? 'Drop your cover here' : 'Click or drag cover image here'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 relative z-10">Recommended: 1920×1080px (16:9 aspect ratio)</p>
                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpeg,image/jpg"
                                                            onChange={handleCoverUpload}
                                                            disabled={logoUploading}
                                                            className="hidden"
                                                        />
                                                        {logoUploading && (
                                                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                                                                <BrandLoader className="w-12 h-12" />
                                                            </div>
                                                        )}
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200"></div>

                                        {/* Button Style & Card Style */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Button Style */}
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-base font-semibold text-gray-900">Button Style</Label>
                                                    <p className="text-xs text-gray-500 mt-1">Choose how buttons appear on your form</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        {
                                                            label: 'Solid',
                                                            value: 'solid',
                                                            preview: 'bg-indigo-600 text-white border-2 border-indigo-600'
                                                        },
                                                        {
                                                            label: 'Outline',
                                                            value: 'outline',
                                                            preview: 'bg-white text-indigo-600 border-2 border-indigo-600'
                                                        },
                                                        {
                                                            label: 'Ghost',
                                                            value: 'ghost',
                                                            preview: 'bg-transparent text-indigo-600 border-2 border-transparent hover:bg-indigo-50'
                                                        },
                                                        {
                                                            label: 'Gradient',
                                                            value: 'gradient',
                                                            preview: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-2 border-transparent'
                                                        },
                                                    ].map((option) => (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => updateField('buttonTextColor', option.value)}
                                                            className={`p-4 border-2 rounded-xl transition-all duration-200 group ${formData.buttonTextColor === option.value
                                                                ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]'
                                                                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                                                                }`}
                                                        >
                                                            <div className="text-xs font-semibold text-gray-900 mb-3">{option.label}</div>
                                                            <div className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-medium transition-all ${option.preview}`}>
                                                                Button
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Card Style */}
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-base font-semibold text-gray-900">Card Style</Label>
                                                    <p className="text-xs text-gray-500 mt-1">Choose how form cards are displayed</p>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        {
                                                            label: 'Shadow',
                                                            value: 'shadow',
                                                            preview: 'shadow-lg border border-gray-100'
                                                        },
                                                        {
                                                            label: 'Border',
                                                            value: 'border',
                                                            preview: 'border-2 border-gray-300'
                                                        },
                                                        {
                                                            label: 'Flat',
                                                            value: 'flat',
                                                            preview: 'border border-gray-200'
                                                        },
                                                    ].map((option) => (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => updateField('cardStyle', option.value as "shadow" | "flat" | "border")}
                                                            className={`p-4 border-2 rounded-xl transition-all duration-200 group ${formData.cardStyle === option.value
                                                                ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]'
                                                                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                                                                }`}
                                                        >
                                                            <div className="text-[10px] font-semibold text-gray-900 mb-2">{option.label}</div>
                                                            <div className={`h-12 rounded-lg bg-white ${option.preview}`}></div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Live Preview Card */}
                                <Card className="shadow-sm border-indigo-100">
                                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Eye className="w-5 h-5 text-indigo-600" />
                                                    Live Preview
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1">See how your form will appear to users</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {/* Preview Container */}
                                        <div className="bg-gray-100 rounded-xl p-8 min-h-[400px] relative overflow-hidden">
                                            {/* Cover Image Preview */}
                                            {formData.coverImageUrl && (
                                                <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden rounded-t-xl">
                                                    <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100"></div>
                                                </div>
                                            )}

                                            {/* Form Preview Content */}
                                            <div className={`relative ${formData.coverImageUrl ? 'mt-20' : ''}`}>
                                                {/* Logo Preview */}
                                                {formData.logoUrl && (
                                                    <div className="flex justify-center mb-6">
                                                        <img src={formData.logoUrl} alt="Logo" className="max-h-16 object-contain drop-shadow-md" />
                                                    </div>
                                                )}

                                                {/* Sample Form Card */}
                                                <div className={`max-w-md mx-auto bg-white rounded-xl p-6 ${formData.cardStyle === 'shadow' ? 'shadow-xl border border-gray-100' :
                                                    formData.cardStyle === 'border' ? 'border-2 border-gray-300' :
                                                        'border border-gray-200'
                                                    }`}>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.title || 'Your Form Title'}</h3>
                                                    <p className="text-sm text-gray-600 mb-6">{formData.description || 'Form description will appear here'}</p>

                                                    {/* Sample Input */}
                                                    <div className="space-y-4 mb-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700">Sample Field</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter text..."
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Sample Button Preview */}
                                                    <button
                                                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${formData.buttonTextColor === 'solid' ? 'bg-indigo-600 text-white border-2 border-indigo-600 hover:bg-indigo-700' :
                                                            formData.buttonTextColor === 'outline' ? 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50' :
                                                                formData.buttonTextColor === 'ghost' ? 'bg-transparent text-indigo-600 border-2 border-transparent hover:bg-indigo-50' :
                                                                    formData.buttonTextColor === 'gradient' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-2 border-transparent hover:from-indigo-700 hover:to-purple-700' :
                                                                        'bg-indigo-600 text-white'
                                                            }`}
                                                        disabled
                                                    >
                                                        Submit Button
                                                    </button>
                                                </div>

                                                {/* Preview Note */}
                                                <p className="text-xs text-center text-gray-500 mt-6 italic">
                                                    This is a preview. Changes are applied in real-time.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}


                        {/* Wizard Navigation */}
                        <div className="flex justify-between items-center pt-4">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save Draft'}
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                    >
                                        Back
                                    </Button>
                                )}

                                {currentStep < 4 ? (
                                    <Button
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                                                Publish
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0 border-0 shadow-2xl">
                                            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
                                                <DialogHeader className="text-white">
                                                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                                        <Globe className="w-6 h-6" />
                                                        Publish & Share
                                                    </DialogTitle>
                                                    <DialogDescription className="text-indigo-100 text-base">
                                                        Make your form live and start collecting responses.
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </div>

                                            <div className="p-6 space-y-8 bg-white">
                                                {/* Status Section */}
                                                <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 transition-all hover:border-indigo-200 hover:shadow-sm">
                                                    <div className="space-y-1">
                                                        <Label className="text-base font-semibold text-indigo-950">Accept Responses</Label>
                                                        <p className="text-sm text-indigo-600/80 font-medium">
                                                            {formData.isAcceptingResponses ? "Form is currently active" : "Form is paused"}
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={formData.isAcceptingResponses}
                                                        onCheckedChange={(c) => updateField('isAcceptingResponses', c)}
                                                        className="data-[state=checked]:bg-indigo-600"
                                                    />
                                                </div>

                                                {/* Link Section */}
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-medium text-gray-700">Public Link</Label>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1 group">
                                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                <Link2 className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                            </div>
                                                            <Input
                                                                readOnly
                                                                value={formId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/upload/${formId}` : 'Save form first'}
                                                                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all font-mono text-sm"
                                                            />
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={copyLink}
                                                            className="shrink-0 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                                                        >
                                                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div
                                                        className="group p-4 border border-gray-200 rounded-xl text-center space-y-3 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all duration-200"
                                                        onClick={handleShortenUrl}
                                                    >
                                                        <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-200">
                                                            {shortenLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Link2 className="w-6 h-6" />}
                                                        </div>
                                                        <div className="font-medium text-gray-900">Shorten URL</div>
                                                    </div>

                                                    <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
                                                        <DialogTrigger asChild>
                                                            <div className="group p-4 border border-gray-200 rounded-xl text-center space-y-3 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all duration-200">
                                                                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-200">
                                                                    <QrCode className="w-6 h-6" />
                                                                </div>
                                                                <div className="font-medium text-gray-900">QR Code</div>
                                                            </div>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-sm flex flex-col items-center justify-center py-10">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-center">Scan to Upload</DialogTitle>
                                                                <DialogDescription className="text-center">
                                                                    Scan this QR code to open the upload form on your mobile device.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
                                                                <QRCodeCanvas
                                                                    value={formId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/upload/${formId}` : ''}
                                                                    size={200}
                                                                    level={"H"}
                                                                    includeMargin={true}
                                                                />
                                                            </div>
                                                            <Button className="mt-6 w-full" onClick={() => window.print()}>
                                                                Print QR Code
                                                            </Button>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>

                                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                                    <Label className="text-sm font-medium text-gray-700">Who can respond?</Label>
                                                    <RadioGroup
                                                        value={formData.accessLevel}
                                                        onValueChange={(val) => updateField('accessLevel', val as "ANYONE" | "INVITED")}
                                                        className="grid grid-cols-2 gap-4"
                                                    >
                                                        <div className={`relative flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.accessLevel === 'ANYONE' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                            <RadioGroupItem value="ANYONE" id="anyone" className="mt-1" />
                                                            <div className="space-y-1">
                                                                <Label htmlFor="anyone" className="font-medium cursor-pointer">Public</Label>
                                                                <p className="text-xs text-muted-foreground">Anyone with the link</p>
                                                            </div>
                                                        </div>
                                                        <div className={`relative flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.accessLevel === 'INVITED' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                            <RadioGroupItem value="INVITED" id="invited" className="mt-1" />
                                                            <div className="space-y-1">
                                                                <Label htmlFor="invited" className="font-medium cursor-pointer">Restricted</Label>
                                                                <p className="text-xs text-muted-foreground">Invited people only</p>
                                                            </div>
                                                        </div>
                                                    </RadioGroup>

                                                    {formData.accessLevel === 'INVITED' && (
                                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                            <Label className="text-sm font-medium text-gray-700">Email Invitations</Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder="Enter email addresses (comma separated)"
                                                                    value={formData.allowedEmails}
                                                                    onChange={(e) => updateField('allowedEmails', e.target.value)}
                                                                />
                                                                <Button size="icon" variant="outline">
                                                                    <Mail className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Only these email addresses will be able to access the form.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Publish Button */}
                                                <Button
                                                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-[1.02]"
                                                    onClick={handleSave}
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                            Publishing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Publish Form
                                                            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Message Modal */}
                <Dialog open={messageModal.isOpen} onOpenChange={(open) => setMessageModal(prev => ({ ...prev, isOpen: open }))}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className={messageModal.type === 'error' ? 'text-red-600' : 'text-green-600'}>
                                {messageModal.title}
                            </DialogTitle>
                            <DialogDescription>
                                {messageModal.message}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <EditorContent />
        </Suspense>
    )
}
