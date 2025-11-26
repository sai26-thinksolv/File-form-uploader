import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, Loader2, Check, Search, HardDrive } from "lucide-react";
import { EditorFormData } from "../types";

interface DriveFolderSelectProps {
    formData: EditorFormData;
    updateField: (field: string, value: any) => void;
}

interface DriveFolder {
    id: string;
    name: string;
    mimeType: string;
}

export function DriveFolderSelect({ formData, updateField }: DriveFolderSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [folders, setFolders] = useState<DriveFolder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchFolders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/drive/folders');
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Failed to fetch folders' }));
                throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            setFolders(data.folders || []);
        } catch (error: any) {
            console.error("Failed to fetch folders", error);
            setError(error.message || "Failed to load folders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchFolders();
        }
    }, [isOpen]);

    const handleSelect = (folder: DriveFolder) => {
        updateField('driveFolderId', folder.id);
        updateField('driveFolderName', folder.name);
        updateField('driveFolderUrl', `https://drive.google.com/drive/folders/${folder.id}`);
        setIsOpen(false);
    };

    const filteredFolders = folders.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Google Drive Folder</Label>
                    <p className="text-sm text-muted-foreground">Where files will be saved.</p>
                </div>
                {formData.driveFolderName ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
                        <Folder className="w-4 h-4" />
                        <span className="font-medium truncate max-w-[150px]">{formData.driveFolderName}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-1 hover:bg-green-100 text-green-700"
                            onClick={() => setIsOpen(true)}
                        >
                            Change
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsOpen(true)}
                        className="gap-2"
                    >
                        <HardDrive className="w-4 h-4" />
                        Select Folder
                    </Button>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Select Destination Folder</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search folders..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="h-[300px] overflow-y-auto border rounded-md p-2 space-y-1">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="text-sm">Loading folders...</span>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
                                    <Folder className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-sm font-medium">Error loading folders</p>
                                    <p className="text-xs text-center px-4">{error}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchFolders}
                                        className="mt-2"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            ) : filteredFolders.length > 0 ? (
                                filteredFolders.map(folder => (
                                    <button
                                        key={folder.id}
                                        onClick={() => handleSelect(folder)}
                                        className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 text-left transition-colors group"
                                    >
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                            <Folder className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-sm text-gray-700 flex-1 truncate">
                                            {folder.name}
                                        </span>
                                        {formData.driveFolderId === folder.id && (
                                            <Check className="w-4 h-4 text-indigo-600" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <Folder className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-sm">No folders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
